# SQLite Database Setup

Este projeto usa **SQLite** com `better-sqlite3` para persistência de dados.

## 🗄️ Visão Geral

- **Database:** SQLite (arquivo local)
- **Driver:** better-sqlite3 (síncrono, alta performance)
- **Location:** `database.sqlite` (raiz do projeto)
- **Auto-init:** Banco é inicializado automaticamente ao iniciar o servidor

## 📦 Estrutura do Banco

### Tabela: `users`

```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  age INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## 🚀 Comandos Disponíveis

### Inicializar o banco de dados

```bash
npm run db:setup
```

Cria as tabelas e adiciona dados iniciais (seed) se não existirem.

### Resetar o banco de dados

```bash
npm run db:reset
```

**⚠️ ATENÇÃO:** Remove todos os dados e recria o banco com dados de seed.

### Iniciar o servidor (com auto-init)

```bash
npm run dev
```

O banco será inicializado automaticamente se não existir.

## 📁 Arquivos Relacionados

```
src/
├── config/
│   ├── database.js     # Configuração e conexão com SQLite
│   └── migrations.js   # Scripts de criação de tabelas e seed
├── data/
│   └── data.js         # UserData repository (SQL queries)
scripts/
└── setupDatabase.js    # Script CLI para setup/reset
```

## 🔧 Configuração

### database.js

- Gerencia a conexão com SQLite
- Singleton pattern
- Ativa foreign keys
- Localização: `database.sqlite` na raiz

### migrations.js

Funções disponíveis:

- `createTables()` - Cria tabelas
- `dropTables()` - Remove tabelas
- `seedData()` - Insere dados iniciais
- `initializeDatabase()` - Setup completo
- `resetDatabase()` - Reset completo

## 💾 Repository Pattern

A classe `UserData` encapsula todas as operações SQL:

### Métodos Disponíveis

```javascript
// Buscar
userData.getAll()              // Todos os usuários
userData.getById(id)           // Por ID
userData.findByEmail(email)    // Por email
userData.searchByName(term)    // Busca parcial por nome

// Manipular
userData.create(user)          // Criar
userData.update(id, data)      // Atualizar
userData.delete(id)            // Deletar

// Estatísticas
userData.count()               // Total de usuários
```

### Tratamento de Erros

- **Constraint Violation:** Email duplicado retorna erro 400
- **Not Found:** Operações em IDs inexistentes retornam erro 404
- Erros são propagados com `statusCode` para o controller

## 📊 Dados Iniciais (Seed)

O banco é populado automaticamente com 5 usuários:

1. João Silva (28 anos)
2. Maria Santos (32 anos)
3. Pedro Oliveira (25 anos)
4. Ana Costa (30 anos)
5. Carlos Souza (45 anos)

## 🔄 Fluxo de Dados

```
Controller → Service → Repository (UserData) → SQLite
                                   ↓
                              Prepared Statements
                                   ↓
                            Transações Seguras
```

## 🛡️ Segurança

- **Prepared Statements:** Todas as queries usam `?` placeholders
- **SQL Injection:** Proteção automática via prepared statements
- **Foreign Keys:** Habilitadas por padrão
- **Unique Constraints:** Email é único

## 📝 Exemplos de Uso

### Query Manual

```javascript
import dbConfig from './src/config/database.js';

const db = dbConfig.getDB();
const users = db.prepare('SELECT * FROM users').all();
console.log(users);

dbConfig.close();
```

### Via Repository

```javascript
import userData from './src/data/data.js';

// Buscar todos
const users = userData.getAll();

// Criar novo
const newUser = userData.create({
  name: 'Novo Usuário',
  email: 'novo@email.com',
  age: 25
});

// Atualizar
const updated = userData.update(1, { age: 30 });

// Deletar
userData.delete(5);
```

## 🧪 Testing

Para testes, considere criar um banco separado:

```javascript
// test/setup.js
import Database from 'better-sqlite3';
const testDb = new Database(':memory:'); // In-memory para testes
```

## 🔍 Debugging

Para ver queries SQL executadas:

```javascript
// src/config/database.js
this.db = new Database(DB_PATH, { 
  verbose: console.log  // Já habilitado
});
```

## 📌 Notas Importantes

1. O arquivo `database.sqlite` **não** é commitado (está no .gitignore)
2. Cada desenvolvedor precisa rodar `npm run db:setup` localmente
3. O banco é inicializado automaticamente ao rodar `npm run dev`
4. Better-sqlite3 é **síncrono** - não use `await` nas queries
5. Conexão é singleton - uma única instância compartilhada

## 🚨 Troubleshooting

### Erro: "Database is locked"

```bash
# Matando processos node
killall node

# Deletando o banco e recriando
rm database.sqlite
npm run db:setup
```

### Erro: "Table already exists"

```bash
# Use reset para limpar tudo
npm run db:reset
```

### Banco não inicializa

```bash
# Setup manual
npm run db:setup

# Verificar logs do servidor
npm run dev
```

## 🔗 Próximos Passos (Produção)

Para ambiente de produção, considere:

- [ ] Usar PostgreSQL/MySQL para produção
- [ ] Implementar sistema de migrations versionadas
- [ ] Adicionar indexes para performance
- [ ] Implementar backup automático
- [ ] Connection pooling (se migrar para driver assíncrono)
- [ ] Configurar WAL mode para concorrência

## 📚 Referências

- [better-sqlite3 Documentation](https://github.com/WiseLibs/better-sqlite3)
- [SQLite Documentation](https://www.sqlite.org/docs.html)
- [Repository Pattern](https://martinfowler.com/eaaCatalog/repository.html)
