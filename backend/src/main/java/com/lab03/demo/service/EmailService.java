package com.lab03.demo.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    @Autowired(required = false)
    private JavaMailSender mailSender;

    public void enviarNotificacaoMoedasRecebidas(String emailAluno, String nomeAluno, String nomeProfessor, int valor, String motivo) {
        String assunto = "Moeda Estudantil - Você recebeu " + valor + " moedas!";
        String corpo = String.format(
            "Olá, %s!\n\nVocê acabou de receber %d moedas de mérito do Professor %s.\n" +
            "Motivo do reconhecimento:\n\"%s\"\n\n" +
            "Acesse o sistema para consultar o seu saldo atual e resgatar vantagens exclusivas!\n\n" +
            "Equipe Sistema de Moeda Estudantil - PUC Minas",
            nomeAluno, valor, nomeProfessor, motivo
        );

        enviarEmailOuLogar(emailAluno, assunto, corpo);
    }

    public void enviarCupomResgate(String emailAluno, String nomeAluno, String emailEmpresa, String nomeEmpresa, String vantagemDescricao, String codigoCupom, int valor) {
        // 1. Email para o Aluno com o Cupom
        String assuntoAluno = "Moeda Estudantil - Cupom de Resgate de Vantagem: " + codigoCupom;
        String corpoAluno = String.format(
            "Parabéns, %s!\n\nVocê resgatou com sucesso a seguinte vantagem:\n" +
            "\"%s\" da empresa parceira %s.\n" +
            "Custo: %d moedas.\n\n" +
            "Seu código de cupom para troca presencial é: %s\n\n" +
            "Apresente este código presencialmente no estabelecimento parceiro para usufruir do seu benefício!\n\n" +
            "Equipe Sistema de Moeda Estudantil - PUC Minas",
            nomeAluno, vantagemDescricao, nomeEmpresa, valor, codigoCupom
        );
        enviarEmailOuLogar(emailAluno, assuntoAluno, corpoAluno);

        // 2. Email para a Empresa Parceira para validação
        String assuntoEmpresa = "Moeda Estudantil - Novo Resgate Confirmado: Cupom " + codigoCupom;
        String corpoEmpresa = String.format(
            "Prezada equipe %s,\n\nO aluno %s resgatou a vantagem:\n" +
            "\"%s\".\n\n" +
            "Código de Cupom gerado para conferência: %s\n\n" +
            "Ao atender o discente presencialmente, confirme este código em seu painel antes de efetivar a entrega do produto ou desconto.\n\n" +
            "Equipe Sistema de Moeda Estudantil - PUC Minas",
            nomeEmpresa, nomeAluno, vantagemDescricao, codigoCupom
        );
        enviarEmailOuLogar(emailEmpresa, assuntoEmpresa, corpoEmpresa);
    }

    private void enviarEmailOuLogar(String destinatario, String assunto, String corpo) {
        logger.info("================== DISPARO DE E-MAIL ==================");
        logger.info("Para: {}", destinatario);
        logger.info("Assunto: {}", assunto);
        logger.info("Corpo:\n{}", corpo);
        logger.info("=======================================================");

        if (mailSender != null) {
            try {
                SimpleMailMessage message = new SimpleMailMessage();
                message.setTo(destinatario);
                message.setSubject(assunto);
                message.setText(corpo);
                mailSender.send(message);
                logger.info("E-mail enviado via SMTP com sucesso para: {}", destinatario);
            } catch (Exception ex) {
                logger.warn("Falha no envio via SMTP ({}), notificação registrada em log local.", ex.getMessage());
            }
        }
    }
}
