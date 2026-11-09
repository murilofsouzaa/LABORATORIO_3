# 🎓 Sistema de Moeda Estudantil

> **Pontifícia Universidade Católica de Minas Gerais (PUC Minas)**  
> **Curso de Engenharia de Software**  
> **Disciplina**: Laboratório de Desenvolvimento de Software / Projeto de Software (Lab 3 - 2º Semestre/2026)  
> **Docente**: Profa. Milena Menezes Adão  
> **Autores / Integrantes**: **Murilo Freitas** e **Letícia Figueiredo**  

[![PUC Minas](https://img.shields.io/badge/PUC%20Minas-Engenharia%20de%20Software-blue)](https://www.pucminas.br)
[![Arquitetura](https://img.shields.io/badge/Arquitetura-MVC-brightgreen)](#-arquitetura-do-sistema)
[![Backend](https://img.shields.io/badge/Backend-Spring%20Boot%20%7C%20Java%2025-red)](docs/tecnologias.md)
[![Frontend](https://img.shields.io/badge/Frontend-React%20%7C%20TypeScript%20%7C%20Vite-blue)](docs/tecnologias.md)
[![Sprint](https://img.shields.io/badge/Sprints-01%2C%2002%20e%2003%20Conclu%C3%ADdas-success)](docs/sprints.md)
[![Modelagem](https://img.shields.io/badge/UML-PlantUML%20%7C%20DER-orange)](docs/modelagem.md)
[![Documentação](https://img.shields.io/badge/Docs-Central%20de%20Documenta%C3%A7%C3%A3o-blueviolet)](docs/README.md)

---

## 📖 Visão Geral do Projeto

O **Sistema de Moeda Estudantil** é uma plataforma desenvolvida para incentivar e reconhecer o mérito acadêmico dos estudantes universitários por meio de uma moeda virtual. 

A moeda virtual é distribuída semestralmente pelos professores aos alunos como forma de reconhecimento pelo bom desempenho, participação e engajamento acadêmico. Com as moedas acumuladas, os alunos podem resgatar benefícios e vantagens (como descontos em mensalidades, restaurantes universitários e aquisição de materiais didáticos) oferecidos por empresas parceiras cadastradas.

---

## 👥 Integrantes e Autores do Projeto

* **Murilo Freitas** — Engenharia de Software (PUC Minas)
* **Letícia Figueiredo** — Engenharia de Software (PUC Minas)

---

## 👥 Atores do Sistema

| Ator | Descrição e Responsabilidades |
| :--- | :--- |
| **Aluno** | Realiza o cadastro informando dados pessoais, curso e selecionando sua instituição. Autentica-se, consulta o saldo e extrato, e efetua o resgate de vantagens gerando um cupom com código para troca presencial. Recebe e-mail de notificação a cada moeda recebida. |
| **Professor** | Pré-cadastrado no sistema pela Instituição de Ensino. Recebe semestralmente 1.000 moedas (saldo cumulativo entre semestres). Distribui moedas para alunos com justificativa formal obrigatória e consulta seu extrato de envios. |
| **Empresa Parceira** | Cadastra-se no sistema, autentica-se e registra vantagens (produtos/descontos com descrição, foto e custo em moedas). Recebe e-mail com código para validação presencial das vantagens resgatadas pelos alunos. |
| **Instituição de Ensino** | Pré-cadastrada no sistema; fornece a relação do corpo docente para pré-registro e vincula cursos e departamentos. |

---

## 💻 Stack Tecnológica

| Camada | Tecnologias Principais | Descrição e Papel |
| :--- | :--- | :--- |
| **Backend** | **Java 25**, **Spring Boot**, **Spring MVC**, **Spring Data JPA / Hibernate** | Framework corporativo robusto implementando a arquitetura MVC, serviços de negócio e persistência relacional. |
| **Banco de Dados** | **H2 Database** (Memória/Dev) e **PostgreSQL** (Prod) | Persistência com integridade relacional, suporte transacional ACID e console web interativo (`/h2-console`). |
| **Serviços & E-mail**| **JavaMailSender** (SMTP) | Disparo assíncrono de notificações de bonificação e envio de cupons de resgate. |
| **Frontend** | **React**, **TypeScript**, **Vite**, **PostCSS** | Interface reativa, modular e tipada com inicialização instantânea e HMR ultrarrápido. |
| **Qualidade & Testes**| **JUnit 5**, **Spring Boot Test**, **ESLint** | 11 testes de integração automatizados cobrindo todas as regras de negócio e integridade de saldo. |
| **Modelagem** | **PlantUML**, **Mermaid.js**, **SVG** | Modelagem UML de Casos de Uso, Classes e Componentes com gráficos vetoriais. |

> Consulte o documento completo com as justificativas e o roteiro do Salão de Tecnologias em: [docs/tecnologias.md](docs/tecnologias.md).

---

## 📐 Artefatos de Modelagem (Sprint 1 - Lab03S01)

Em conformidade com a **Seção 4.1** do regulamento do projeto, foram elaborados quatro artefatos de modelagem de software:

### 1. Diagrama de Casos de Uso
Mapeia as fronteiras do sistema e as interações dos três atores com as funcionalidades de registro, autenticação, transações e resgates.

<p align="center">
  <img src="docs/diagramas/casos_de_uso.svg" alt="Diagrama de Casos de Uso" width="600"/>
</p>

*Código-fonte PlantUML*: [`docs/diagramas/casos_de_uso.puml`](docs/diagramas/casos_de_uso.puml)  
*Especificação detalhada*: [Ver Documento de Modelagem](docs/modelagem.md#1-diagrama-de-casos-de-uso)

---

### 2. Histórias do Utilizador (User Stories)
Representação dos requisitos sob a perspectiva dos atores, acompanhadas de critérios de aceitação no padrão BDD (*Given-When-Then*):

* **HU01 - Registo de Aluno**: Como aluno, quero realizar o meu registo indicando o meu nome, email, CPF, RG, morada, Instituição de Ensino e curso, para poder ingressar no sistema de mérito.
* **HU02 - Envio de Moedas**: Como professor, quero enviar moedas aos meus alunos anexando uma mensagem obrigatória de justificação, para os reconhecer por bom comportamento ou participação.
* **HU03 - Consulta de Extrato**: Como utilizador (aluno ou professor), quero consultar o meu extrato, para visualizar o meu saldo atual e as transações que realizei.
* **HU04 - Registo de Vantagens**: Como empresa parceira, quero registar os meus produtos ou descontos com descrição, foto e custo em moedas, para os disponibilizar aos alunos.
* **HU05 - Resgate de Vantagem**: Como aluno, quero resgatar uma vantagem utilizando o meu saldo de moedas, para receber um email com um código de cupão para troca presencial.
* **HU06 - Notificações do Sistema**: Como utilizador, quero ser notificado por email quando recebo moedas (aluno) ou quando um resgate é efetuado (empresa parceira), para facilitar a conferência e o acompanhamento.

*Critérios de aceitação e regras completas*: [Ver Documento de Requisitos](docs/requisitos.md#4-histórias-de-usuário-user-stories)

---

### 3. Diagrama de Classes
Modela a estrutura estática do domínio, incluindo a hierarquia de herança a partir da classe abstrata `Utilizador`, métodos de negócio, atributos privados e multiplicidades.

<p align="center">
  <img src="docs/diagramas/classes.svg" alt="Diagrama de Classes" width="700"/>
</p>

*Código-fonte PlantUML*: [`docs/diagramas/classes.puml`](docs/diagramas/classes.puml)  
*Dicionário de Classes*: [Ver Documento de Modelagem](docs/modelagem.md#2-diagrama-de-classes)

---

### 4. Diagrama de Componentes
Modela a arquitetura em camadas **MVC (Model-View-Controller)** e as conexões com a **Base de Dados** (persistência relacional) e com o **Serviço de Email** (notificações e envio de cupons).

<p align="center">
  <img src="docs/diagramas/componentes.svg" alt="Diagrama de Componentes" width="600"/>
</p>

*Código-fonte PlantUML*: [`docs/diagramas/componentes.puml`](docs/diagramas/componentes.puml)  
*Detalhamento arquitetural*: [Ver Documento de Arquitetura](docs/arquitetura.md)

---

## 🏛️ Justificativas das Escolhas Arquiteturais (Macro e Micro)

Para atender tanto aos requisitos acadêmicos quanto às exigências de robustez, escalabilidade e manutenibilidade, a arquitetura foi fundamentada em decisões técnicas bem delimitadas:

### 🌐 Decisões Macro-Arquiteturais (Nível de Sistema)
1. **Padrão Arquitetural MVC**: Separação rigorosa de responsabilidades entre Apresentação (`Views`), Controle (`Controllers`) e Domínio (`Models`), facilitando manutenção, testes isolados e desenvolvimento em paralelo pelos membros da equipe.
2. **Banco de Dados Relacional com Transações ACID**: A movimentação de moedas virtuais possui natureza financeira. O uso de transações ACID impede o problema de gasto duplo (*double-spending*), garante atomicidade entre débito e crédito, e assegura integridade referencial estrita.
3. **Serviço de Notificação Desacoplado (E-mail Assíncrono)**: O disparo de e-mails possui latência imprevisível. O desacoplamento da thread HTTP garante respostas rápidas ao usuário e permite políticas de reprocessamento (*retry*) sem comprometer a transação financeira no banco.
4. **Camada de Acesso a Dados Isolada (DAO/ORM)**: Isola o motor SQL da lógica de negócio, assegurando portabilidade entre ambientes e facilidade para mockar dados em testes automatizados.

### 🔬 Decisões Micro-Arquiteturais (Nível de Classes e Código)
1. **Herança a partir de `Utilizador` (Classe Abstrata)**: Evita redundância de código em credenciais (`login`, `senha`, `autenticar()`), possibilita autenticação polimórfica e simplifica o controle de acesso por perfis (RBAC).
2. **Separação em Entidades Especializadas (`Aluno`, `Professor`, `EmpresaParceira`)**: Atende ao Princípio de Responsabilidade Única (SRP) e alta coesão, eliminando colunas nulas no banco e condicionais excessivas no código.
3. **Entidade Imutável `Transacao`**: Cada movimentação financeira (bonificação ou resgate) é registrada como uma entidade imutável de log, contendo data, valor, partes envolvidas e justificativa obrigatória, viabilizando o extrato e a rastreabilidade total.
4. **Geração Bilateral de Código Único de Cupom**: Mecanismo criptográfico que gera um código de cupom compartilhado entre aluno e empresa parceira por e-mail, garantindo validação presencial antifraude e preservando a privacidade dos dados do estudante.
5. **Encapsulamento Estrito e Modelo Rico (*Tell, Don't Ask*)**: Proteção dos atributos privados com métodos de negócio nas próprias entidades (`enviarMoedas()`, `resgatarVantagem()`), impedindo manipulação direta e estados inconsistentes de saldo.

> Para a análise aprofundada de prós, contras e alternativas descartadas, acesse o documento completo: [docs/arquitetura.md](docs/arquitetura.md#2-justificativas-das-escolhas-arquiteturais).

---

## 🗂️ Estrutura do Repositório

```text
LABORATORIO_3/
├── README.md                          # Visão geral do projeto e atalhos rápidos
├── backend/                           # Aplicação Backend Spring Boot (Java 25)
│   ├── src/main/java/com/lab03/demo/  # Modelos JPA, Repositories, Services e Controllers REST
│   └── src/test/java/com/lab03/demo/  # Testes de integração automatizados
├── frontend/                          # Aplicação Frontend React (TypeScript + Vite)
└── docs/                              # Central de documentação do sistema
    ├── README.md                      # Índice geral da documentação
    ├── requisitos.md                  # Regras de Negócio (RN01-RN09), RFs, RNFs e Histórias de Usuário (HU01-HU06)
    ├── modelagem.md                   # Modelagem detalhada: Casos de Uso, Classes e Componentes (UML e Mermaid)
    ├── arquitetura.md                 # Decisões arquiteturais Macro e Micro, e diagramas de sequência dos fluxos
    ├── tecnologias.md                 # Detalhamento de tecnologias, justificativas e tutorial para a Sprint 3
    ├── apresentacao.md                # Roteiro de Apresentação (Slides de Arquitetura & Salão de Tecnologias)
    ├── sprints.md                     # Cronograma das Sprints (Lab03S01, Lab03S02, Lab03S03) e entregáveis
    └── diagramas/                     # Códigos-fonte e imagens renderizadas
        ├── casos_de_uso.puml          # Código PlantUML do Diagrama de Casos de Uso
        ├── casos_de_uso.svg           # Renderização vetorial dos Casos de Uso
        ├── classes.puml               # Código PlantUML do Diagrama de Classes
        ├── classes.svg                # Renderização vetorial das Classes
        ├── componentes.puml           # Código PlantUML do Diagrama de Componentes
        ├── componentes.svg            # Renderização vetorial dos Componentes
        └── modelo_er.puml             # Código PlantUML do Modelo Entidade-Relacionamento (DER)
```

---

## 🚀 Planejamento das Sprints

- **Sprint 1 (Lab03S01) - [Concluída]**: Modelagem do sistema (Diagrama de Casos de Uso, Histórias de Usuário BDD, Diagrama de Classes e Diagrama de Componentes).
- **Sprint 2 (Lab03S02) - [Concluída]**: Modelo ER (DER), persistência relacional (Spring Data JPA / Hibernate) e CRUDs funcionais de aluno e empresa parceira (front-end e back-end integrados).
- **Sprint 3 (Lab03S03) - [Concluída]**: CRUDs finais integrados, mecanismo de transações e notificações, roteiro de apresentação da arquitetura/persistência e tutorial de 20 minutos para o Salão de Tecnologias ([docs/apresentacao.md](docs/apresentacao.md)).

Consulte o documento [docs/sprints.md](docs/sprints.md) para detalhes completos de cronograma e entregáveis.

---

## 🛠️ Como Executar o Projeto Localmente

1. **Backend**:
   ```bash
   cd backend
   ./mvnw test               # Executa a suíte de 11 testes automatizados
   ./mvnw spring-boot:run    # Inicia a API REST na porta 8080 (http://localhost:8080)
   ```
   *Console H2*: Acesse `http://localhost:8080/h2-console` (JDBC URL: `jdbc:h2:mem:moeda_estudantil_db`, User: `sa`, Senha em branco).

2. **Frontend**:
   ```bash
   cd frontend
   npm install               # Instala as dependências React/TypeScript
   npm run dev               # Inicia o servidor Vite em http://localhost:5173
   ```

---

## 👨‍💻 Autores e Contribuições

Projeto desenvolvido por **Murilo Freitas** e **Letícia Figueiredo** no âmbito da disciplina **Laboratório de Desenvolvimento de Software / Projeto de Software** da **Pontifícia Universidade Católica de Minas Gerais (PUC Minas)**.
