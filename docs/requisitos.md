# 📋 Especificação de Requisitos e Histórias de Usuário

Este documento detalha o escopo, as regras de negócio, os requisitos funcionais e não-funcionais, e as histórias de usuário do **Sistema de Moeda Estudantil**, em conformidade com a especificação do **Laboratório 3 de Projeto de Software** (PUC Minas).

---

## 1. Visão Geral do Sistema

O **Sistema de Moeda Estudantil** tem como objetivo incentivar e reconhecer o mérito acadêmico e a participação discente por meio de uma economia virtual baseada em moedas de mérito. O ecossistema conecta quatro entidades principais:

- **Alunos**: Recebem moedas como mérito acadêmico e trocam por vantagens e benefícios cadastrados.
- **Professores**: Distribuem semestralmente seu saldo de moedas bonificando alunos com justificativa formal.
- **Empresas Parceiras**: Cadastram vantagens (produtos, descontos, serviços) e validam resgates dos alunos.
- **Instituições de Ensino**: Mantêm a base de departamentos, cursos e efetuam o pré-cadastro do corpo docente.

---

## 2. Regras de Negócio (RN)

| Identificador | Regra de Negócio | Descrição Detalhada |
| :--- | :--- | :--- |
| **RN01** | **Cadastro de Aluno** | O aluno realiza o autocadastro informando Nome, Email, CPF, RG, Endereço, Curso e selecionando uma Instituição de Ensino previamente cadastrada no sistema. |
| **RN02** | **Pré-cadastro de Professores** | Os professores não se autocadastram; são pré-cadastrados no sistema a partir de lista fornecida pela instituição parceira. Seus dados incluem Nome, CPF, Departamento e Instituição de Ensino vinculada. |
| **RN03** | **Carga e Acúmulo de Moedas** | A cada início de semestre letivo, o professor recebe uma cota de 1.000 moedas. Moedas não distribuídas acumulam-se no saldo corrente para o semestre seguinte. |
| **RN04** | **Envio de Moedas com Justificativa** | O professor só pode transferir moedas se possuir saldo suficiente. O envio exige obrigatoriamente a seleção do aluno, valor em moedas e um texto aberto de justificativa (reconhecimento por mérito, participação, bom comportamento, etc.). |
| **RN05** | **Notificação de Bonificação** | Sempre que uma transação de envio de moedas for efetivada, o aluno beneficiado deve receber automaticamente uma notificação por e-mail com remetente, valor e mensagem de justificativa. |
| **RN06** | **Cadastro de Vantagens** | As empresas parceiras realizam autocadastro e podem disponibilizar vantagens, informando obrigatoriamente: descrição detalhada, foto/imagem representativa e custo em moedas. |
| **RN07** | **Resgate de Vantagens e Cupons** | Ao solicitar o resgate de uma vantagem, o sistema valida se o aluno tem saldo suficiente e debita as moedas. Um e-mail com cupom e código identificador gerado pelo sistema é enviado ao aluno (para troca presencial) e um e-mail com o mesmo código é enviado à empresa parceira para conferência. |
| **RN08** | **Extrato e Rastreabilidade** | Tanto alunos quanto professores podem consultar o extrato de suas contas a qualquer momento, visualizando saldo atual e histórico cronológico detalhado de transações. |
| **RN09** | **Autenticação Obrigatória** | Alunos, professores e empresas parceiras necessitam de login e senha para acessar o sistema. Todas as operações protegidas exigem autenticação prévia. |

---

## 3. Requisitos do Sistema

### 3.1 Requisitos Funcionais (RF)

| ID | Requisito Funcional | Ator Principal | Prioridade |
| :--- | :--- | :--- | :---: |
| **RF01** | Permitir o cadastro de novos alunos no sistema vinculados a uma instituição existente. | Aluno | Essencial |
| **RF02** | Permitir a autenticação de usuários (Aluno, Professor, Empresa Parceira) via login e senha. | Todos | Essencial |
| **RF03** | Permitir o autocadastro de empresas parceiras no sistema. | Empresa Parceira | Essencial |
| **RF04** | Permitir ao professor transferir moedas para um aluno com justificativa obrigatória. | Professor | Essencial |
| **RF05** | Permitir a alunos e professores a visualização do extrato de transações e saldo corrente. | Aluno / Professor | Essencial |
| **RF06** | Permitir à empresa parceira cadastrar, listar, editar e remover vantagens (com foto, descrição e custo). | Empresa Parceira | Essencial |
| **RF07** | Permitir ao aluno visualizar o catálogo de vantagens ativas e efetuar o resgate. | Aluno | Essencial |
| **RF08** | Gerar código alfanumérico único para conferência de cupom de resgate. | Sistema | Essencial |
| **RF09** | Enviar e-mail de notificação para o aluno quando receber moedas de um professor. | Sistema | Importante |
| **RF10** | Enviar e-mails de confirmação com código de cupom para o aluno e para a empresa parceira no resgate. | Sistema | Importante |
| **RF11** | Adicionar semestralmente 1.000 moedas à conta de cada professor preservando saldo anterior acumulado. | Sistema | Importante |

### 3.2 Requisitos Não-Funcionais (RNF)

| ID | Requisito Não-Funcional | Categoria | Descrição |
| :--- | :--- | :--- | :--- |
| **RNF01** | **Padrão Arquitetural** | Arquitetura | O sistema deve ser integralmente construído segundo o padrão arquitetural **MVC (Model-View-Controller)**. |
| **RNF02** | **Segurança** | Segurança | As senhas dos usuários devem ser armazenadas com criptografia/hash seguro (ex.: bcrypt/Argon2). |
| **RNF03** | **Persistência Relacional** | Banco de Dados | Utilização de banco de dados relacional com integridade referencial e transações atômicas (ACID) para movimentações financeiras. |
| **RNF04** | **Comunicação por E-mail** | Integração | O sistema deve integrar-se com serviço de envio de e-mails (SMTP/API) para envio assíncrono de notificações e cupons. |
| **RNF05** | **Interface Responsiva** | Usabilidade | As interfaces (Views) devem ser responsivas, permitindo acesso via desktop e dispositivos móveis. |
| **RNF06** | **Rastreabilidade e Logs** | Auditoria | Todas as transações financeiras de moedas devem ser imutáveis e auditáveis, contendo timestamp, remetente, destinatário e valor. |

---

## 4. Histórias de Usuário (User Stories)

Abaixo estão detalhadas as 6 Histórias de Usuário fundamentais do sistema, acompanhadas dos critérios de aceitação no padrão **BDD (Behavior-Driven Development / Gherkin)**.

---

### 👤 HU01 - Registo de Aluno
> **Como** aluno,  
> **quero** realizar o meu registo indicando o meu nome, email, CPF, RG, morada, Instituição de Ensino e curso,  
> **para** poder ingressar no sistema de mérito estudantil e acumular moedas.

- **Prioridade**: Alta (Must Have)
- **Regras Relacionadas**: RN01, RN09

#### Critérios de Aceitação:
- **Cenário 1: Cadastro realizado com sucesso**
  - **Dado** que o aluno não possui cadastro no sistema e acessa a página de registro,
  - **Quando** preenche todos os campos obrigatórios (Nome, Email, CPF, RG, Endereço, Curso, Senha) e seleciona uma Instituição de Ensino válida pré-cadastrada,
  - **Então** o sistema cria o usuário Aluno com saldo inicial zero,
  - **E** redireciona o usuário para a tela de login exibindo mensagem de confirmação.

- **Cenário 2: Tentativa de cadastro com CPF ou Email duplicado**
  - **Dado** que já existe um usuário cadastrado com o mesmo CPF ou Email,
  - **Quando** o novo usuário submete o formulário,
  - **Então** o sistema rejeita o cadastro e exibe mensagem de alerta informando a duplicidade.

---

### 👨‍🏫 HU02 - Envio de Moedas
> **Como** professor,  
> **quero** enviar moedas aos meus alunos anexando uma mensagem obrigatória de justificação,  
> **para** os reconhecer por bom comportamento, desempenho ou participação em aula.

- **Prioridade**: Alta (Must Have)
- **Regras Relacionadas**: RN03, RN04, RN05, RN08

#### Critérios de Aceitação:
- **Cenário 1: Envio de moedas com saldo suficiente e justificativa preenchida**
  - **Dado** que o professor está autenticado e possui saldo de 500 moedas,
  - **Quando** seleciona um aluno cadastrado, define a quantia de 100 moedas, informa o motivo da bonificação e confirma o envio,
  - **Então** o sistema debita 100 moedas do saldo do professor,
  - **E** credita 100 moedas no saldo do aluno,
  - **E** registra a transação com data, remetente, destinatário, valor e motivo,
  - **E** dispara um e-mail de notificação para o aluno.

- **Cenário 2: Tentativa de envio com saldo insuficiente**
  - **Dado** que o professor possui saldo de 50 moedas,
  - **Quando** tenta transferir 100 moedas para um aluno,
  - **Então** o sistema bloqueia a transação e informa que o saldo é insuficiente.

- **Cenário 3: Tentativa de envio sem preenchimento da justificativa**
  - **Dado** que o professor preenche o valor das moedas mas deixa a justificativa em branco,
  - **Quando** clica em confirmar envio,
  - **Então** o sistema não permite a submissão e exige o preenchimento obrigatório da mensagem de reconhecimento.

---

### 📊 HU03 - Consulta de Extrato
> **Como** utilizador (aluno ou professor),  
> **quero** consultar o meu extrato de conta,  
> **para** visualizar o meu saldo atual e o histórico cronológico das transações que realizei.

- **Prioridade**: Alta (Must Have)
- **Regras Relacionadas**: RN08

#### Critérios de Aceitação:
- **Cenário 1: Visualização de extrato pelo Aluno**
  - **Dado** que o aluno está autenticado,
  - **Quando** acessa a seção de extrato,
  - **Então** o sistema apresenta o saldo atual de moedas,
  - **E** lista todas as transações de moedas recebidas (com nome do professor, valor, data e justificativa) e resgates de vantagens realizados (com nome da vantagem, parceiro, moedas debitadas e data).

- **Cenário 2: Visualização de extrato pelo Professor**
  - **Dado** que o professor está autenticado,
  - **Quando** acessa a seção de extrato,
  - **Então** o sistema apresenta o saldo disponível para o semestre,
  - **E** exibe a lista de todos os envios de moedas efetuados com aluno beneficiado, valor, data e justificativa enviada.

---

### 🏢 HU04 - Registo de Vantagens
> **Como** empresa parceira,  
> **quero** registar os meus produtos ou descontos com descrição, foto e custo em moedas,  
> **para** disponibilizá-los aos alunos no catálogo de benefícios.

- **Prioridade**: Alta (Must Have)
- **Regras Relacionadas**: RN06

#### Critérios de Aceitação:
- **Cenário 1: Cadastro de vantagem com sucesso**
  - **Dado** que a empresa parceira está devidamente autenticada,
  - **Quando** preenche a descrição da vantagem, faz o upload ou insere a URL da foto do produto/serviço, estipula o custo em moedas e clica em cadastrar,
  - **Então** o sistema registra a vantagem vinculada à respectiva empresa parceira,
  - **E** a vantagem passa a ser exibida publicamente no catálogo de troca para os alunos.

- **Cenário 2: Tentativa de cadastro sem foto ou custo inválido**
  - **Dado** que a empresa parceira omite a foto ou define custo menor ou igual a zero,
  - **Quando** tenta submeter o formulário,
  - **Então** o sistema acusa erro de validação e exige dados válidos para a publicação da vantagem.

---

### 🎁 HU05 - Resgate de Vantagem
> **Como** aluno,  
> **quero** resgatar uma vantagem utilizando o meu saldo de moedas,  
> **para** receber um email com um código de cupão e utilizá-lo na troca presencial junto à empresa parceira.

- **Prioridade**: Alta (Must Have)
- **Regras Relacionadas**: RN07, RN08

#### Critérios de Aceitação:
- **Cenário 1: Resgate efetuado com saldo suficiente**
  - **Dado** que o aluno possui 300 moedas e escolhe uma vantagem com custo de 200 moedas,
  - **Quando** clica em resgatar e confirma a operação,
  - **Então** o saldo do aluno é atualizado para 100 moedas,
  - **E** o sistema gera um código de cupom exclusivo e seguro,
  - **E** envia um e-mail ao aluno contendo o cupom com o código para troca presencial,
  - **E** envia um e-mail à empresa parceira notificando o resgate e informando o mesmo código para conferência.

- **Cenário 2: Tentativa de resgate com saldo insuficiente**
  - **Dado** que o aluno possui 150 moedas e deseja resgatar uma vantagem de 200 moedas,
  - **Quando** tenta efetuar o resgate,
  - **Então** o sistema impede a operação e emite aviso informando que o saldo de moedas é insuficiente.

---

### ✉️ HU06 - Notificações do Sistema
> **Como** utilizador (aluno ou empresa parceira),  
> **quero** ser notificado por email quando recebo moedas (aluno) ou quando um resgate é efetuado (aluno e empresa parceira),  
> **para** facilitar a conferência presencial, o acompanhamento e a segurança das transações.

- **Prioridade**: Alta (Must Have)
- **Regras Relacionadas**: RN05, RN07

#### Critérios de Aceitação:
- **Cenário 1: E-mail de notificação de recebimento de moedas**
  - **Dado** que um professor efetuou uma bonificação de moedas para um aluno,
  - **Quando** a transação é confirmada no banco de dados,
  - **Então** o serviço de e-mail envia uma mensagem para o endereço do aluno com o assunto "Você recebeu moedas de mérito!", contendo o valor recebido, o nome do professor e a justificativa.

- **Cenário 2: Disparo de cupons de conferência de resgate**
  - **Dado** que um aluno completou o resgate de uma vantagem de uma empresa parceira,
  - **Quando** o código de cupom é gerado pelo sistema,
  - **Então** o serviço de e-mail envia um e-mail ao aluno com o cupom e código,
  - **E** envia um e-mail à empresa parceira com a identificação do aluno, a vantagem resgatada e o mesmo código de conferência.
