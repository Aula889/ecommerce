/*
  js/shop.js
  ---------------------------------------------------------------
  Responsável por carregar `data/products.json` e renderizar os cards de
  produtos/serviços na página 'Loja'.

  Principais responsabilidades:
  - Buscar produtos via fetch (DATA_URL)
  - Renderizar cards com imagem, título, preço e botão 'Comprar'
  - Ao clicar em 'Comprar', abrir WhatsApp para negociar (integra com whatsapp.js)

  Observação: o carrinho em localStorage é gerido por `js/cart.js` (se presente).
*/
(function(){
  const DATA_URL = 'data/products.json';
  let products = [];

  // loadProducts: busca o arquivo data/products.json
  // - Caso a fetch falhe, tenta ler uma versão armazenada em localStorage
  async function loadProducts(){
    try {
      const res = await fetch(DATA_URL);
      products = await res.json();
    } catch(e){
      console.error('Erro ao carregar products.json:', e);
      // fallback: try to read from localStorage
      const cached = localStorage.getItem('ai_products');
      products = cached ? JSON.parse(cached) : [];
    }
  }

  // productCard: gera o HTML (string) de um card de produto
  // - Recebe o objeto p (produto) e devolve o template do card
  function productCard(p){
    return `
      <article class="card" data-id="${p.id}">
        <div class="product-image"><img loading="lazy" alt="${p.title}" src="assets/${p.image || 'placeholder.svg'}"></div>
        <h3>${p.title}</h3>
        <p class="muted">${p.short}</p>
        <div class="product-meta">
          <strong>R$ ${p.price.toFixed(2)}</strong>
          <div>
            <button class="btn add-btn">Comprar</button>
          </div>
        </div>
      </article>
    `;
  }

  // render: monta a página da loja dentro de #app
  // - Chama loadProducts(), cria grid de cards e coloca handlers nos botões
  async function render(){
    const app = document.getElementById('app');
    app.innerHTML = '<section class="card"><h1>Loja</h1><p class="muted">Produtos e serviços disponíveis.</p></section>';
    await loadProducts();
    const grid = document.createElement('section');
    grid.className = 'grid';
    grid.setAttribute('aria-live','polite');
    grid.innerHTML = products.map(productCard).join('');
    app.appendChild(grid);

    // attach handlers: quando o usuário clica em "Comprar" abrimos o WhatsApp
    // - Montamos uma mensagem com o título e preço do produto
    // - Preferimos usar o helper `WhatsAppHelper.open` se disponível (centraliza configuração)
    // - Caso contrário, montamos manualmente a URL `wa.me` com o número em `WhatsAppConfig.PHONE`
    grid.querySelectorAll('.card').forEach(card=>{
      const id = card.getAttribute('data-id');
      const btn = card.querySelector('.add-btn');
      btn.addEventListener('click', ()=>{
        const p = products.find(x=>String(x.id)===String(id));
        if(!p) return;
        const msg = `Olá, tenho interesse no produto: ${p.title} (R$ ${p.price.toFixed(2)}). Gostaria de negociar.`;
        // prefer helper from whatsapp.js if available
        if(window.WhatsAppHelper && typeof window.WhatsAppHelper.open === 'function'){
          window.WhatsAppHelper.open(msg);
        } else {
          const phone = (window.WhatsAppConfig && window.WhatsAppConfig.PHONE) ? String(window.WhatsAppConfig.PHONE).replace(/\s+/g,'') : '5511999999999';
          const url = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
          window.open(url, '_blank');
        }
        // feedback visual: alteramos temporariamente o texto do botão para informar a ação
        const prev = btn.textContent;
        btn.textContent = 'Abrindo WhatsApp…';
        setTimeout(()=>btn.textContent = prev, 1200);
      });
    });
  }

  window.Shop = { render };
})();
