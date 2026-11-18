// Menu mobile (abre e fecha)
const menuBtn = document.getElementById('menuBtn');
const menu = document.getElementById('menu');
menuBtn.addEventListener('click', function () {
  menu.classList.toggle('aberto');
  menuBtn.setAttribute('aria-expanded', menu.classList.contains('aberto'));
});

// Simulacao de seguro (pagina seguros)
const formSimulacao = document.getElementById('formSimulacao');
if (formSimulacao) {
  formSimulacao.addEventListener('submit', function (e) {
    e.preventDefault();
    const valor = document.getElementById('valorCarro');
    const plano = document.getElementById('plano');
    let ok = true;
    limpar(valor); limpar(plano);
    if (valor.value === '' || Number(valor.value) < 50000) { mostrarErro(valor, 'Informe um valor a partir de R$ 50.000'); ok = false; }
    if (plano.value === '') { mostrarErro(plano, 'Escolha um plano'); ok = false; }
    if (!ok) return;
    const anual = Number(valor.value) * Number(plano.value);
    document.getElementById('resultado').textContent =
      'Valor estimado: R$ ' + anual.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) + ' por ano (apenas demonstração).';
  });
}

function mostrarErro(campo, msg) {
  campo.parentElement.classList.add('invalido');
  campo.parentElement.querySelector('.erro').textContent = msg;
}
function limpar(campo) {
  campo.parentElement.classList.remove('invalido');
  campo.parentElement.querySelector('.erro').textContent = '';
}
