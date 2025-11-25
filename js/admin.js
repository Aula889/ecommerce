/* js/admin.js — editor simples para data/products.json (salva em localStorage) */

(async function(){
  const DATA_URL = 'data/products.json';
  const STORAGE_KEY = 'ai_products';
  const root = document.getElementById('adminApp');

  // fetchData() — pega data/products.json ou localStorage fallback
  async function fetchData(){
    try{
      const res = await fetch(DATA_URL);
      const json = await res.json();
      return json;
    } catch(e){
      const cached = localStorage.getItem(STORAGE_KEY);
      return cached ? JSON.parse(cached) : [];
    }
  }

  // renderList(products) — monta inputs editáveis para cada produto
  function renderList(products){
    root.innerHTML = '';
    products.forEach((p, idx)=>{
      const card = document.createElement('div'); card.className='card';
      card.innerHTML = `
        <label>Título<input class="form-control" data-idx="${idx}" name="title" value="${escapeHtml(p.title)}"></label>
        <label>Preço<input class="form-control" data-idx="${idx}" name="price" value="${p.price}"></label>
        <label>Resumo<input class="form-control" data-idx="${idx}" name="short" value="${escapeHtml(p.short)}"></label>
        <div style="margin-top:.5rem"><button class="btn save-item" data-idx="${idx}">Salvar item</button></div>
      `;
      root.appendChild(card);
    });

    // salvar: atualiza products no localStorage
    root.querySelectorAll('.save-item').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        const i = Number(btn.getAttribute('data-idx'));
        const inputs = document.querySelectorAll(`[data-idx="${i}"]`);
        const prod = products[i];
        inputs.forEach(inp=>{ prod[inp.name] = inp.value; });
        localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
        alert('Salvo localmente (localStorage). Para aplicar no site, faça upload do JSON no servidor static.');
      });
    });

    // export: baixa o JSON atual
    const downloadBtn = document.getElementById('download');
    if(downloadBtn){
      downloadBtn.addEventListener('click', ()=>{
        const dataStr = JSON.stringify(products, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href=url; a.download='products.json'; a.click(); URL.revokeObjectURL(url);
      });
    }
  }

  // escapeHtml() — protege valores antes de colocar em inputs
  function escapeHtml(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

  const products = await fetchData();
  renderList(products || []);
})();
