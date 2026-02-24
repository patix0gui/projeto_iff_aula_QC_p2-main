# Issue002: Criação de Registro de Usuários (Arquitetura MVC)

## Descrição:

Implementar a funcionalidade de **cadastro de usuários** seguindo o padrão **MVC (Model–View–Controller)**.
O objetivo é permitir que novos usuários se registrem no sistema de forma segura, validada e organizada, respeitando as responsabilidades de cada camada da arquitetura.

---

## Funcionalidades requeridas:

* Exibir formulário de cadastro de usuário (Front)
* Receber e validar dados do usuário
* Criar um novo usuário no banco de dados
* Garantir unicidade de e-mail/username
* Agora não precisa de Armazenar a senha de forma segura (hash)
* Retornar mensagens claras de sucesso ou erro

---

## Comportamento esperado:

* O usuário acessa a tela de cadastro
* Preenche os campos obrigatórios
* Ao submeter:

  * Dados válidos → usuário é criado com sucesso
  * Dados inválidos → mensagens de erro são exibidas
* Senhas **não devem** ser armazenadas em texto puro
* Usuários duplicados não devem ser criados

---

## Guia técnico:

**Model**

* Criar modelo `User`
* Campos mínimos:

  * `id`
  * `name`
  * `email`
  * `password`
  * `is_active`
  * `created_at`
  * `updated_at`
  
* Implementar regras de validação e 
* não precisa de hash de senha

**Controller**

* Criar `UserController`
* Método `create` → exibe formulário
* Método `store` → processa o cadastro
* Validar entrada de dados
* Tratar erros e respostas

**View**

* Criar tela de cadastro (`register`)
* Formulário com campos:

  * Nome
  * Email
  * Senha
  * Confirmação de senha
* Exibir mensagens de erro e sucesso

---

## Critérios de aceitação:

* [ ] Usuário consegue acessar a tela de cadastro
* [ ] Campos obrigatórios são validados
* [ ] E-mail duplicado não é permitido
* [ ] Não precisa que a Senha é armazenada com hash
* [ ] Usuário é salvo corretamente no banco
* [ ] Mensagens de erro são claras e objetivas
* [ ] Código segue padrão MVC
* [ ] Cobertura mínima de testes (se aplicável)

---