// Define a URL do servidor usada para enviar os dados do formulário de contato.
const API_URL = 'http://localhost:3000';

// Declara uma expressão regular para verificar se o e-mail possui um formato válido.
const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Declara uma expressão regular para verificar se o telefone possui o formato esperado.
const regexTelefone = /^\(?\d{2}\)?\s?9?\d{4}-?\d{4}$/;

// Obtém o campo de telefone da página.
const tel = document.getElementById('telefone');
// Verifica se o campo de telefone existe antes de ativar a máscara.
if (tel) {
  // Executa a formatação sempre que o usuário digitar no campo de telefone.
  tel.addEventListener('input', function () {
    // Remove caracteres não numéricos e limita o telefone a onze dígitos.
    let v = tel.value.replace(/\D/g, '').slice(0, 11);
    // Aplica a máscara completa quando já existem mais de seis dígitos.
    if (v.length > 6) v = '(' + v.slice(0, 2) + ') ' + v.slice(2, 7) + '-' + v.slice(7);
    // Aplica uma máscara parcial quando existem mais de dois dígitos.
    else if (v.length > 2) v = '(' + v.slice(0, 2) + ') ' + v.slice(2);
    // Atualiza o campo com os caracteres já formatados.
    tel.value = v;
  });
}

// Obtém o formulário de contato da página.
const formContato = document.getElementById('formContato');
// Verifica se o formulário de contato está presente na página.
if (formContato) {
  // Executa a validação e o envio quando o formulário de contato for submetido.
  formContato.addEventListener('submit', async function (e) {
    // Impede o recarregamento automático da página durante o envio.
    e.preventDefault();
    // Obtém o campo que recebe o nome completo.
    const nome = document.getElementById('nome');
    // Obtém o campo que recebe o e-mail.
    const email = document.getElementById('email');
    // Obtém o campo que recebe o assunto.
    const assunto = document.getElementById('assunto');
    // Obtém o campo que recebe a mensagem.
    const mensagem = document.getElementById('mensagem');
    // Obtém a caixa de autorização relacionada à LGPD.
    const lgpd = document.getElementById('lgpd');
    // Inicializa o indicador de que todos os dados são válidos.
    let ok = true;
    // Remove os estados de erro de todos os campos antes da validação.
    [nome, email, tel, assunto, mensagem, lgpd].forEach(limpar);

    // Exige nome completo com pelo menos cinco caracteres e duas palavras.
    if (nome.value.trim().split(' ').length < 2 || nome.value.trim().length < 5) { mostrarErro(nome, 'Digite seu nome e sobrenome'); ok = false; }
    // Confere se o e-mail corresponde ao formato esperado.
    if (!regexEmail.test(email.value)) { mostrarErro(email, 'E-mail inválido'); ok = false; }
    // Confere se o telefone corresponde ao formato esperado.
    if (!regexTelefone.test(tel.value)) { mostrarErro(tel, 'Telefone inválido. Ex: (11) 99999-9999'); ok = false; }
    // Exige que um assunto tenha sido selecionado.
    if (assunto.value === '') { mostrarErro(assunto, 'Selecione um assunto'); ok = false; }
    // Exige que a mensagem tenha pelo menos dez caracteres.
    if (mensagem.value.trim().length < 10) { mostrarErro(mensagem, 'A mensagem precisa ter pelo menos 10 caracteres'); ok = false; }
    // Exige que o usuário aceite os termos da LGPD.
    if (!lgpd.checked) { mostrarErro(lgpd, 'Você precisa aceitar para continuar'); ok = false; }
    // Interrompe o envio quando existe qualquer dado inválido.
    if (!ok) return;

    // Obtém o elemento destinado a apresentar o resultado do envio.
    const msg = document.getElementById('msgEnvio');
    // Captura tanto os erros da resposta quanto possíveis falhas de conexão.
    try {
      // Envia os dados preenchidos ao endpoint de contato do servidor.
      const resp = await fetch(API_URL + '/api/contato', {
        // Define que os dados serão enviados pelo método POST.
        method: 'POST',
        // Informa que o corpo da requisição utiliza o formato JSON.
        headers: { 'Content-Type': 'application/json' },
        // Converte os dados preenchidos em uma cadeia JSON.
        body: JSON.stringify({ nome: nome.value, email: email.value, telefone: tel.value, assunto: assunto.value, mensagem: mensagem.value, lgpd: lgpd.checked })
      });
      // Converte a resposta recebida do servidor para JSON.
      const dados = await resp.json();
      // Verifica se o servidor respondeu indicando que houve erro.
      if (!resp.ok) { msg.className = 'resultado falha'; msg.textContent = dados.erros.map(function (x) { return x.msg; }).join(' | '); return; }
      // Atualiza o estilo da mensagem para indicar sucesso.
      msg.className = 'resultado';
      // Mostra a mensagem de sucesso enviada pelo servidor.
      msg.textContent = dados.mensagem;
      // Limpa os campos do formulário após o envio bem-sucedido.
      formContato.reset();
    // Trata falhas ocorridas durante a requisição ou o processamento da resposta.
    } catch (erro) {
      // Mantém o mesmo elemento visual do resultado.
      msg.className = 'resultado';
      // Informa que os dados são válidos, mas o servidor está indisponível.
      msg.textContent = 'Dados válidos! (servidor offline — mensagem não enviada)';
    }
  });
}

// Obtém o formulário de login da página.
const formLogin = document.getElementById('formLogin');
// Verifica se o formulário de login está presente na página.
if (formLogin) {
  // Executa a validação quando o formulário de login for enviado.
  formLogin.addEventListener('submit', function (e) {
    // Impede o envio padrão do formulário.
    e.preventDefault();
    // Obtém o campo de e-mail usado no login.
    const email = document.getElementById('loginEmail');
    // Obtém o campo de senha usado no login.
    const senha = document.getElementById('loginSenha');
    // Inicializa o indicador de que o formulário é válido.
    let ok = true;
    // Limpa eventuais mensagens de erro dos campos de login.
    limpar(email); limpar(senha);
    // Confere se o e-mail corresponde ao formato esperado.
    if (!regexEmail.test(email.value)) { mostrarErro(email, 'E-mail inválido'); ok = false; }
    // Exige que a senha tenha pelo menos seis caracteres.
    if (senha.value.length < 6) { mostrarErro(senha, 'A senha precisa ter pelo menos 6 caracteres'); ok = false; }
    // Exibe uma mensagem demonstrativa quando todos os dados são válidos.
    if (ok) document.getElementById('msgLogin').textContent = 'Login demonstrativo realizado! Bem-vindo ao VOLTIA ONE.';
  });
}
