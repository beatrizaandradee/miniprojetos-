// Lista de tarefas com filtros, salva no navegador (localStorage)
const form = document.getElementById('form')
const input = document.getElementById('texto')
const lista = document.getElementById('lista')
const erro = document.getElementById('erro')
const contador = document.getElementById('contador')

let tarefas = carregar()
let filtro = 'todas'

function carregar() {
  try {
    return JSON.parse(localStorage.getItem('tarefas')) || [
      { id: 1, texto: 'Estudar React', feita: true },
      { id: 2, texto: 'Fazer o portfólio da faculdade', feita: false },
      { id: 3, texto: 'Subir os projetos no GitHub', feita: false },
    ]
  } catch {
    return []
  }
}

function salvar() {
  localStorage.setItem('tarefas', JSON.stringify(tarefas))
}

function render() {
  const visiveis = tarefas.filter((t) => (filtro === 'pendentes' ? !t.feita : filtro === 'feitas' ? t.feita : true))
  lista.innerHTML = ''
  if (visiveis.length === 0) {
    lista.innerHTML = '<li class="vazio">Nada por aqui 🎉</li>'
  }
  for (const t of visiveis) {
    const li = document.createElement('li')
    li.className = t.feita ? 'feita' : ''
    li.innerHTML = `
      <input type="checkbox" ${t.feita ? 'checked' : ''} aria-label="Concluir tarefa" />
      <span></span>
      <button class="apagar" aria-label="Apagar tarefa">✕</button>`
    li.querySelector('span').textContent = t.texto // textContent evita injeção de HTML
    li.querySelector('input').addEventListener('change', () => alternar(t.id))
    li.querySelector('.apagar').addEventListener('click', () => apagar(t.id))
    lista.appendChild(li)
  }
  const pendentes = tarefas.filter((t) => !t.feita).length
  contador.textContent = `${pendentes} ${pendentes === 1 ? 'pendente' : 'pendentes'}`
}

function alternar(id) {
  tarefas = tarefas.map((t) => (t.id === id ? { ...t, feita: !t.feita } : t))
  salvar()
  render()
}

function apagar(id) {
  tarefas = tarefas.filter((t) => t.id !== id)
  salvar()
  render()
}

form.addEventListener('submit', (e) => {
  e.preventDefault()
  const texto = input.value.trim()
  if (texto.length < 2) {
    erro.textContent = 'Escreva pelo menos 2 caracteres.'
    return
  }
  erro.textContent = ''
  tarefas.unshift({ id: Date.now(), texto, feita: false })
  input.value = ''
  salvar()
  render()
})

document.querySelector('.filtros').addEventListener('click', (e) => {
  const b = e.target.closest('button')
  if (!b) return
  filtro = b.dataset.filtro
  document.querySelectorAll('.filtros button').forEach((x) => x.classList.toggle('ativo', x === b))
  render()
})

document.getElementById('limpar').addEventListener('click', () => {
  tarefas = tarefas.filter((t) => !t.feita)
  salvar()
  render()
})

render()
