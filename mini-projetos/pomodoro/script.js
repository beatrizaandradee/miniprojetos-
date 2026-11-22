// Timer Pomodoro: 25 min de foco, 5 de pausa curta e 15 de pausa longa
const tempoEl = document.getElementById('tempo')
const anel = document.getElementById('anel')
const botao = document.getElementById('iniciar')
const CIRCUNFERENCIA = 2 * Math.PI * 52
anel.style.strokeDasharray = CIRCUNFERENCIA

let total = 25 * 60
let restante = total
let intervalo = null
let ciclos = Number(localStorage.getItem('ciclos-' + new Date().toDateString())) || 0
document.getElementById('ciclos').textContent = ciclos

function mostrar() {
  const m = String(Math.floor(restante / 60)).padStart(2, '0')
  const s = String(restante % 60).padStart(2, '0')
  tempoEl.textContent = `${m}:${s}`
  document.title = `${m}:${s} · Pomodoro`
  anel.style.strokeDashoffset = CIRCUNFERENCIA * (1 - restante / total)
}

function pausar() {
  clearInterval(intervalo)
  intervalo = null
  botao.textContent = '▶ Continuar'
}

function iniciar() {
  if (intervalo) return pausar()
  botao.textContent = '⏸ Pausar'
  intervalo = setInterval(() => {
    restante--
    mostrar()
    if (restante <= 0) terminou()
  }, 1000)
}

function terminou() {
  pausar()
  botao.textContent = '▶ Iniciar'
  if (total === 25 * 60) {
    ciclos++
    localStorage.setItem('ciclos-' + new Date().toDateString(), ciclos)
    document.getElementById('ciclos').textContent = ciclos
  }
  bipe()
  restante = total
  mostrar()
}

// Som curto gerado pelo próprio navegador (Web Audio API), sem arquivo de áudio
function bipe() {
  try {
    const ctx = new AudioContext()
    const osc = ctx.createOscillator()
    osc.frequency.value = 880
    osc.connect(ctx.destination)
    osc.start()
    osc.stop(ctx.currentTime + 0.4)
  } catch {
    /* navegador sem áudio */
  }
}

function trocarModo(minutos) {
  pausar()
  botao.textContent = '▶ Iniciar'
  total = minutos * 60
  restante = total
  mostrar()
}

botao.addEventListener('click', iniciar)
document.getElementById('resetar').addEventListener('click', () => trocarModo(total / 60))
document.querySelector('.modos').addEventListener('click', (e) => {
  const b = e.target.closest('button')
  if (!b) return
  document.querySelectorAll('.modos button').forEach((x) => x.classList.toggle('ativo', x === b))
  trocarModo(Number(b.dataset.min))
})

mostrar()
