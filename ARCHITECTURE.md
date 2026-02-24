# Backend Architecture

Este projeto segue as **Backend Development Guidelines** com arquitetura em camadas.

## 📁 Estrutura de Pastas

```
projeto_iff_aula_QC/
├── src/
│   ├── controllers/          # Controllers (coordenam requisições)
│   │   ├── BaseController.js # Classe base com error handling
│   │   └── userController.js # UserController extends BaseController
│   ├── services/             # Business logic (framework-agnostic)
│   │   └── userService.js    # Lógica de negócio de usuários
│   ├── data/                 # Data layer (repositories)
│   │   └── data.js           # UserData class (in-memory data)
│   └── routes/               # Route definitions only
│       └── userRoutes.js     # User routes
├── public/                   # Frontend estático
│   ├── index.html
│   └── script.js
├── server.js                 # Express app setup
├── package.json
└── .gitignore
```

## 🏗️ Arquitetura em Camadas

### Fluxo de Requisição

```
Request → Routes → Controller → Service → Data Layer → Database/Memory
                     ↓             ↓          ↓
                  HTTP Layer   Business   Data Access
```

### 1. **Routes** (`src/routes/`)
- **Responsabilidade:** APENAS definir rotas
- **NÃO deve:** Conter lógica de negócio
- **Exemplo:**
```javascript
router.get('/', async (req, res) => 
  userController.getAllUsers(req, res)
);
```

### 2. **Controllers** (`src/controllers/`)
- **Responsabilidade:** Coordenar requisições HTTP
- **Herdam:** `BaseController`
- **Fazem:**
  - Parse de request
  - Chamada de services
  - Formatação de response
  - Error handling via BaseController
- **NÃO fazem:** Lógica de negócio

**BaseController Features:**
- `handleSuccess(res, data, statusCode)`
- `handleError(error, res, context)`
- `handleNotFound(res, message)`
- `handleBadRequest(res, message)`
- `handleCreated(res, data)`

### 3. **Services** (`src/services/`)
- **Responsabilidade:** Lógica de negócio
- **São:** Framework-agnostic e testáveis
- **Fazem:**
  - Validações de negócio
  - Orquestração de múltiplos repositories
  - Regras de negócio
- **NÃO sabem:** Sobre HTTP (Request/Response)

### 4. **Data Layer** (`src/data/`)
- **Responsabilidade:** Acesso aos dados
- **Padrão:** Repository pattern
- **Encapsula:** Queries e operações de dados

## 📝 Convenções de Nomenclatura

| Layer      | Convenção                |
|------------|--------------------------|
| Controller | `PascalCaseController.js`|
| Service    | `camelCaseService.js`    |
| Data/Repo  | `camelCase.js`           |
| Routes     | `camelCaseRoutes.js`     |

## 🔄 Dependency Injection

Services recebem dependências via construtor:

```javascript
class UserService {
  constructor(dataRepository = userData) {
    this.dataRepository = dataRepository;
  }
}
```

**Benefícios:**
- Facilita testes (mocking)
- Dependências explícitas
- Loose coupling

## 🎯 Singleton Pattern

Controllers, Services e Repositories exportam instâncias únicas:

```javascript
const userControllerInstance = new UserController();
export default userControllerInstance;
```

## 🚨 Error Handling

### Níveis de Error Handling:

1. **Service Layer:** Captura e adiciona contexto
2. **Controller Layer:** Usa BaseController helpers
3. **Global Error Handler:** Catch-all em server.js

### Exemplo:

```javascript
// Service
async getUserById(id) {
  try {
    const user = this.dataRepository.getById(id);
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }
    return user;
  } catch (error) {
    console.error('[UserService.getUserById] Error:', error);
    throw error;
  }
}

// Controller
async getUserById(req, res) {
  try {
    const user = await this.userService.getUserById(id);
    this.handleSuccess(res, { data: user });
  } catch (error) {
    if (error.statusCode === 404) {
      this.handleNotFound(res, error.message);
    } else {
      this.handleError(error, res, 'UserController.getUserById');
    }
  }
}
```

## 📡 API Endpoints

### Users

| Method | Endpoint        | Descrição           |
|--------|----------------|---------------------|
| GET    | /api/users     | Listar usuários     |
| GET    | /api/users/:id | Buscar por ID       |
| POST   | /api/users     | Criar usuário       |
| PUT    | /api/users/:id | Atualizar usuário   |
| DELETE | /api/users/:id | Remover usuário     |

## 🧪 Testing Strategy

### Unit Tests
- Services (business logic)
- Data layer methods

### Integration Tests
- Routes + Controllers
- Full request/response cycle

## 🚀 Como Executar

```bash
# Desenvolvimento (com nodemon)
npm run dev

# Produção
npm start
```

## 📦 Scripts Disponíveis

```json
{
  "start": "node server.js",
  "dev": "nodemon server.js",
  "test": "echo \"Error: no test specified\" && exit 1"
}
```

## 🔐 Boas Práticas

### ✅ SEMPRE

- Usar arquitetura em camadas
- Validar entrada de dados
- Logar erros com contexto
- Usar dependency injection
- Escrever testes

### ❌ NUNCA

- Lógica de negócio em routes
- Pular camadas (routes → data)
- Acessar dados diretamente em controllers
- Ignorar erros silenciosamente
- Usar `console.log` para erros críticos (usar Sentry em produção)

## 🎓 Próximos Passos

Para produção, considere adicionar:

- [ ] Zod para validação de schema
- [ ] Sentry para error tracking
- [ ] Testes unitários e de integração
- [ ] Database real (Prisma + PostgreSQL)
- [ ] Environment config (dotenv)
- [ ] Rate limiting
- [ ] Authentication middleware
- [ ] API documentation (Swagger)
- [ ] Logging framework (Winston/Pino)

## 📚 Referências

- Backend Development Guidelines (`.prompts/backend-dev-guidelines/`)
- Express.js Best Practices
- Clean Architecture Principles
