// ════════════════════════════════════════════════
//  CONFIG
// ════════════════════════════════════════════════
const WA      = '5511963208855';
const JSONURL = '/api/produtos';

// ════════════════════════════════════════════════
//  HELPERS
// ════════════════════════════════════════════════
const WAICO = `<svg viewBox="0 0 24 24" fill="currentColor">
  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.122.554 4.118 1.524 5.855L0 24l6.336-1.499A11.943 11.943 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.856 0-3.592-.5-5.088-1.373l-.364-.214-3.762.89.948-3.667-.237-.38A9.946 9.946 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
</svg>`;

const EYE_ICO = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
  <circle cx="12" cy="12" r="3"/>
</svg>`;

function svgOculos(cor, rx) {
  const r = Math.min(Number(rx) || 8, 14);
  return `<svg class="svg-fallback" viewBox="0 0 120 60" xmlns="http://www.w3.org/2000/svg">
    <line x1="52" y1="30" x2="68" y2="30" stroke="${cor}" stroke-width="2.5" opacity=".7"/>
    <rect x="8"  y="14" width="42" height="28" rx="${r}" fill="none" stroke="${cor}" stroke-width="2.2"/>
    <rect x="10" y="16" width="38" height="24" rx="${Math.max(r-2,0)}" fill="${cor}" opacity=".10"/>
    <rect x="70" y="14" width="42" height="28" rx="${r}" fill="none" stroke="${cor}" stroke-width="2.2"/>
    <rect x="72" y="16" width="38" height="24" rx="${Math.max(r-2,0)}" fill="${cor}" opacity=".10"/>
    <line x1="8"   y1="22" x2="2"   y2="20" stroke="${cor}" stroke-width="2" opacity=".5"/>
    <line x1="112" y1="22" x2="118" y2="20" stroke="${cor}" stroke-width="2" opacity=".5"/>
  </svg>`;
}

// Cria tag <img> com fade in + fallback
function imgTag(src, alt, cls = '') {
  return `<img src="${src}" alt="${alt}" class="${cls}" loading="lazy"
    onload="this.classList.add('loaded')"
    onerror="this.remove()"/>`;
}

function waHref(nome, preco) {
  return `https://wa.me/${WA}?text=${encodeURIComponent(`Quero informação sobre armação *${nome}* por ${preco}.`)}`;
}

// ════════════════════════════════════════════════
//  CARD
// ════════════════════════════════════════════════
// Extrai as 4 fotos do objeto imagens → array [{src, label}]
function listaImagens(prod) {
  const imgs = prod.imagens || {};
  return [
    { src: imgs.capa     || null, label: 'Frente'   },
    { src: imgs.lateral  || null, label: 'Lateral'  },
    { src: imgs.detalhe  || null, label: 'Detalhe'  },
    { src: imgs.ambiente || null, label: 'Ambiente' },
  ];
}

function blocoImagem(prod) {
  const svg  = svgOculos(prod.cor, prod.rx);
  const capa = (prod.imagens || {}).capa || null;

  return `<div class="card-img">
    ${svg}
    ${capa ? imgTag(capa, prod.nome) : ''}
    <div class="card-img-overlay">
      <button class="btn-ver">${EYE_ICO} Visualizar</button>
    </div>
  </div>`;
}

function criarCard(prod, idx) {
  const badge  = prod.badge  ? `<div class="card-badge">${prod.badge}</div>` : '';
  const antigo = prod.antigo ? `<div class="price-old">${prod.antigo}</div>` : '';

  const card = document.createElement('div');
  card.className = 'card';
  card.style.animationDelay = `${idx * 0.06}s`;
  card.innerHTML = `
    ${badge}
    ${blocoImagem(prod)}
    <div class="card-body">
      <div class="card-brand">${prod.marca}</div>
      <div class="card-name">${prod.nome}</div>
      <div class="card-price-row">
        <div class="price">
          ${antigo}
          <div class="price-label">a partir de</div>
          <div class="price-now">${prod.preco}</div>
        </div>
        <a class="btn-wa" href="${waHref(prod.nome, prod.preco)}" target="_blank" aria-label="WhatsApp">
          ${WAICO}
        </a>
      </div>
    </div>`;

  // Botão Visualizar abre o modal
  card.querySelector('.btn-ver').addEventListener('click', (e) => {
    e.stopPropagation();
    abrirModal(prod);
  });

  return card;
}

// ════════════════════════════════════════════════
//  MODAL
// ════════════════════════════════════════════════
const overlay   = document.getElementById('modalOverlay');
const modalEl   = document.getElementById('modal');
const mainImg   = document.getElementById('modalMainImg');
const thumbsEl  = document.getElementById('modalThumbs');
const infoEl    = document.getElementById('modalInfo');

function setMainImg(prod, idx) {
  const fotos = listaImagens(prod);
  const foto  = fotos[idx];
  const svg   = svgOculos(prod.cor, prod.rx);

  mainImg.innerHTML = svg + (foto.src ? imgTag(foto.src, `${prod.nome} — ${foto.label}`) : '');

  thumbsEl.querySelectorAll('.modal-thumb').forEach((t, i) => {
    t.classList.toggle('active', i === idx);
  });
}

function abrirModal(prod) {
  const fotos = listaImagens(prod);

  // ── Imagem principal (capa) ──────────────────
  const svg0  = svgOculos(prod.cor, prod.rx);
  const capa  = fotos[0];
  mainImg.innerHTML = svg0 + (capa.src ? imgTag(capa.src, prod.nome) : '');

  // ── Thumbnails com label de ângulo ───────────
  thumbsEl.innerHTML = '';
  fotos.forEach((foto, i) => {
    const t = document.createElement('div');
    t.className = 'modal-thumb' + (i === 0 ? ' active' : '');
    t.title = foto.label;
    t.innerHTML = `
      ${svgOculos(prod.cor, prod.rx)}
      ${foto.src ? imgTag(foto.src, `${prod.nome} — ${foto.label}`) : ''}
      <span class="thumb-label">${foto.label}</span>`;

    t.addEventListener('click', () => {
      setMainImg(prod, i);       // atualiza a imagem principal do modal
      abrirLightbox(prod, i);    // abre o lightbox na foto clicada
    });

    thumbsEl.appendChild(t);
  });

  // ── Informações ──────────────────────────────
  const badge  = prod.badge  ? `<div class="modal-badge">${prod.badge}</div>` : '';
  const antigo = prod.antigo
    ? `<div class="modal-price-old">${prod.antigo}</div>` : '';

  infoEl.innerHTML = `
    ${badge}
    <div class="modal-marca">${prod.marca}</div>
    <div class="modal-nome">${prod.nome}</div>
    <div class="modal-genero">${prod.genero || ''}</div>

    <div class="modal-desc">${prod.descricao || ''}</div>

    <div class="modal-specs">
      <div class="modal-spec">
        <span class="spec-label">Material</span>
        <span class="spec-val">${prod.material || '—'}</span>
      </div>
      <div class="modal-spec">
        <span class="spec-label">Formato</span>
        <span class="spec-val">${prod.formato || '—'}</span>
      </div>
      <div class="modal-spec">
        <span class="spec-label">Gênero</span>
        <span class="spec-val">${prod.genero || '—'}</span>
      </div>
    </div>

    <div class="modal-price-block">
      ${antigo}
      <div class="modal-price-label">por</div>
      <div class="modal-price-now">${prod.preco}</div>
    </div>

    <a class="modal-wa-btn" href="${waHref(prod.nome, prod.preco)}" target="_blank">
      ${WAICO} Quero este modelo
    </a>`;

  // Abre overlay
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
  modalEl.scrollTop = 0;
}

function fecharModal() {
  overlay.classList.remove('open');
  document.body.style.overflow = '';
}

// Fecha ao clicar no overlay ou no botão X
document.getElementById('modalClose').addEventListener('click', fecharModal);
overlay.addEventListener('click', (e) => { if (e.target === overlay) fecharModal(); });

// ════════════════════════════════════════════════
//  LIGHTBOX
// ════════════════════════════════════════════════
const lightbox  = document.getElementById('lightbox');
const lbLabel   = document.getElementById('lbLabel');
const lbImgWrap = document.getElementById('lbImgWrap');
const lbStrip   = document.getElementById('lbStrip');
const lbClose   = document.getElementById('lbClose');
const lbPrev    = document.getElementById('lbPrev');
const lbNext    = document.getElementById('lbNext');

let lbProd  = null;  // produto atual no lightbox
let lbIdx   = 0;     // índice da foto atual

function lbSetFoto(idx) {
  const fotos = listaImagens(lbProd);
  lbIdx = (idx + fotos.length) % fotos.length; // wrap circular
  const foto = fotos[lbIdx];

  // Troca a imagem principal (mantém o SVG atrás como fallback)
  const imgEl = lbImgWrap.querySelector('img.lb-main');
  if (imgEl) imgEl.remove();

  if (foto.src) {
    const img = document.createElement('img');
    img.className = 'lb-main';
    img.src = foto.src;
    img.alt = `${lbProd.nome} — ${foto.label}`;
    img.onload  = () => img.classList.add('loaded');
    img.onerror = () => img.remove();
    lbImgWrap.insertBefore(img, lbPrev); // insere antes das setas
  }

  // Label
  lbLabel.textContent = `${lbProd.nome}  ·  ${foto.label}`;

  // Destaca thumb ativo na tira
  lbStrip.querySelectorAll('.lightbox-thumb').forEach((t, i) => {
    t.classList.toggle('active', i === lbIdx);
  });
}

function abrirLightbox(prod, idx) {
  lbProd = prod;
  const fotos = listaImagens(prod);

  // Monta a tira de thumbnails (só uma vez por produto)
  lbStrip.innerHTML = '';
  fotos.forEach((foto, i) => {
    const t = document.createElement('div');
    t.className = 'lightbox-thumb';
    t.innerHTML = svgOculos(prod.cor, prod.rx) +
      (foto.src ? `<img src="${foto.src}" alt="${foto.label}"
        onload="this.classList.add('loaded')" onerror="this.remove()">` : '');
    t.addEventListener('click', () => lbSetFoto(i));
    lbStrip.appendChild(t);
  });

  // Garante que o SVG de fallback existe na área principal
  if (!lbImgWrap.querySelector('.svg-fallback')) {
    lbImgWrap.insertAdjacentHTML('afterbegin', svgOculos(prod.cor, prod.rx));
  } else {
    lbImgWrap.querySelector('.svg-fallback').outerHTML = svgOculos(prod.cor, prod.rx);
  }

  lbSetFoto(idx);
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function fecharLightbox() {
  lightbox.classList.remove('open');
  // mantém o body bloqueado pois o modal ainda está aberto
}

lbClose.addEventListener('click', fecharLightbox);
lbPrev.addEventListener('click',  () => lbSetFoto(lbIdx - 1));
lbNext.addEventListener('click',  () => lbSetFoto(lbIdx + 1));

// Fecha lightbox clicando no fundo (mas não nas setas ou thumbs)
lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox || e.target === lbImgWrap) fecharLightbox();
});

// Teclado: ESC fecha lightbox (ou modal se lightbox fechado), setas navegam
document.addEventListener('keydown', (e) => {
  if (lightbox.classList.contains('open')) {
    if (e.key === 'Escape')     fecharLightbox();
    if (e.key === 'ArrowLeft')  lbSetFoto(lbIdx - 1);
    if (e.key === 'ArrowRight') lbSetFoto(lbIdx + 1);
  } else if (overlay.classList.contains('open')) {
    if (e.key === 'Escape') fecharModal();
  }
});

// ════════════════════════════════════════════════
//  GRID  +  TABS
// ════════════════════════════════════════════════
const feito = new Set();

function preencherGrid(cat, dados) {
  if (feito.has(cat)) return;
  feito.add(cat);

  const grid  = document.getElementById(`grid-${cat}`);
  const cnt   = document.getElementById(`cnt-${cat}`);
  const lista = dados[cat] || [];

  grid.innerHTML = '';
  cnt.textContent = `${lista.length} modelo${lista.length !== 1 ? 's' : ''}`;

  if (!lista.length) {
    grid.innerHTML = '<div class="msg-state">Nenhum produto cadastrado</div>';
    return;
  }
  lista.forEach((p, i) => grid.appendChild(criarCard(p, i)));
}

// ════════════════════════════════════════════════
//  INIT
// ════════════════════════════════════════════════
(async () => {
  let dados;
  try {
    const r = await fetch(JSONURL);
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    dados = await r.json();
  } catch (e) {
    console.error('Erro ao carregar produtos.json:', e);
    document.querySelectorAll('.grid').forEach(g => {
      g.innerHTML = '<div class="msg-state">⚠ Erro ao carregar produtos</div>';
    });
    return;
  }

  preencherGrid('feminino', dados);

  document.querySelectorAll('.cat-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const cat = btn.dataset.cat;
      document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.cat-section').forEach(s => s.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById(`sec-${cat}`).classList.add('active');
      preencherGrid(cat, dados);
    });
  });
})();
