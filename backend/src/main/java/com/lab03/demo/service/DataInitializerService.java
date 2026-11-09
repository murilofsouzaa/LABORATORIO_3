package com.lab03.demo.service;

import com.lab03.demo.model.Aluno;
import com.lab03.demo.model.EmpresaParceira;
import com.lab03.demo.model.Instituicao;
import com.lab03.demo.model.Professor;
import com.lab03.demo.model.Vantagem;
import com.lab03.demo.repository.AlunoRepository;
import com.lab03.demo.repository.EmpresaParceiraRepository;
import com.lab03.demo.repository.InstituicaoRepository;
import com.lab03.demo.repository.ProfessorRepository;
import com.lab03.demo.repository.VantagemRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializerService implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializerService.class);

    @Autowired
    private InstituicaoRepository instituicaoRepository;

    @Autowired
    private ProfessorRepository professorRepository;

    @Autowired
    private EmpresaParceiraRepository empresaRepository;

    @Autowired
    private AlunoRepository alunoRepository;

    @Autowired
    private VantagemRepository vantagemRepository;

    @Override
    public void run(String... args) {
        logger.info("Iniciando carga de dados de exemplo do Sistema de Moeda Estudantil...");

        // 1. Instituições pré-cadastradas
        Instituicao pucMinas = instituicaoRepository.save(new Instituicao("PUC Minas - Pontifícia Universidade Católica"));
        Instituicao ufmg = instituicaoRepository.save(new Instituicao("UFMG - Universidade Federal de Minas Gerais"));

        // 2. Professores pré-cadastrados pela Instituição com 1.000 moedas semestrais
        Professor profCarlos = new Professor(
            "prof.carlos",
            "123",
            "Prof. Carlos Drummond de Andrade",
            "111.222.333-44",
            "Engenharia de Software",
            pucMinas
        );
        professorRepository.save(profCarlos);

        Professor profaMilena = new Professor(
            "profa.milena",
            "123",
            "Profa. Milena Menezes Adão",
            "555.666.777-88",
            "Projeto e Laboratório de Software",
            pucMinas
        );
        professorRepository.save(profaMilena);

        // 3. Empresas Parceiras
        EmpresaParceira livraria = new EmpresaParceira(
            "livraria",
            "123",
            "Livraria Universitária Saber",
            "contato@livrariasaber.com"
        );
        empresaRepository.save(livraria);

        EmpresaParceira restaurante = new EmpresaParceira(
            "restaurante",
            "123",
            "Restaurante Sabor no Campus",
            "contato@sabornocampus.com"
        );
        empresaRepository.save(restaurante);

        // 4. Vantagens das empresas parceiras
        vantagemRepository.save(new Vantagem(
            "Desconto de 20% em livros técnicos e materiais didáticos",
            "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600",
            100,
            livraria
        ));

        vantagemRepository.save(new Vantagem(
            "Almoço Executivo Completo no Restaurante do Campus",
            "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600",
            150,
            restaurante
        ));

        vantagemRepository.save(new Vantagem(
            "Desconto de 15% na taxa de matrícula ou mensalidade do semestre",
            "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600",
            500,
            livraria
        ));

        // 5. Alunos de exemplo
        Aluno murilo = new Aluno(
            "aluno.murilo",
            "123",
            "Murilo Freitas",
            "murilo.freitas@sga.pucminas.br",
            "123.456.789-01",
            "MG-12.345.678",
            "Av. Dom José Gaspar, 500 - Coração Eucarístico, BH",
            "Engenharia de Software",
            pucMinas
        );
        murilo.setSaldo(250); // Saldo demonstrativo inicial
        alunoRepository.save(murilo);

        Aluno leticia = new Aluno(
            "aluna.leticia",
            "123",
            "Letícia Figueiredo",
            "leticia.figueiredo@sga.pucminas.br",
            "987.654.321-09",
            "MG-87.654.321",
            "Rua Walter Ianni, 255 - São Gabriel, BH",
            "Engenharia de Software",
            pucMinas
        );
        leticia.setSaldo(300); // Saldo demonstrativo inicial
        alunoRepository.save(leticia);

        logger.info("Carga inicial concluída com sucesso! Usuários de teste configurados com senha '123'.");
    }
}
