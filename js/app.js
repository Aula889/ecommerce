/* js/app.js — roteador hash + templates simples (home, services, shop, cart) */

(function(){
  const routes = {
    '/': renderHome,
    '/services': renderServices,
    '/shop': () => { if(window.Shop) window.Shop.render(); else renderLoading('Loja'); },
    '/cart': () => { if(window.Cart) window.Cart.render(); else renderLoading('Carrinho'); }
  };

  // renderLoading: mostra um cartão de carregamento simples enquanto uma página/rota é preparada.
  // Parâmetros:
  //  - name: string com o título da seção (ex.: "Loja")
  function renderLoading(name){
    document.getElementById('app').innerHTML = `
      <section class="card">
        <h2>${name}</h2>
        <p class="muted">Carregando...</p>
      </section>
    `;
  }

  // renderHome: monta o conteúdo da página inicial (hero, serviços, depoimentos) no #app
  // Observação: o botão "Enviar documento" abre o WhatsApp (interação configurada via helper)
  function renderHome(){
    document.getElementById('app').innerHTML = `
      <section class="card">
        <h1>Agente de IA</h1>
        <p>Atendimento autônomo por WhatsApp, leitura de documentos (PDF/OCR) e consultoria comercial.</p>
        <p>
          <a class="btn" href="#/shop">Ver pacotes</a>
          <!-- botão que oferece enviar documento via WhatsApp (abre conversa com número do vendedor) -->
          <button id="openDoc" class="btn btn-ghost">Enviar documento</button>
        </p>
      </section>

      <section class="grid" aria-label="Serviços em destaque">
        <!-- Card: Consultoria Comercial (ex.: diagnóstico e treinamento) -->
        <div class="card">
          <h3>Consultoria Comercial</h3>
          <p>Reestruturação e estratégia comercial para aumentar receita.</p>
          <div class="product-meta">
            <span class="badge">Mais vendido</span>
            <!-- Detalhar: botão que poderia abrir um modal ou ir para /services (ex.: detalhar serviço) -->
            <a href="#/services" class="btn btn-ghost">Detalhar</a>
          </div>
        </div>

        <!-- Card: Agente IA para WhatsApp -->
        <div class="card">
          <h3>Agente IA para WhatsApp</h3>
          <p>Automatize atendimento, vendas e suporte via WhatsApp.</p>
          <div class="product-meta"><a href="#/shop" class="btn">Contratar</a></div>
        </div>

        <!-- Card: Suporte Mensal -->
        <div class="card">
          <h3>Suporte Mensal</h3>
          <p>Suporte contínuo e otimizações semanais.</p>
          <!-- Planos: encaminha para página /shop onde planos podem ser mostrados como produtos -->
          <div class="product-meta"><a href="#/shop" class="btn btn-ghost">Planos</a></div>
        </div>
      </section>

      <!-- Depoimentos -> seção simples com feedbacks de clientes -->
      <section class="card">
        <h2>Depoimentos</h2>
        <p class="muted">"A solução automatizou 60% do atendimento e aumentou conversões." — Cliente Satisfeito</p>
      </section>
    `;

    // attach doc reader opener — o botão 'Enviar documento' abre o WhatsApp para confirmar envio
    const open = document.getElementById('openDoc');
    if(open){
      open.addEventListener('click', ()=>{
        // Mensagem padrão enviada para o vendedor via WhatsApp
        const msg = 'Olá, vou enviar um documento. Poderia confirmar o contato para envio?';
        // Usa helper global definido em whatsapp.js quando disponível
        if(window.WhatsAppHelper && typeof window.WhatsAppHelper.open === 'function'){
          window.WhatsAppHelper.open(msg);
        } else {
          // Fallback: montar url wa.me manual. Normaliza o número removendo não-dígitos
          const phone = (window.WhatsAppConfig && window.WhatsAppConfig.PHONE) ? window.WhatsAppConfig.PHONE : '11 934753051';
          const normalized = String(phone).replace(/\D/g,'');
          const phoneWithCountry = (normalized.length===11) ? '55'+normalized : normalized;
          const url = `https://wa.me/${phoneWithCountry}?text=${encodeURIComponent(msg)}`;
          window.open(url, '_blank');
        }
      });
    }

    // render videos section on home (loads data/videos.json)
    // renderVideos: carrega data/videos.json e injeta a seção de vídeos na Home
    // - cria cards com thumbnail (poster) e lazy-load dos vídeos com IntersectionObserver
    (async function renderVideos(){
      const fallback = [
        { id: 'v1', title: 'Video 1', mp4: 'videos/video 1.mp4', poster: 'assets/placeholder.svg' },
        { id: 'v2', title: 'Video 2', mp4: 'videos/2.mp4', poster: 'assets/placeholder.svg' }
      ];
      try{
        let videos = fallback;
        try{
          const res = await fetch('data/videos.json');
          if(res.ok){
            const js = await res.json();
            if(js && js.length) videos = js;
          }
        }catch(err){
          // fetch failed: use fallback
          console.warn('Não foi possível carregar data/videos.json — usando fallback', err);
        }

        if(!videos || !videos.length) return;
        const app = document.getElementById('app');
        const sec = document.createElement('section');
        sec.className = 'card';
        sec.innerHTML = `<h2>Vídeos</h2><p class="muted">Assista demonstrações e casos.</p><div id="videosGrid" class="grid"></div>`;
        app.appendChild(sec);
        const grid = sec.querySelector('#videosGrid');
        grid.innerHTML = videos.map(v=>`
          <div class="card video-card">
            <h4>${v.title}</h4>
            <div class="video-wrap" data-mp4="${v.mp4}" data-poster="${v.poster}"></div>
          </div>
        `).join('');

        // lazy-load videos when in viewport
        const io = new IntersectionObserver((entries, observer) => {
          entries.forEach(entry => {
            if(!entry.isIntersecting) return;
            const wrap = entry.target;
            const mp4 = wrap.dataset.mp4;
            const poster = wrap.dataset.poster || 'assets/placeholder.svg';
            const video = document.createElement('video');
            video.controls = true; video.preload = 'none'; video.playsInline = true; video.width = 560;
            if(poster) video.poster = poster;
            const s = document.createElement('source'); s.src = encodeURI(mp4); s.type = 'video/mp4';
            video.appendChild(s);
            wrap.innerHTML = ''; wrap.appendChild(video);
            observer.unobserve(wrap);
          });
        }, { rootMargin: '200px' });

        sec.querySelectorAll('.video-wrap').forEach(w=> io.observe(w));

      }catch(e){ console.error('Erro carregando videos:', e); }
    })();
  }

  function renderServices(){
    document.getElementById('app').innerHTML = `
      <section class="card">
        <h1>Serviços</h1>
        <p>Oferecemos: implantação de agentes IA, consultoria comercial, análise de documentos e integração com WhatsApp Business.</p>
      </section>
      <section class="grid">
        <div class="card"><h3>Implantação de Agente</h3><p>Design de fluxo, integração e treinamento.</p></div>
        <div class="card"><h3>Consultoria</h3><p>Diagnóstico, plano estratégico e execução.</p></div>
        <div class="card"><h3>Leitura de Documentos</h3><p>PDF viewer + OCR para extrair dados de contratos e notas.</p></div>
      </section>
    `;
  }

  function router(){
    const hash = location.hash.replace('#','') || '/';
    const route = routes[hash] || routes['/'];
    route();
  }

  window.addEventListener('hashchange', router);
  window.addEventListener('load', ()=>{
    router();
  });

})();
