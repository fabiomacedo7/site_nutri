// =========================================
// script.js — Landing Page Nutricionista
// =========================================

// ---- 1. HEADER: adiciona classe ao rolar ----
const header = document.getElementById('header');

function onScroll() {
  if (window.scrollY > 40) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
}

window.addEventListener('scroll', onScroll, { passive: true });
onScroll(); // roda na carga


// ---- 2. MENU MOBILE ----
const navToggle = document.getElementById('nav-toggle');
const navLinks  = document.getElementById('nav-links');

navToggle.addEventListener('click', function () {
  const aberto = navLinks.classList.toggle('aberto');
  navToggle.setAttribute('aria-expanded', aberto);
});

// Fecha o menu ao clicar em um link
navLinks.querySelectorAll('a').forEach(function (link) {
  link.addEventListener('click', function () {
    navLinks.classList.remove('aberto');
    navToggle.setAttribute('aria-expanded', false);
  });
});


// ---- 3. SCROLL REVEAL ----
// Adiciona a classe .reveal em elementos que devem animar ao entrar na tela
const seletoresReveal = [
  '.hero__text',
  '.hero__visual',
  '.sobre__image-wrap',
  '.sobre__text',
  '.card',
  '.depoimento',
  '.faq__item',
  '.contato__texto',
  '.contato__form',
];

seletoresReveal.forEach(function (seletor) {
  document.querySelectorAll(seletor).forEach(function (el) {
    el.classList.add('reveal');
  });
});

// Usa IntersectionObserver para adicionar .visivel quando o elemento entra na viewport
const observerReveal = new IntersectionObserver(
  function (entradas) {
    entradas.forEach(function (entrada) {
      if (entrada.isIntersecting) {
        entrada.target.classList.add('visivel');
        observerReveal.unobserve(entrada.target); // para de observar após animar
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll('.reveal').forEach(function (el) {
  observerReveal.observe(el);
});


// ---- 4. CAROUSEL DE DEPOIMENTOS ----
const track      = document.getElementById('depoimentos-track');
const dotsWrap   = document.getElementById('dep-dots');
const btnPrev    = document.getElementById('dep-prev');
const btnNext    = document.getElementById('dep-next');

let currentDep = 0;

// Calcula número de cards visíveis (responsivo)
function cardsVisiveis() {
  if (window.innerWidth < 640) return 1;
  if (window.innerWidth < 960) return 2;
  return 4; // desktop mostra todos lado a lado com scroll nativo — controlamos via transform
}

const totalDeps = track ? track.querySelectorAll('.depoimento').length : 0;

// Cria dots
if (dotsWrap && totalDeps > 0) {
  for (let i = 0; i < totalDeps; i++) {
    const dot = document.createElement('button');
    dot.classList.add('dep-dot');
    dot.setAttribute('aria-label', 'Depoimento ' + (i + 1));
    if (i === 0) dot.classList.add('ativo');
    dot.addEventListener('click', function () {
      irParaDep(i);
    });
    dotsWrap.appendChild(dot);
  }
}

function irParaDep(indice) {
  if (!track) return;

  // Em telas grandes, o track tem largura suficiente; limitamos o indice
  const maximo = totalDeps - 1;
  currentDep = Math.max(0, Math.min(indice, maximo));

  const card      = track.querySelector('.depoimento');
  const cardWidth = card ? card.offsetWidth + 24 : 0; // gap = 24px
  track.style.transform = 'translateX(-' + (currentDep * cardWidth) + 'px)';

  // Atualiza dots
  dotsWrap.querySelectorAll('.dep-dot').forEach(function (dot, i) {
    dot.classList.toggle('ativo', i === currentDep);
  });
}

if (btnPrev) {
  btnPrev.addEventListener('click', function () {
    irParaDep(currentDep - 1);
  });
}

if (btnNext) {
  btnNext.addEventListener('click', function () {
    irParaDep(currentDep + 1);
  });
}

// Autoplay a cada 5s
let autoplayDep = setInterval(function () {
  const proximo = (currentDep + 1) % totalDeps;
  irParaDep(proximo);
}, 5000);

// Pausa autoplay ao interagir
[btnPrev, btnNext].forEach(function (btn) {
  if (btn) btn.addEventListener('click', function () {
    clearInterval(autoplayDep);
  });
});

// Swipe touch no carousel
if (track) {
  let touchStartX = 0;

  track.addEventListener('touchstart', function (e) {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });

  track.addEventListener('touchend', function (e) {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      clearInterval(autoplayDep);
      irParaDep(diff > 0 ? currentDep + 1 : currentDep - 1);
    }
  });
}


// ---- 5. FAQ ACCORDION ----
document.querySelectorAll('.faq__item').forEach(function (item) {
  const btn = item.querySelector('.faq__pergunta');

  btn.addEventListener('click', function () {
    const estaAberto = item.classList.contains('aberto');

    // Fecha todos os outros
    document.querySelectorAll('.faq__item.aberto').forEach(function (aberto) {
      aberto.classList.remove('aberto');
      aberto.querySelector('.faq__pergunta').setAttribute('aria-expanded', false);
    });

    // Abre/fecha o clicado
    if (!estaAberto) {
      item.classList.add('aberto');
      btn.setAttribute('aria-expanded', true);
    }
  });
});


// ---- 6. VALIDAÇÃO DO FORMULÁRIO ----
const form = document.getElementById('contato-form');

function mostrarErro(campoId, erroId, mensagem) {
  const campo = document.getElementById(campoId);
  const erro  = document.getElementById(erroId);
  if (campo) campo.classList.add('invalido');
  if (erro)  erro.textContent = mensagem;
}

function limparErro(campoId, erroId) {
  const campo = document.getElementById(campoId);
  const erro  = document.getElementById(erroId);
  if (campo) campo.classList.remove('invalido');
  if (erro)  erro.textContent = '';
}

function validarEmail(email) {
  // Regex simples para validação básica
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

if (form) {
  // Valida em tempo real ao sair do campo
  document.getElementById('nome').addEventListener('blur', function () {
    if (this.value.trim().length < 2) {
      mostrarErro('nome', 'erro-nome', 'Informe seu nome completo.');
    } else {
      limparErro('nome', 'erro-nome');
    }
  });

  document.getElementById('email').addEventListener('blur', function () {
    if (!validarEmail(this.value.trim())) {
      mostrarErro('email', 'erro-email', 'Informe um e-mail válido.');
    } else {
      limparErro('email', 'erro-email');
    }
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault(); // evita recarregar a página

    let valido = true;

    const nome  = document.getElementById('nome').value.trim();
    const email = document.getElementById('email').value.trim();

    // Valida nome
    if (nome.length < 2) {
      mostrarErro('nome', 'erro-nome', 'Informe seu nome completo.');
      valido = false;
    } else {
      limparErro('nome', 'erro-nome');
    }

    // Valida email
    if (!validarEmail(email)) {
      mostrarErro('email', 'erro-email', 'Informe um e-mail válido.');
      valido = false;
    } else {
      limparErro('email', 'erro-email');
    }

    if (!valido) return;

    // Simula envio (aqui você conectaria ao seu backend ou API)
    const btnEnviar = form.querySelector('[type="submit"]');
    btnEnviar.textContent = 'Enviando...';
    btnEnviar.disabled = true;

    setTimeout(function () {
      form.reset();
      btnEnviar.textContent = 'Enviar mensagem';
      btnEnviar.disabled = false;

      const sucesso = document.getElementById('form-sucesso');
      if (sucesso) {
        sucesso.removeAttribute('hidden');
        // Esconde mensagem após 5s
        setTimeout(function () {
          sucesso.setAttribute('hidden', '');
        }, 5000);
      }
    }, 1200);
  });
}


// ---- 7. BOTÃO VOLTAR AO TOPO ----
const backToTop = document.getElementById('back-to-top');

window.addEventListener('scroll', function () {
  if (window.scrollY > 400) {
    backToTop.classList.add('visivel');
  } else {
    backToTop.classList.remove('visivel');
  }
}, { passive: true });

if (backToTop) {
  backToTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}


// ---- 8. MÁSCARA DE TELEFONE ----
const telInput = document.getElementById('telefone');

if (telInput) {
  telInput.addEventListener('input', function () {
    // Remove tudo que não for número
    let v = this.value.replace(/\D/g, '');

    // Aplica máscara: (99) 99999-9999
    if (v.length > 11) v = v.slice(0, 11);

    if (v.length <= 2) {
      v = '(' + v;
    } else if (v.length <= 7) {
      v = '(' + v.slice(0, 2) + ') ' + v.slice(2);
    } else {
      v = '(' + v.slice(0, 2) + ') ' + v.slice(2, 7) + '-' + v.slice(7);
    }

    this.value = v;
  });
}