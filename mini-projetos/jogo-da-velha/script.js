// Jogo da velha com modo 2 jogadores e modo contra o computador (algoritmo Minimax: a CPU nunca perde)
const LINHAS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // horizontais
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // verticais
  [0, 4, 8], [2, 4, 6],            // diagonais
]
const tabuleiroEl = document.getElementById('tabuleiro')
const statusEl = document.getElementById('status')
const placar = { X: 0, O: 0, E: 0 }

let casas, vez, fim, modo = '2p'

function novaPartida() {
  casas = Array(9).fill(null)
  vez = 'X'
  fim = false
  desenhar()
}

function vencedor(c) {
  for (const [a, b, d] of LINHAS) {
    if (c[a] && c[a] === c[b] && c[a] === c[d]) return { jogador: c[a], linha: [a, b, d] }
  }
  return c.every(Boolean) ? { jogador: 'E' } : null
}

function desenhar(linhaVencedora = []) {
  tabuleiroEl.innerHTML = ''
  casas.forEach((valor, i) => {
    const b = document.createElement('button')
    b.className = `casa ${valor ? valor.toLowerCase() : ''} ${linhaVencedora.includes(i) ? 'vence' : ''}`
    b.textContent = valor === 'X' ? '✕' : valor === 'O' ? '◯' : ''
    b.disabled = Boolean(valor) || fim
    b.setAttribute('aria-label', `Casa ${i + 1}${valor ? ': ' + valor : ''}`)
    b.addEventListener('click', () => jogar(i))
    tabuleiroEl.appendChild(b)
  })
  if (!fim) statusEl.textContent = modo === 'cpu' && vez === 'O' ? 'Computador pensando…' : `Vez do ${vez === 'X' ? '❌' : '⭕'}`
}

function jogar(i) {
  if (casas[i] || fim) return
  casas[i] = vez
  const r = vencedor(casas)
  if (r) return terminar(r)
  vez = vez === 'X' ? 'O' : 'X'
  desenhar()
  if (modo === 'cpu' && vez === 'O') setTimeout(() => jogar(melhorJogada()), 450)
}

function terminar(r) {
  fim = true
  placar[r.jogador]++
  document.getElementById('px').textContent = placar.X
  document.getElementById('po').textContent = placar.O
  document.getElementById('pe').textContent = placar.E
  statusEl.textContent = r.jogador === 'E' ? 'Deu velha! 🤝' : `${r.jogador === 'X' ? '❌' : '⭕'} venceu! 🎉`
  desenhar(r.linha || [])
}

// Minimax: testa todas as jogadas possíveis e escolhe a de melhor pontuação para o O
function minimax(c, jogador, profundidade = 0) {
  const r = vencedor(c)
  if (r) return r.jogador === 'O' ? 10 - profundidade : r.jogador === 'X' ? profundidade - 10 : 0
  const notas = []
  c.forEach((v, i) => {
    if (v) return
    c[i] = jogador
    notas.push(minimax(c, jogador === 'O' ? 'X' : 'O', profundidade + 1))
    c[i] = null
  })
  return jogador === 'O' ? Math.max(...notas) : Math.min(...notas)
}

function melhorJogada() {
  let melhor = -Infinity
  let jogada = casas.indexOf(null)
  casas.forEach((v, i) => {
    if (v) return
    casas[i] = 'O'
    const nota = minimax(casas, 'X')
    casas[i] = null
    if (nota > melhor) { melhor = nota; jogada = i }
  })
  return jogada
}

document.querySelector('.modos').addEventListener('click', (e) => {
  const b = e.target.closest('button')
  if (!b) return
  modo = b.dataset.modo
  document.querySelectorAll('.modos button').forEach((x) => x.classList.toggle('ativo', x === b))
  novaPartida()
})
document.getElementById('reiniciar').addEventListener('click', novaPartida)

novaPartida()
