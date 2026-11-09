package com.lab03.demo;

import com.lab03.demo.dto.*;
import com.lab03.demo.exception.RegraNegocioException;
import com.lab03.demo.exception.SaldoInsuficienteException;
import com.lab03.demo.model.Instituicao;
import com.lab03.demo.model.TipoUtilizador;
import com.lab03.demo.repository.InstituicaoRepository;
import com.lab03.demo.service.AlunoService;
import com.lab03.demo.service.AuthService;
import com.lab03.demo.service.EmpresaService;
import com.lab03.demo.service.ProfessorService;
import com.lab03.demo.service.VantagemService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
class MoedaEstudantilIntegrationTest {

    @Autowired
    private AuthService authService;

    @Autowired
    private AlunoService alunoService;

    @Autowired
    private ProfessorService professorService;

    @Autowired
    private EmpresaService empresaService;

    @Autowired
    private VantagemService vantagemService;

    @Autowired
    private InstituicaoRepository instituicaoRepository;

    @Test
    @DisplayName("Deve autenticar com sucesso usuários pré-cadastrados")
    void testAutenticacaoSucesso() {
        LoginResponseDTO response = authService.autenticar(new LoginRequestDTO("prof.carlos", "123"));
        assertNotNull(response);
        assertEquals("prof.carlos", response.getLogin());
        assertEquals(TipoUtilizador.PROFESSOR, response.getTipo());
        assertEquals(1000, response.getSaldo());
    }

    @Test
    @DisplayName("Deve falhar autenticação com senha incorreta")
    void testAutenticacaoFalha() {
        assertThrows(RegraNegocioException.class, () -> {
            authService.autenticar(new LoginRequestDTO("prof.carlos", "senha_errada"));
        });
    }

    @Test
    @DisplayName("Professor deve conseguir transferir moedas para um aluno com justificativa obrigatória")
    void testEnviarMoedasSucesso() {
        List<ProfessorResponseDTO> professores = professorService.listarTodos();
        List<AlunoResponseDTO> alunos = alunoService.listarTodos();

        ProfessorResponseDTO prof = professores.getFirst();
        AlunoResponseDTO aluno = alunos.getFirst();

        int saldoAnteriorProf = prof.getSaldo();
        int saldoAnteriorAluno = aluno.getSaldo();
        int valorEnvio = 150;

        EnviarMoedasDTO dto = new EnviarMoedasDTO();
        dto.setAlunoId(aluno.getId());
        dto.setValor(valorEnvio);
        dto.setMotivo("Excelente participação e nota máxima no seminário de Engenharia de Software.");

        TransacaoResponseDTO transacao = professorService.enviarMoedas(prof.getId(), dto);

        assertNotNull(transacao);
        assertEquals(valorEnvio, transacao.getValor());
        assertEquals(dto.getMotivo(), transacao.getMotivo());

        // Verificar saldos atualizados
        ProfessorResponseDTO profAtualizado = professorService.buscarPorId(prof.getId());
        AlunoResponseDTO alunoAtualizado = alunoService.buscarPorId(aluno.getId());

        assertEquals(saldoAnteriorProf - valorEnvio, profAtualizado.getSaldo());
        assertEquals(saldoAnteriorAluno + valorEnvio, alunoAtualizado.getSaldo());
    }

    @Test
    @DisplayName("Professor não pode enviar moedas caso seu saldo seja insuficiente")
    void testEnviarMoedasSaldoInsuficiente() {
        List<ProfessorResponseDTO> professores = professorService.listarTodos();
        List<AlunoResponseDTO> alunos = alunoService.listarTodos();

        ProfessorResponseDTO prof = professores.getFirst();
        AlunoResponseDTO aluno = alunos.getFirst();

        EnviarMoedasDTO dto = new EnviarMoedasDTO();
        dto.setAlunoId(aluno.getId());
        dto.setValor(prof.getSaldo() + 500); // Excede o saldo
        dto.setMotivo("Tentativa de envio maior que o saldo");

        assertThrows(SaldoInsuficienteException.class, () -> {
            professorService.enviarMoedas(prof.getId(), dto);
        });
    }

    @Test
    @DisplayName("Envio de moedas deve ser rejeitado se a justificativa for vazia")
    void testEnviarMoedasSemMotivo() {
        List<ProfessorResponseDTO> professores = professorService.listarTodos();
        List<AlunoResponseDTO> alunos = alunoService.listarTodos();

        ProfessorResponseDTO prof = professores.getFirst();
        AlunoResponseDTO aluno = alunos.getFirst();

        EnviarMoedasDTO dto = new EnviarMoedasDTO();
        dto.setAlunoId(aluno.getId());
        dto.setValor(50);
        dto.setMotivo("   "); // Justificativa em branco

        assertThrows(RegraNegocioException.class, () -> {
            professorService.enviarMoedas(prof.getId(), dto);
        });
    }

    @Test
    @DisplayName("Professor pode receber cota semestral cumulativa de 1.000 moedas")
    void testAdicionarCotaSemestral() {
        List<ProfessorResponseDTO> professores = professorService.listarTodos();
        ProfessorResponseDTO prof = professores.getFirst();
        int saldoAntes = prof.getSaldo();

        professorService.adicionarCotaSemestral(prof.getId());

        ProfessorResponseDTO profAtualizado = professorService.buscarPorId(prof.getId());
        assertEquals(saldoAntes + 1000, profAtualizado.getSaldo());
    }

    @Test
    @DisplayName("Deve cadastrar novo aluno vinculado a uma instituição")
    void testCadastrarAlunoSucesso() {
        Instituicao inst = instituicaoRepository.findAll().getFirst();

        AlunoCadastroDTO dto = new AlunoCadastroDTO();
        dto.setLogin("novo.aluno");
        dto.setSenha("senha123");
        dto.setNome("Novo Aluno Teste");
        dto.setEmail("novo.aluno@teste.com");
        dto.setCpf("000.111.222-33");
        dto.setRg("MG-00.111.222");
        dto.setEndereco("Rua das Flores, 100");
        dto.setCurso("Sistemas de Informação");
        dto.setInstituicaoId(inst.getId());

        AlunoResponseDTO salvo = alunoService.cadastrar(dto);
        assertNotNull(salvo);
        assertNotNull(salvo.getId());
        assertEquals("Novo Aluno Teste", salvo.getNome());
        assertEquals(0, salvo.getSaldo());
        assertEquals(inst.getNome(), salvo.getInstituicaoNome());
    }

    @Test
    @DisplayName("Aluno deve conseguir resgatar vantagem se tiver saldo e gerar cupom")
    void testResgatarVantagemSucesso() {
        List<AlunoResponseDTO> alunos = alunoService.listarTodos();
        List<VantagemResponseDTO> vantagens = vantagemService.listarTodas();

        AlunoResponseDTO aluno = alunos.getFirst();
        VantagemResponseDTO vantagem = vantagens.getFirst();

        // Garantir que aluno tenha saldo para o resgate
        if (aluno.getSaldo() < vantagem.getCusto()) {
            List<ProfessorResponseDTO> profs = professorService.listarTodos();
            EnviarMoedasDTO env = new EnviarMoedasDTO();
            env.setAlunoId(aluno.getId());
            env.setValor(vantagem.getCusto() + 50);
            env.setMotivo("Carga para teste de resgate");
            professorService.enviarMoedas(profs.getFirst().getId(), env);
            aluno = alunoService.buscarPorId(aluno.getId());
        }

        int saldoAnterior = aluno.getSaldo();

        TransacaoResponseDTO resgate = alunoService.resgatarVantagem(aluno.getId(), vantagem.getId());

        assertNotNull(resgate);
        assertNotNull(resgate.getCodigoCupom());
        assertTrue(resgate.getCodigoCupom().startsWith("CUPOM-"));

        AlunoResponseDTO alunoPosResgate = alunoService.buscarPorId(aluno.getId());
        assertEquals(saldoAnterior - vantagem.getCusto(), alunoPosResgate.getSaldo());

        // Empresa parceira deve conseguir validar o cupom gerado
        TransacaoResponseDTO cupomValidado = empresaService.validarCupom(resgate.getCodigoCupom());
        assertNotNull(cupomValidado);
        assertEquals(resgate.getCodigoCupom(), cupomValidado.getCodigoCupom());
    }

    @Test
    @DisplayName("Resgate deve falhar se aluno possuir saldo menor que o custo da vantagem")
    void testResgateSaldoInsuficiente() {
        Instituicao inst = instituicaoRepository.findAll().getFirst();
        AlunoCadastroDTO dto = new AlunoCadastroDTO();
        dto.setLogin("aluno.sem.saldo");
        dto.setSenha("123");
        dto.setNome("Aluno Sem Saldo");
        dto.setEmail("semsaldo@teste.com");
        dto.setCpf("999.888.777-66");
        dto.setRg("MG-99.888.777");
        dto.setEndereco("Rua Zero, 0");
        dto.setCurso("Engenharia");
        dto.setInstituicaoId(inst.getId());
        AlunoResponseDTO novoAluno = alunoService.cadastrar(dto);

        VantagemResponseDTO vantagem = vantagemService.listarTodas().getFirst();

        assertThrows(SaldoInsuficienteException.class, () -> {
            alunoService.resgatarVantagem(novoAluno.getId(), vantagem.getId());
        });
    }

    @Test
    @DisplayName("Empresa parceira pode se cadastrar e cadastrar vantagens com foto, descrição e custo")
    void testEmpresaCadastrarVantagem() {
        EmpresaCadastroDTO empDto = new EmpresaCadastroDTO();
        empDto.setLogin("papelaria.central");
        empDto.setSenha("123");
        empDto.setNome("Papelaria Central");
        empDto.setEmail("contato@papelariacentral.com");

        EmpresaResponseDTO empSalva = empresaService.cadastrar(empDto);
        assertNotNull(empSalva);

        VantagemCadastroDTO vDto = new VantagemCadastroDTO();
        vDto.setDescricao("Kit de Cadernos e Canetas Técnicas");
        vDto.setFoto("https://images.unsplash.com/photo-example");
        vDto.setCusto(80);

        VantagemResponseDTO vSalva = empresaService.cadastrarVantagem(empSalva.getId(), vDto);
        assertNotNull(vSalva);
        assertEquals(80, vSalva.getCusto());
        assertEquals("Papelaria Central", vSalva.getEmpresaNome());
    }
}
