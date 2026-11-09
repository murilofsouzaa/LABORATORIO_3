# 💻 Tecnologias Adotadas e Guia da Stack

> **Pontifícia Universidade Católica de Minas Gerais (PUC Minas)**  
> **Curso de Engenharia de Software**  
> **Disciplina**: Laboratório de Desenvolvimento de Software / Projeto de Software (Lab 3 - 2º Semestre/2026)  
> **Docente**: Profa. Milena Menezes Adão  
> **Autores / Integrantes**: **Murilo Freitas** e **Letícia Figueiredo**  

Este documento apresenta o detalhamento de todas as tecnologias escolhidas para a construção do **Sistema de Moeda Estudantil**, fundamentando as razões de cada escolha, comparativos com alternativas descartadas e um tutorial preparatório para o **Salão de Tecnologias (Sprint 03)**.

---

## 📑 Sumário

1. [Visão Geral da Stack Tecnológica](#1-visão-geral-da-stack-tecnológica)
2. [Tecnologias do Backend](#2-tecnologias-do-backend)
   - [Java 25](#21-java-25)
   - [Spring Boot & Spring MVC](#22-spring-boot--spring-mvc)
   - [Spring Data JPA & Hibernate](#23-spring-data-jpa--hibernate)
   - [Banco de Dados (H2 Database & PostgreSQL)](#24-banco-de-dados-h2--postgresql)
   - [Jakarta Bean Validation](#25-jakarta-bean-validation)
   - [JavaMailSender (Serviço de E-mail)](#26-javamailsender-serviço-de-e-mail)
   - [JUnit 5 & Mockito (Testes Automatizados)](#27-junit-5--spring-boot-test)
3. [Tecnologias do Frontend](#3-tecnologias-do-frontend)
   - [React](#31-react)
   - [TypeScript](#32-typescript)
   - [Vite](#33-vite)
4. [Ferramentas de Modelagem e Build](#4-ferramentas-de-modelagem-e-build)
   - [PlantUML & Mermaid](#41-plantuml--mermaid)
   - [Apache Maven (Wrapper)](#42-apache-maven-wrapper)
5. [Tutorial de Configuração e Execução (Salão de Tecnologias)](#5-tutorial-de-configuração-e-execução-salão-de-tecnologias)
   - [Pré-requisitos](#51-pré-requisitos)
   - [Executando o Backend (Spring Boot)](#52-executando-o-backend-spring-boot)
   - [Executando o Frontend (React + Vite)](#53-executando-o-frontend-react--vite)
   - [Acessando o Console H2](#54-acessando-o-console-h2)

---

## 1. Visão Geral da Stack Tecnológica

O sistema foi estruturado seguindo o padrão arquitetural **MVC**, com uma separação clara entre a camada de apresentação reativa e a camada de serviços e persistência:

```mermaid
flowchart LR
    subgraph Frontend["Frontend (Cliente)"]
        React["React"]
        TS["TypeScript"]
        Vite["Vite"]
    end

    subgraph Backend["Backend (Servidor)"]
        Java["Java 25"]
        SpringBoot["Spring Boot / MVC"]
        JPA["Spring Data JPA / Hibernate"]
    end

    subgraph Persistencia["Persistência & Serviços"]
        H2[("H2 Database (Dev/Test)")]
        PG[("PostgreSQL (Prod)")]
        Mail["Serviço SMTP (E-mail)"]
    end

    Frontend -->|HTTP / JSON (REST)| Backend
    Backend --> JPA
    JPA --> H2
    JPA -.-> PG
    Backend --> Mail
```

---

## 2. Tecnologias do Backend

### 2.1 Java 25
* **Papel**: Linguagem de programação principal do ecossistema de backend.
* **Justificativa da Escolha**:
  * **Tipagem Estática e Segurança**: O sistema opera uma economia virtual de moedas, na qual erros de tipo em tempo de execução poderiam acarretar inconsistências financeiras graves.
  * **Recursos Modernos da Linguagem**: Suporte a *Pattern Matching*, *Records*, *Sealed Classes* e *Virtual Threads*, permitindo código limpo, expressivo e de alta escalabilidade.
  * **Maturidade e Ecossistema Corporativo**: O Java possui o ecossistema mais testado e seguro para operações transacionais bancárias e empresariais no mercado.

### 2.2 Spring Boot & Spring MVC
* **Papel**: Framework principal para orquestração da aplicação, injeção de dependências e controladores REST/MVC.
* **Justificativa da Escolha**:
  * **Exigência da Disciplina**: Atendimento pleno à arquitetura MVC requerida no regulamento do Laboratório 3.
  * **Convenção sobre Configuração (*Convention over Configuration*)**: O Spring Boot reduz drasticamente o código boilerplate de configuração XML ou Java Config manual, fornecendo *starters* prontos para uso.
  * **Inversão de Controle (IoC) e Injeção de Dependências (DI)**: Facilita o desacoplamento entre camadas (`Controller` -> `Service` -> `Repository`), viabilizando a substituição de dependências por mocks durante testes unitários.
  * **Tratamento Centralizado de Exceções**: Através de anotações como `@RestControllerAdvice` e `@ExceptionHandler`, é possível capturar qualquer erro de regra de negócio (`SaldoInsuficienteException`, `RegraNegocioException`) e convertê-lo uniformemente em status HTTP legíveis.

### 2.3 Spring Data JPA & Hibernate
* **Papel**: Camada de Mapeamento Objeto-Relacional (ORM) e abstração de acesso a dados.
* **Justificativa da Escolha**:
  * **Mapeamento de Herança Robusto**: Permite implementar a hierarquia da classe abstrata `Utilizador` e suas especializações (`Aluno`, `Professor`, `EmpresaParceira`) usando a estratégia `InheritanceType.JOINED`, normalizando o banco de dados sem colunas nulas.
  * **Controle Transacional Declarativo (`@Transactional`)**: Garante que operações críticas como a transferência de moedas (débito no saldo do professor, crédito no saldo do aluno e gravação do log de transação) ocorram de maneira atômica, consistente, isolada e durável (propriedades ACID). Em caso de qualquer falha no processo, é efetuado *rollback* automático.
  * **Eliminação de SQL Boilerplate**: Métodos como `findByLogin()`, `existsByCpf()` e `findByAlunoIdOrderByDataDesc()` são derivados automaticamente pela assinatura dos repositórios.

### 2.4 Banco de Dados (H2 & PostgreSQL)
* **Papel**: Persistência de dados relacional.
* **Justificativa da Escolha**:
  * **H2 Database (Desenvolvimento e Testes)**: Banco de dados relacional em memória com suporte a SQL padrão, console web gráfico integrado (`/h2-console`) e inicialização imediata com zero configuração prévia ou dependência de instalação de serviços externos.
  * **PostgreSQL (Ambiente de Produção / Homologação)**: SGBD relacional open-source de padrão industrial, compatível nativamente via driver JDBC já configurado no `pom.xml`.

### 2.5 Jakarta Bean Validation
* **Papel**: Validação declarativa de entrada de dados nos DTOs.
* **Justificativa da Escolha**:
  * Anotações como `@NotBlank`, `@NotNull`, `@Min` e `@Email` protegem a aplicação contra payloads inválidos antes mesmo da execução atingir a camada de serviço, centralizando as mensagens de erro em português.

### 2.6 JavaMailSender (Serviço de E-mail)
* **Papel**: Notificação imediata de transações e envio de cupons de resgate.
* **Justificativa da Escolha**:
  * Abstração nativa do Spring para o protocolo SMTP, suportando qualquer provedor (SendGrid, Mailtrap, servidores institucionais).
  * Implementação projetada com fallback gracioso: em ambiente sem SMTP ativo, as notificações são formatadas e registradas no log do console, permitindo validação visual completa.

### 2.7 JUnit 5 & Spring Boot Test
* **Papel**: Suíte de testes automatizados unitários e de integração.
* **Justificativa da Escolha**:
  * Permite testar o fluxo completo de ponta a ponta (carga de dados, injeção de dependências, transações com rollback automático `@Transactional` e regras de negócio) em poucos segundos.

---

## 3. Tecnologias do Frontend

### 3.1 React
* **Papel**: Biblioteca para construção da interface de usuário reativa.
* **Justificativa da Escolha**:
  * **Componentização Reutilizável**: Facilita a criação de painéis específicos para cada ator (Dashboard do Aluno, Painel do Professor, Catálogo de Vantagens da Empresa) reutilizando componentes comuns (cards, tabelas de extrato, modais de confirmação, inputs de formulário).
  * **Virtual DOM**: Renderização eficiente de telas dinâmicas com atualização instantânea de saldo e histórico de moedas sem recarregamento completo da página.
  * **Ecossistema Vibrante**: Grande disponibilidade de bibliotecas de componentes, hooks e integrações.

### 3.2 TypeScript
* **Papel**: Superset tipado da linguagem JavaScript.
* **Justificativa da Escolha**:
  * **Sincronia com o Backend**: Os DTOs do Spring Boot (ex.: `AlunoResponseDTO`, `TransacaoResponseDTO`, `VantagemResponseDTO`) são espelhados em interfaces TypeScript com garantia estrita de tipos.
  * **Detecção Precoce de Bugs**: Elimina em tempo de compilação erros comuns de propriedades nulas, acessos a campos inexistentes ou incompatibilidade de formatos numéricos e datas.

### 3.3 Vite
* **Papel**: Ferramenta de build, empacotamento e servidor de desenvolvimento para o frontend.
* **Justificativa da Escolha**:
  * **Velocidade Extrema**: Utiliza ES Modules (ESM) nativos do navegador, proporcionando inicialização do servidor de desenvolvimento em milissegundos e *Hot Module Replacement (HMR)* instantâneo ao salvar qualquer componente.
  * **Substituição Superior ao Webpack / CRA**: Evita a lentidão histórica e problemas de dependências legadas do antigo *Create React App*.

---

## 4. Ferramentas de Modelagem e Build

### 4.1 PlantUML & Mermaid
* **PlantUML**: Escolhido para a modelagem estrita solicitada na especificação do Laboratório 3, permitindo geração automatizada de vetores SVG em alta definição.
* **Mermaid**: Integrado diretamente aos arquivos Markdown para permitir visualização e inspeção interativa de diagramas nativamente dentro do GitHub sem dependência de plugins externos.

### 4.2 Apache Maven (Wrapper - `mvnw`)
* **Papel**: Gerenciador de ciclo de vida de build e dependências Java.
* **Justificativa da Escolha**:
  * O uso do wrapper (`./mvnw`) garante que qualquer membro da equipe ou avaliador execute o projeto na versão exata do Maven sem necessidade de instalação global no sistema operacional.

---

## 5. Tutorial de Configuração e Execução (Salão de Tecnologias)

Este passo a passo serve como guia de execução rápida e roteiro de demonstração para a apresentação técnica de 20 minutos prevista na **Sprint 03**.

### 5.1 Pré-requisitos
* **Java 21 ou 25** instalado no sistema.
* **Node.js (v18 ou superior)** e **npm** instalados.
* Git instalado e clonado.

### 5.2 Executando o Backend (Spring Boot)

1. Navegue até a pasta do backend:
   ```bash
   cd backend
   ```

2. Compile e execute os testes de integração para verificar a integridade da aplicação:
   ```bash
   ./mvnw test
   ```
   *(A suíte executará 11 testes cobrindo todas as regras de negócio e transações financeiras).*

3. Inicie o servidor da aplicação:
   ```bash
   ./mvnw spring-boot:run
   ```
   O backend estará disponível e escutando na porta **8080** (`http://localhost:8080`).

> **Nota**: Ao iniciar, o `DataInitializerService` popula automaticamente o banco de dados em memória com instituições ("PUC Minas"), professores com 1.000 moedas, empresas parceiras com vantagens cadastradas e alunos de teste com senhas padrão `123`.

---

### 5.3 Executando o Frontend (React + Vite)

1. Em um novo terminal, navegue até a pasta do frontend:
   ```bash
   cd frontend
   ```

2. Instale as dependências (caso ainda não estejam instaladas):
   ```bash
   npm install
   ```

3. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
   O Vite disponibilizará a interface web em **`http://localhost:5173`**.

---

### 5.4 Acessando o Console H2

Para inspecionar diretamente as tabelas do banco de dados relacional e as transações de moedas em tempo real:
1. Abra o navegador em: **`http://localhost:8080/h2-console`**
2. Preencha os campos de conexão:
   * **JDBC URL**: `jdbc:h2:mem:moeda_estudantil_db`
   * **User Name**: `sa`
   * **Password**: *(deixar em branco)*
3. Clique em **Connect** para visualizar as tabelas: `UTILIZADORES`, `ALUNOS`, `PROFESSORES`, `EMPRESAS_PARCEIRAS`, `INSTITUICOES`, `VANTAGENS` e `TRANSACOES`.
