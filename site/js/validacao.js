// Validacao dos formularios de contato e login
// Troque pela URL do backend hospedado (ex: Render)
const API_URL = 'http://localhost:3000';

const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const regexTelefone = /^\(?\d{2}\)?\s?9?\d{4}-?\d{4}$/;

// Mascara do telefone
const tel = document.getElementById('telefone');
if (tel) {
  tel.addEventListener('input', function () {
    let v = tel.value.replace(/\D/g, '').slice(0, 11);
    if (v.length > 6) v = '(' + v.slice(0, 2) + ') ' + v.slice(2, 7) + '-' + v.slice(7);
    else if (v.length > 2) v = '(' + v.slice(0, 2) + ') ' + v.slice(2);
    tel.value = v;
  });
}

const formContato = document.getElementById('formContato');
if (formContato) {
  formContato.addEventListener('submit', async function (e) {
    e.preventDefault();
    const nome = document.getElementById('nome');
    const email = document.getElementById('email');
    const assunto = document.getElementById('assunto');
    const mensagem = document.getElementById('mensagem');
    const lgpd = document.getElementById('lgpd');
    let ok = true;
    [nome, email, tel, assunto, mensagem, lgpd].forEach(limpar);

    if (nome.value.trim().split(' ').length < 2 || nome.value.trim().length < 5) { mostrarErro(nome, 'Digite seu nome e sobrenome'); ok = false; }
    if (!regexEmail.test(email.value)) { mostrarErro(email, 'E-mail inválido'); ok = false; }
    if (!regexTelefone.test(tel.value)) { mostrarErro(tel, 'Telefone inválido. Ex: (11) 99999-9999'); ok = false; }
    if (assunto.value === '') { mostrarErro(assunto, 'Selecione um assunto'); ok = false; }
    if (mensagem.value.trim().length < 10) { mostrarErro(mensagem, 'A mensagem precisa ter pelo menos 10 caracteres'); ok = false; }
    if (!lgpd.checked) { mostrarErro(lgpd, 'Você precisa aceitar para continuar'); ok = false; }
    if (!ok) return;

    const msg = document.getElementById('msgEnvio');
    try {
      const resp = await fetch(API_URL + '/api/contato', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome: nome.value, email: email.value, telefone: tel.value, assunto: assunto.value, mensagem: mensagem.value, lgpd: lgpd.checked })
      });
      const dados = await resp.json();
      if (!resp.ok) { msg.className = 'resultado falha'; msg.textContent = dados.erros.map(function (x) { return x.msg; }).join(' | '); return; }
      msg.className = 'resultado'; msg.textContent = dados.mensagem;
      formContato.reset();
    } catch (erro) {
      msg.className = 'resultado';
      msg.textContent = 'Dados válidos! (servidor offline — mensagem não enviada)';
    }
  });
}

const formLogin = document.getElementById('formLogin');
if (formLogin) {
  formLogin.addEventListener('submit', function (e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail');
    const senha = document.getElementById('loginSenha');
    let ok = true;
    limpar(email); limpar(senha);
    if (!regexEmail.test(email.value)) { mostrarErro(email, 'E-mail inválido'); ok = false; }
    if (senha.value.length < 6) { mostrarErro(senha, 'A senha precisa ter pelo menos 6 caracteres'); ok = false; }
    if (ok) document.getElementById('msgLogin').textContent = 'Login demonstrativo realizado! Bem-vindo ao VOLTIA ONE.';
  });
}
