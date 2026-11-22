// Calculadora: guarda o número anterior, a operação escolhida e o número atual
const telaAtual = document.getElementById('atual')
const telaAnterior = document.getElementById('anterior')

let atual = '0'
let anterior = null
let operacao = null
let acabouDeCalcular = false

function atualizarTela() {
  telaAtual.textContent = atual
  telaAnterior.textContent = anterior !== null ? `${formatar(anterior)} ${operacao}` : ''
  document.querySelectorAll('.op').forEach((b) => b.classList.toggle('ativo', b.dataset.op === operacao && atual === '0'))
}

// Troca vírgula por ponto para fazer contas, e o contrário para mostrar
const paraNumero = (texto) => Number(texto.replace(',', '.'))
const formatar = (n) => String(Math.round(n * 1e10) / 1e10).replace('.', ',')

function digitar(n) {
  if (acabouDeCalcular) {
    atual = '0'
    acabouDeCalcular = false
  }
  if (n === ',' && atual.includes(',')) return
  if (atual === '0' && n !== ',') atual = n
  else if (atual.length < 14) atual += n
  atualizarTela()
}

function calcular(a, b, op) {
  switch (op) {
    case '+': return a + b
    case '−': return a - b
    case '×': return a * b
    case '÷': return b === 0 ? NaN : a / b
  }
}

function escolherOperacao(op) {
  if (operacao && anterior !== null && !acabouDeCalcular) igual()
  anterior = paraNumero(atual)
  operacao = op
  atual = '0'
  acabouDeCalcular = false
  atualizarTela()
}

function igual() {
  if (operacao === null || anterior === null) return
  const resultado = calcular(anterior, paraNumero(atual), operacao)
  atual = Number.isNaN(resultado) ? 'Erro' : formatar(resultado)
  anterior = null
  operacao = null
  acabouDeCalcular = true
  atualizarTela()
}

function acao(tipo) {
  if (tipo === 'limpar') { atual = '0'; anterior = null; operacao = null }
  if (tipo === 'apagar') atual = atual.length > 1 && atual !== 'Erro' ? atual.slice(0, -1) : '0'
  if (tipo === 'porcento') atual = formatar(paraNumero(atual) / 100)
  if (tipo === 'igual') return igual()
  atualizarTela()
}

// Cliques nos botões
document.querySelector('.teclas').addEventListener('click', (e) => {
  const b = e.target.closest('button')
  if (!b) return
  if (b.dataset.num) digitar(b.dataset.num)
  if (b.dataset.op) escolherOperacao(b.dataset.op)
  if (b.dataset.acao) acao(b.dataset.acao)
})

// Teclado
const TECLAS_OP = { '+': '+', '-': '−', '*': '×', '/': '÷' }
document.addEventListener('keydown', (e) => {
  if (/^[0-9]$/.test(e.key)) digitar(e.key)
  else if (e.key === ',' || e.key === '.') digitar(',')
  else if (TECLAS_OP[e.key]) escolherOperacao(TECLAS_OP[e.key])
  else if (e.key === 'Enter' || e.key === '=') { e.preventDefault(); igual() }
  else if (e.key === 'Backspace') acao('apagar')
  else if (e.key === 'Escape') acao('limpar')
})

atualizarTela()
