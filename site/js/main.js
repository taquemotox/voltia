// Obtém o botão que abrirá ou fechará o menu no dispositivo móvel.
const menuBtn = document.getElementById('menuBtn');
// Obtém a área do menu que receberá a classe que controla sua abertura.
const menu = document.getElementById('menu');
// Adiciona um ouvinte para executar uma ação sempre que o botão do menu for clicado.
menuBtn.addEventListener('click', function () {
  // Alterna a classe "aberto" para mostrar ou ocultar o menu.
  menu.classList.toggle('aberto');
  // Atualiza o atributo de acessibilidade com o estado atual do menu.
  menuBtn.setAttribute('aria-expanded', menu.classList.contains('aberto'));
});

// Obtém o formulário usado para simular o valor do seguro.
const formSimulacao = document.getElementById('formSimulacao');
// Verifica se o formulário existe na página atual antes de continuar.
if (formSimulacao) {
  // Adiciona uma ação que será executada quando o formulário for enviado.
  formSimulacao.addEventListener('submit', function (e) {
    // Impede o envio padrão da página ao enviar o formulário.
    e.preventDefault();
    // Obtém o campo que contém o valor do carro.
    const valor = document.getElementById('valorCarro');
    // Obtém o campo que contém o plano selecionado.
    const plano = document.getElementById('plano');
    // Inicializa a variável de validação como verdadeira.
    let ok = true;
    // Limpa as mensagens de erro dos dois campos antes da nova validação.
    limpar(valor); limpar(plano);
    // Verifica se o valor está vazio ou abaixo do mínimo permitido.
    if (valor.value === '' || Number(valor.value) < 50000) { mostrarErro(valor, 'Informe um valor a partir de R$ 50.000'); ok = false; }
    // Verifica se o usuário selecionou um plano.
    if (plano.value === '') { mostrarErro(plano, 'Escolha um plano'); ok = false; }
    // Interrompe o cálculo quando algum campo possui erro.
    if (!ok) return;
    // Multiplica o valor do carro pelo fator do plano para obter o valor anual.
    const anual = Number(valor.value) * Number(plano.value);
    // Localiza o elemento de resultado e prepara a primeira parte da mensagem.
    document.getElementById('resultado').textContent =
      // Monta a mensagem exibindo o valor anual formatado para o padrão brasileiro.
      'Valor estimado: R$ ' + anual.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) + ' por ano (apenas demonstração).';
  });
}

// Define a função responsável por exibir uma mensagem de erro em um campo.
function mostrarErro(campo, msg) {
  // Adiciona ao elemento pai do campo a classe que destaca o erro visualmente.
  campo.parentElement.classList.add('invalido');
  // Escreve a mensagem de erro no elemento localizado dentro do pai do campo.
  campo.parentElement.querySelector('.erro').textContent = msg;
}
// Define a função responsável por limpar o estado de erro de um campo.
function limpar(campo) {
  // Remove do elemento pai do campo a classe que representa erro.
  campo.parentElement.classList.remove('invalido');
  // Apaga o texto da mensagem de erro associada ao campo.
  campo.parentElement.querySelector('.erro').textContent = '';
}
