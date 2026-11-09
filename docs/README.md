# 📚 Central de Documentação - Sistema de Moeda Estudantil

Bem-vindo à documentação oficial do projeto **Sistema de Moeda Estudantil**, desenvolvido para a disciplina de **Laboratório de Desenvolvimento de Software / Projeto de Software (Lab 3)** da **Pontifícia Universidade Católica de Minas Gerais (PUC Minas)**.

---

## 📌 Sumário da Documentação

1. [Especificação de Requisitos e Histórias de Usuário](requisitos.md)
   - Visão Geral do Escopo e Ecossistema
   - Regras de Negócio (RN01 a RN09)
   - Requisitos Funcionais (RF01 a RF11) e Não-Funcionais (RNF01 a RNF06)
   - Histórias de Usuário (HU01 a HU06) com Critérios de Aceitação em BDD / Gherkin

2. [Modelagem do Sistema (Sprint 1 - Lab03S01)](modelagem.md)
   - **Diagrama de Casos de Uso**: PlantUML, visualização gráfica em SVG, diagrama Mermaid e tabela detalhada (UC1 a UC6)
   - **Diagrama de Classes**: PlantUML, SVG, diagrama Mermaid, dicionário de classes, atributos, métodos e multiplicidades
   - **Diagrama de Componentes**: PlantUML, SVG, diagrama Mermaid e detalhamento da arquitetura MVC

3. [Arquitetura do Sistema e Decisões de Design](arquitetura.md)
   - Padrão Arquitetural MVC (Model-View-Controller)
   - Responsabilidades por Camada (Views, Controllers, Models)
   - Diagrama de Sequência: Envio de Moedas (Professor -> Aluno)
   - Diagrama de Sequência: Resgate de Vantagens (Aluno -> Empresa Parceira)
   - Integração com Serviços Externos (Banco de Dados e E-mail)

4. [Planejamento e Acompanhamento de Sprints](sprints.md)
   - Sprint 1 (Lab03S01): Modelagem UML e Histórias de Usuário
   - Sprint 2 (Lab03S02): Modelo ER, Persistência (ORM/DAO) e CRUDs Iniciais
   - Sprint 3 (Lab03S03): CRUDs Finais, Apresentação e Salão de Tecnologias
   - Critérios de Avaliação da Disciplina

---

## 📂 Diretório de Diagramas

Todos os diagramas gerados estão disponíveis na pasta [`diagramas/`](diagramas/):

| Diagrama | Código-Fonte PlantUML | Visualização Vetorial SVG |
| :--- | :---: | :---: |
| **Casos de Uso** | [`casos_de_uso.puml`](diagramas/casos_de_uso.puml) | [SVG](diagramas/casos_de_uso.svg) |
| **Diagrama de Classes** | [`classes.puml`](diagramas/classes.puml) | [SVG](diagramas/classes.svg) |
| **Diagrama de Componentes** | [`componentes.puml`](diagramas/componentes.puml) | [SVG](diagramas/componentes.svg) |

---

## 🛠️ Tecnologias e Padrões Adotados na Documentação

- **PlantUML**: Modelagem UML padronizada conforme especificação da disciplina.
- **SVG Vector Graphics**: Renderização em alta definição para visualização direta em qualquer visualizador Markdown ou navegador.
- **Mermaid.js**: Diagramas interativos renderizáveis nativamente no GitHub e em editores compatíveis.
- **BDD (Behavior-Driven Development)**: Critérios de aceitação estruturados na sintaxe *Dado / Quando / Então* para as Histórias de Usuário.
