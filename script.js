const campoTarefa = document.getElementById('campo-tarefa');
const botaoAdicionar = document.getElementById('botao-adicionar');
const listaTarefas = document.getElementById('lista-tarefas');
const contadorTarefas = document.getElementById('contador-tarefas');
const botaoTema = document.getElementById('botao-tema');
const btnLimpar = document.getElementById("botao-limpar");
const progressoPreenchimento = document.getElementById('progresso-preenchimento');
const textoProgresso = document.getElementById('texto-progresso');
const botoesFiltro = document.querySelectorAll('.filtro');
const prioridadeTarefa = document.getElementById('prioridade-tarefa');
const categoriaTarefa = document.getElementById('categoria-tarefa');
const dataTarefa = document.getElementById('data-tarefa');
const botaoChangelog = document.getElementById('botao-changelog');
let filtroAtual = 'todas';

if (dataTarefa) dataTarefa.min = new Date().toISOString().split('T')[0];

function salvarTarefas() {
    const tarefas = [...listaTarefas.children].map(li => ({
        texto: li.querySelector('span').textContent,
        concluida: li.classList.contains('concluida'),
        prioridade: li.dataset.prioridade || 'media',
        categoria: li.dataset.categoria || 'pessoal',
        dataVencimento: li.dataset.data || ''
    }));
    localStorage.setItem('minhasTarefas', JSON.stringify(tarefas));
}

function calcularStatusData(dataISO) {
    if (!dataISO) return { texto: '', classe: '' };
    const hoje = new Date(); hoje.setHours(0, 0, 0, 0);
    const venc = new Date(dataISO + 'T00:00:00');
    const diff = Math.ceil((venc - hoje) / 86400000);
    if (diff < 0) return { texto: `Atrasada ${Math.abs(diff)}d`, classe: 'atrasada' };
    if (diff === 0) return { texto: `Hoje`, classe: 'hoje' };
    if (diff === 1) return { texto: `Amanhã`, classe: 'amanha' };
    return { texto: dataISO.split('-').reverse().join('/'), classe: '' };
}

function criarItemTarefa(texto, concluida = false, prioridade = 'media', categoria = 'pessoal', dataVencimento = '') {
    const li = document.createElement('li');
    if (concluida) li.classList.add('concluida');
    li.dataset.prioridade = prioridade; li.dataset.categoria = categoria; li.dataset.data = dataVencimento;
    li.classList.add(`prioridade-${prioridade}`);

    const span = document.createElement('span'); span.textContent = texto;

    const tagsLinha = document.createElement('div'); tagsLinha.className = 'tags-linha';
    const tagPrioridade = document.createElement('small'); tagPrioridade.className = `tag-prioridade tag-${prioridade}`; tagPrioridade.textContent = prioridade;
    const tagCategoria = document.createElement('small'); tagCategoria.className = `tag-categoria ${categoria}`; tagCategoria.textContent = categoria;

    tagsLinha.append(tagCategoria, tagPrioridade);

    if (dataVencimento) {
        const status = calcularStatusData(dataVencimento);
        const dataSpan = document.createElement('small');
        dataSpan.className = `data-vencimento ${status.classe}`;
        dataSpan.innerHTML = `<i class="fa-regular fa-calendar"></i> ${status.texto}`;
        tagsLinha.append(dataSpan);
    }

    const acoes = document.createElement('div'); acoes.className = 'acoes-tarefa';
    acoes.innerHTML = `<button class="concluir"><i class="fa-solid fa-check"></i></button><button class="excluir"><i class="fa-solid fa-trash"></i></button>`;
    acoes.querySelector('.concluir').addEventListener('click', () => { li.classList.toggle('concluida'); atualizarContador(); salvarTarefas(); });
    acoes.querySelector('.excluir').addEventListener('click', () => { li.remove(); atualizarContador(); salvarTarefas(); });

    li.append(span, tagsLinha, acoes);
    listaTarefas.appendChild(li);
}

function atualizarContador() {
    const total = listaTarefas.children.length;
    const concluidas = listaTarefas.querySelectorAll('.concluida').length;
    contadorTarefas.textContent = `${total} ${total === 1 ? 'tarefa' : 'tarefas'} na lista`;
    const pct = total === 0 ? 0 : Math.round((concluidas / total) * 100);
    progressoPreenchimento.style.width = `${pct}%`;
    textoProgresso.textContent = pct === 100 && total > 0 ? '🎉 Tudo feito!' : `${pct}% concluído`;
    aplicarFiltro(filtroAtual);
}

function aplicarFiltro(f) {
    filtroAtual = f;
    [...listaTarefas.children].forEach(item => {
        const c = item.classList.contains('concluida');
        if (f === 'todas') item.style.display = 'flex';
        else if (f === 'pendentes') item.style.display = c ? 'none' : 'flex';
        else item.style.display = c ? 'flex' : 'none';
    });
}

function adicionarTarefa() {
    const txt = campoTarefa.value.trim(); if (!txt) return;
    criarItemTarefa(txt, false, prioridadeTarefa.value, categoriaTarefa.value, dataTarefa.value);
    campoTarefa.value = ''; dataTarefa.value = ''; campoTarefa.focus();
    atualizarContador(); salvarTarefas();
}

function carregarTarefas() {
    const salvas = JSON.parse(localStorage.getItem('minhasTarefas') || '[]');
    salvas.forEach(t => criarItemTarefa(t.texto, t.concluida, t.prioridade || 'media', t.categoria || 'pessoal', t.dataVencimento || ''));
    atualizarContador();
}

botoesFiltro.forEach(b => b.addEventListener('click', () => {
    botoesFiltro.forEach(x => x.classList.remove('ativo')); b.classList.add('ativo'); aplicarFiltro(b.dataset.filtro);
}));
botaoAdicionar.addEventListener('click', adicionarTarefa);
campoTarefa.addEventListener('keydown', e => { if (e.key === 'Enter') adicionarTarefa(); });
btnLimpar.addEventListener("click", () => {
    if (!listaTarefas.children.length) return;
    if (confirm("Apagar todas as tarefas?")) { listaTarefas.innerHTML = ""; localStorage.removeItem('minhasTarefas'); atualizarContador(); }
});
botaoTema.addEventListener('click', () => {
    document.body.classList.toggle('modo-escuro');
    const escuro = document.body.classList.contains('modo-escuro');
    botaoTema.querySelector('i').className = escuro ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
    localStorage.setItem('temaEscuro', escuro);
});
if (localStorage.getItem('temaEscuro') === 'true') {
    document.body.classList.add('modo-escuro');
    botaoTema.querySelector('i').className = 'fa-solid fa-sun';
}
botaoChangelog.addEventListener('click', () => {
    alert(`🚀 ATUALIZAÇÕES - Meu Painel de Tarefas v4.0 FINAL

✅ RF01 - Limpar Tudo
✅ RF02 - Barra de Progresso 0% a 100%
✅ RF03 - Filtros: Todas / Pendentes / Concluídas
✅ RF04 - Prioridade: Baixa/Média/Alta com cores e modo escuro
✅ RF05 - localStorage completo
✅ RF06 - Data de Vencimento: Hoje / Amanhã / Atrasada
✅ RF07 - Categorias NOVO: Trabalho / Estudo / Pessoal / Compras / Saúde`);
});
carregarTarefas();