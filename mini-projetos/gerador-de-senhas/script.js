// Gerador de senhas usando crypto.getRandomValues (aleatoriedade segura do navegador)
const $ = (id) => document.getElementById(id)
const GRUPOS = {
  maiusculas: 'ABCDEFGHJKLMNPQRSTUVWXYZ',
  minusculas: 'abcdefghijkmnopqrstuvwxyz',
  numeros: '23456789',
  simbolos: '!@#$%&*?-_=+',
}

function aleatorio(max) {
  const n = new Uint32Array(1)
  crypto.getRandomValues(n)
  return n[0] % max
}

function gerar() {
  const tamanho = Number($('tamanho').value)
  const escolhidos = Object.keys(GRUPOS).filter((g) => $(g).checked)
  if (escolhidos.length === 0) {
    $('senha').textContent = '—'
    $('aviso').textContent = 'Marque pelo menos uma opção.'
    medirForca('')
    return
  }
  $('aviso').textContent = ''
  // garante pelo menos 1 caractere de cada grupo escolhido
  const caracteres = escolhidos.map((g) => GRUPOS[g][aleatorio(GRUPOS[g].length)])
  const todos = escolhidos.map((g) => GRUPOS[g]).join('')
  while (caracteres.length < tamanho) caracteres.push(todos[aleatorio(todos.length)])
  // embaralha (algoritmo de Fisher-Yates)
  for (let i = caracteres.length - 1; i > 0; i--) {
    const j = aleatorio(i + 1)
    ;[caracteres[i], caracteres[j]] = [caracteres[j], caracteres[i]]
  }
  const senha = caracteres.join('')
  $('senha').textContent = senha
  medirForca(senha, todos.length)
}

// Força estimada em bits de entropia: tamanho × log2(quantidade de caracteres possíveis)
function medirForca(senha, alfabeto = 1) {
  const bits = senha ? senha.length * Math.log2(alfabeto) : 0
  const niveis = [
    [0, 'Muito fraca', '#ef4444', 10],
    [40, 'Fraca', '#f97316', 35],
    [60, 'Boa', '#eab308', 60],
    [80, 'Forte', '#22c55e', 85],
    [100, 'Muito forte', '#10b981', 100],
  ]
  const [, nome, cor, largura] = niveis.filter(([min]) => bits >= min).pop()
  $('barra').style.width = senha ? `${largura}%` : '0'
  $('barra').style.background = cor
  $('forcaTexto').textContent = senha ? `${nome} · ${Math.round(bits)} bits de entropia` : ''
}

$('tamanho').addEventListener('input', () => {
  $('tamanhoTexto').textContent = $('tamanho').value
  gerar()
})
document.querySelectorAll('.opcoes input').forEach((c) => c.addEventListener('change', gerar))
$('gerar').addEventListener('click', gerar)
$('copiar').addEventListener('click', async () => {
  const senha = $('senha').textContent
  if (senha === '—') return
  try {
    await navigator.clipboard.writeText(senha)
    $('aviso').textContent = 'Senha copiada! ✓'
  } catch {
    $('aviso').textContent = 'Selecione e copie manualmente.'
  }
})

gerar()
