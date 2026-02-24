Claro! Aqui está um **tutorial passo a passo para fazer o *deploy* do seu projeto Node.js (API + Front) no Render.com** 🚀

> **Observação:** esse tutorial assume que seu projeto está no **GitHub** (se não estiver, posso te explicar como subir também 👍)

---

## 🚀 Passo a Passo: Deploy no Render

---

### 1️⃣ Criar conta no Render

Primeiro acesso:

1. Acesse: **[https://render.com/](https://render.com/)**
2. Clique em **Get Stardet**
3. Faça login com **GitHub** (recomendado)
4. Autorize o acesso ao repositório> "Authorize Render"
5. ESCOLHA Web Services (New Web Service)
6. Configure and deploy your new Web Service: escolha github e escolha o seu projeto
7. Em Configure and deploy your new Web Service: Selecione o seu projeto, clique em Free e depois no final da página, clique em Deploy WebService
8.Ocorrerá o build da aplicação: https://api-node-mvc-iff-2026.onrender.com/
---





### 2️⃣ Conferir o seu projetoprojeto Node + Express + HTML



### 2️⃣ Preparar seu projeto

Antes do deploy, ajuste 2 coisas no seu projeto:

---

#### 📌 **server.js**

Troque a porta fixa por variável:

```js
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
```

> Isso é obrigatório para funcionar no Render 😉

---

#### 📌 **package.json**

Certifique que tem este trecho:

```json
{
  "type": "module",
  "scripts": {
    "start": "node server.js"
  }
}
```
Em produção, você não deve fixar o host como localhost.

O Render precisa que o app escute em 0.0.0.0.

Troque isso:

const HOST = 'localhost';

Por isso:

const HOST = '0.0.0.0';

OU ainda melhor (mais simples):


Versão ideal para produção (Render)
Remova o HOST completamente e deixe assim:

```json
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
```

---

### 3️⃣ Subir o projeto no GitHub

Se ainda não fez isso:

1. Crie um repositório no GitHub
2. Na pasta do projeto:

```bash
git init
git add .
git commit -m "Deploy no Render"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/NOME_REPO.git
git push -u origin main
```

---

### 4️⃣ Criar Web Service no Render

1. Acesse seu painel no **Render**
2. Clique em **New → Web Service**
3. Conecte ao GitHub
4. Selecione o repositório do seu projeto
5. Configure assim:

| Campo              | O que colocar                         |
| ------------------ | ------------------------------------- |
| **Name**           | nome do serviço (ex: `api-node-mvc`)  |
| **Region**         | mais próximo de você                  |
| **Branch**         | `main`                                |
| **Root Directory** | deixe vazio se o projeto está na raiz |
| **Build Command**  | `npm install`                         |
| **Start Command**  | `npm start`                           |
| **Environment**    | Node (automatic)                      |

6. Clique em **Create Web Service**

---

### 5️⃣ O Render começa a publicar

⏳ Ele vai:

✔ Clonar o repositório
✔ Instalar dependências
✔ Rodar seu projeto

No fim você verá o status:

> **Live at [https://seu-projeto.onrender.com](https://seu-projeto.onrender.com)**

---

## 🎉 Testando

👉 Abra o link que o Render gerou.
Você deve ver seu:

✔ Front (HTML)
✔ API funcionando

Exemplo de rota funcionando:

```
GET https://seu-projeto.onrender.com/api/users
```

---

## ✅ Dicas Extras

### 🔹 Atualizar deploy sempre que mudar o código

Basta fazer commit e push no GitHub:

```bash
git add .
git commit -m "Nova mudança"
git push
```

O Render **recompila automaticamente** 🎉

---

### 🔹 Ver logs de erro

No dashboard do Render:
➡️ Clicando no serviço
➡️ Aba **Logs**
Você vê o que deu errado se houver falha!

---

## 🧠 Resumo

| Etapa                      | Feito? |
| -------------------------- | ------ |
| Ajustar server.js          | ✅      |
| Subir no GitHub            | ✅      |
| Conectar Render com GitHub | ✅      |
| Configurar Web Service     | ✅      |
| Deploy rodando             | 🎉     |

---

Se quiser, posso gerar um **vídeo passo-a-passo**, ou te guiar para conectar também **banco de dados** (SQLite / PostgreSQL / MongoDB) 👌