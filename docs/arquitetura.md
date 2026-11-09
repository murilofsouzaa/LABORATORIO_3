# 🏛️ Arquitetura do Sistema e Decisões de Design

Este documento documenta as decisões arquiteturais adotadas no **Sistema de Moeda Estudantil**, detalhando o padrão **MVC (Model-View-Controller)**, os fluxos de dados, a camada de persistência e a integração com serviços externos (envio de e-mails).

---

## 1. Padrão Arquitetural MVC

Conforme estabelecido pela especificação do projeto (seção 3 e 4 do documento acadêmico), o sistema adota estritamente o padrão **MVC (Model-View-Controller)**, assegurando separação clara de responsabilidades, desacoplamento e manutenibilidade.

```mermaid
graph TD
    User([Usuário / Navegador]) -->|1. Interação / Requisição HTTP| View[View - Camada de Apresentação]
    View -->|2. Encaminha Requisição| Controller[Controller - Camada de Controle]
    Controller -->|3. Invoca Regras de Negócio| Model[Model - Camada de Domínio / Dados]
    Model -->|4. Operações CRUD / ACID| DB[(Base de Dados Relacional)]
    DB -->|5. Retorno de Dados| Model
    Model -->|6. Retorna Entidades/Estado| Controller
    Controller -->|7. Dispara Notificação Assíncrona| EmailService[Serviço de E-mail]
    Controller -->|8. Atualiza Modelo na Visão| View
    View -->|9. Renderização da Resposta HTML/JSON| User
```

### 1.1 Camada View (Apresentação)
- Responsável por renderizar a interface de usuário (HTML5, CSS3, JavaScript responsivo).
- Não contém regras de negócio ou lógica de acesso ao banco de dados.
- Captura interações (cliques, preenchimento de formulários) e despacha requisições para os controladores correspondentes.
- Telas principais:
  - Tela de Login e Seleção de Perfil.
  - Tela de Cadastro de Aluno (com seleção de Instituição de Ensino pré-cadastrada).
  - Tela de Cadastro de Empresa Parceira.
  - Painel do Professor (Saldo semestral, formulário de envio de moedas com justificativa obrigatória e extrato).
  - Painel do Aluno (Saldo acumulado, extrato de entradas e saídas, catálogo de vantagens disponíveis para resgate).
  - Painel da Empresa Parceira (Cadastro de novas vantagens com foto, descrição e custo, e validação de cupons).

### 1.2 Camada Controller (Controle)
- Ponto de entrada de requisições vindas da interface (rotas e handlers).
- Responsável por validar parâmetros de entrada, gerenciar sessões e autenticação.
- Coordena a chamada aos serviços da camada de domínio (`Model`).
- Aciona o serviço de e-mail ao término de transações que exigem notificações ou cupons de resgate.
- Seleciona e redireciona para a View apropriada com os dados a serem exibidos.

### 1.3 Camada Model (Negócio e Persistência)
- Contém as entidades de negócio (`Utilizador`, `Aluno`, `Professor`, `EmpresaParceira`, `Instituicao`, `Vantagem`, `Transacao`).
- Implementa as regras de negócio invariantes (ex.: validação de saldo antes do débito, garantia de justificativa não-vazia, acúmulo de saldo semestral).
- Implementa a persistência de dados utilizando ORM ou o padrão DAO (Data Access Object), conforme planejado para a Sprint 2.

---

## 2. Fluxos Principais do Sistema

### 2.1 Fluxo de Envio de Moedas (Professor -> Aluno)

Abaixo, o diagrama de sequência detalha o fluxo completo de bonificação:

```mermaid
sequenceDiagram
    autonumber
    actor Prof as Professor
    participant View as View (Frontend)
    participant Ctrl as MoedaController
    participant Model as TransacaoService / Model
    participant BD as Base de Dados
    participant Email as Serviço de Email
    actor Aluno as Aluno

    Prof->>View: Seleciona aluno, valor e insere justificativa
    View->>Ctrl: POST /transacoes/enviar (alunoId, valor, motivo)
    Ctrl->>Model: transferirMoedas(profId, alunoId, valor, motivo)
    Model->>BD: Consultar saldo do Professor
    BD-->>Model: Saldo retornado
    alt Saldo insuficiente ou motivo em branco
        Model-->>Ctrl: Lança Exceção de Negócio
        Ctrl-->>View: Exibe mensagem de erro na tela
    else Saldo suficiente e dados válidos
        Model->>BD: Iniciar Transação ACID
        Model->>BD: UPDATE Professor SET saldo = saldo - valor
        Model->>BD: UPDATE Aluno SET saldo = saldo + valor
        Model->>BD: INSERT INTO Transacao (remetente, destinatario, valor, motivo, data)
        Model->>BD: COMMIT Transação
        Model-->>Ctrl: Sucesso (Transação criada)
        Ctrl-)Email: Disparo assíncrono: Notificar Aluno (valor, professor, motivo)
        Email--)Aluno: Recebe e-mail com detalhes da bonificação
        Ctrl-->>View: Redireciona com mensagem de sucesso e extrato atualizado
        View-->>Prof: Renderiza tela com saldo atualizado
    end
```

---

### 2.2 Fluxo de Resgate de Vantagem (Aluno -> Empresa Parceira)

Abaixo, o fluxo de resgate com débito de saldo, emissão e conferência de cupom:

```mermaid
sequenceDiagram
    autonumber
    actor Aluno as Aluno
    participant View as View (Frontend)
    participant Ctrl as VantagemController
    participant Model as ResgateService / Model
    participant BD as Base de Dados
    participant Email as Serviço de Email
    actor Emp as Empresa Parceira

    Aluno->>View: Seleciona vantagem e clica em Resgatar
    View->>Ctrl: POST /vantagens/{id}/resgatar
    Ctrl->>Model: processarResgate(alunoId, vantagemId)
    Model->>BD: Consultar saldo do Aluno e custo da Vantagem
    BD-->>Model: Dados obtidos
    alt Saldo menor que o custo
        Model-->>Ctrl: Lança Exceção: Saldo insuficiente
        Ctrl-->>View: Exibe erro para o Aluno
    else Saldo suficiente
        Model->>Model: Gerar código único de cupom (ex.: CUPOM-98F4-A12B)
        Model->>BD: Iniciar Transação ACID
        Model->>BD: UPDATE Aluno SET saldo = saldo - custo
        Model->>BD: INSERT INTO Transacao (alunoId, vantagemId, codigoCupom, data)
        Model->>BD: COMMIT Transação
        Model-->>Ctrl: Sucesso (Cupom e Transação gerados)
        Ctrl-)Email: Enviar cupom com código ao Aluno
        Email--)Aluno: E-mail com cupom para troca presencial
        Ctrl-)Email: Enviar notificação com o mesmo código à Empresa
        Email--)Emp: E-mail com código para conferência na loja
        Ctrl-->>View: Exibe confirmação com código gerado
    end
```

---

## 3. Integração com Serviços Externos

### 3.1 Serviço de E-mail
O sistema possui acoplamento fraco com o envio de mensagens, podendo utilizar:
- Protocolo SMTP padrão (ex.: Gmail, SendGrid, Mailgun ou servidor institucional da PUC Minas).
- Mock/Ambiente de testes (ex.: Mailtrap, FakeSMTP ou logs locais em ambiente de desenvolvimento).

### 3.2 Camada de Persistência (Planejamento Sprint 2)
- Sistema Gerenciador de Banco de Dados Relacional (PostgreSQL / MySQL / SQLite).
- Estrutura projetada para garantir idempotência em operações financeiras e concorrência segura em transações de saldo.
