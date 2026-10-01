const campoTarefa = document.getElementById('campo-tarefa');
const botaoAdicionar = document.getElementById('botao-adicionar');
const listaTarefas = document.getElementById('lista-tarefas');
const contadorTarefas = document.getElementById('contador-tarefas');
const botaoTema = document.getElementById('botao-tema');

function atualizarContador() {
    const total = listaTarefas.children.length;
    contadorTarefas.textContent = `${total} ${total === 1 ? 'tarefa' : 'tarefas'} na lista`;
}

function adicionarTarefa() {
    const textoTarefa = campoTarefa.value.trim();
    if (textoTarefa === '') return;

    const itemLista = document.createElement('li');
    itemLista.classList.add('item-tarefa');

    const textoSpan = document.createElement('span');
    textoSpan.textContent = textoTarefa;

    const acoes = document.createElement('div');
    acoes.classList.add('acoes-tarefa');
    acoes.innerHTML = `
        <button class="botao-acao concluir"><i class="fa-solid fa-check"></i></button>
        <button class="botao-acao excluir"><i class="fa-solid fa-trash"></i></button>
    `;

    itemLista.append(textoSpan, acoes);

    acoes.querySelector('.concluir').addEventListener('click', () => {
        itemLista.classList.toggle('item-tarefa-concluida');
    });

    acoes.querySelector('.excluir').addEventListener('click', () => {
        itemLista.remove();
        atualizarContador();
    });

    listaTarefas.appendChild(itemLista);
    campoTarefa.value = '';
    campoTarefa.focus();
    atualizarContador();
}

botaoAdicionar.addEventListener('click', adicionarTarefa);
campoTarefa.addEventListener('keydown', (evento) => {
    if (evento.key === 'Enter') adicionarTarefa();
});
botaoTema.addEventListener('click', () => {
    document.body.classList.toggle('modo-escuro');
    const icone = botaoTema.querySelector('i');
    const escuro = document.body.classList.contains('modo-escuro');
    icone.className = escuro ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
});
atualizarContador();