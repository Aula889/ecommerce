/* js/app.js — roteador hash + templates simples (home, services, cart) */

(function(){
  const routes = {
    '/': renderHome,
    '/services': renderServices,
    '/estrutura': renderStructure,
    // '/shop' removed — loja excluída
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
      <!-- HERO -->
      <section class="hero">
        <div class="hero-content">
          <h1>Processos Inovadores para seu negócio</h1>
          <br>
          <p>Aumentamos produtividade, diminuímos custos, aumentamos faturamento e implementamos agentes de IA na sua operação.</p>
          <br>
          <div class="hero-cta">
           
            <button id="openDoc" class="btn btn-ghost">Contato via (WhatsApp)</button>
          </div>
        </div>
        <div class="hero-media"><img alt="Banner IA" src="assets/hero-banner.jpg"></div>
      </section>

      <!-- SERVIÇOS -->
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
          <h3>Nossa Ia</h3>
          <p>Automatize seus documentos.</p>
          <div class="product-meta"><a href="#/services" class="btn">Detalhes</a></div>
        </div>

        <!-- card 'Suporte Mensal' removido por solicitação do usuário -->
      </section>

      <!-- PROCESSO / PASSOS -->
      <section style="margin-top:1rem">
        <h2>Como fazemos</h2>
        <div class="steps">
          <div class="step"><span class="step-number">1</span><strong>Mapeamento</strong><div class="muted">Entendemos o processo</div></div>
          <div class="step"><span class="step-number">2</span><strong>Priorização</strong><div class="muted">Escolhemos soluções com maior impacto</div></div>
          <div class="step"><span class="step-number">3</span><strong>Construção</strong><div class="muted">Desenvolvemos e testamos</div></div>
          <div class="step"><span class="step-number">4</span><strong>Entrega</strong><div class="muted">Implantamos e acompanhamos resultados</div></div>
        </div>
      </section>

      <!-- VÍDEOS (mantemos os 2 vídeos do projeto) -->
      <section class="card" style="margin-top:1rem">
        <h2>Vídeos</h2>
        
        <div id="videosGrid" class="grid"></div>
      </section>

      <!-- EQUIPE / CONTATO -->
      <section style="margin-top:1rem">
        <h2>Nosso time</h2>
        <div class="team">
            <div class="team-item card">
              <div class="avatar"><img src="assets/sergio.png" alt="Sérgio Peralta" class="avatar-img"></div>
              <div class="team-info">
                <h3>Sérgio Peralta</h3>
                <div class="muted role">Sócio Fundador da JTP Solution e da REDUCE</div>
                <p class="bio muted">Mais de 32 anos de desenvolvimento de software em Logística e Comércio Exterior. Atuou como head de tecnologia em grandes players do mercado. Em 2017, funda a JTP Solution.</p>
              </div>
            </div>

            <div class="team-item card">
              <div class="avatar"><img src="assets/renato.png" alt="Renato Binoto" class="avatar-img"></div>
              <div class="team-info">
                <h3>Renato Binoto</h3>
                <div class="muted role">Sócio Fundador e Head de Projetos na REDUCE</div>
                <p class="bio muted">Mais de 18 anos trabalhando com projetos em multinacionais de tecnologia e Big4. Especialista em implementação de softwares e transformação digital.</p>
              </div>
            </div>

            <div class="team-item card">
              <div class="avatar"><img src="assets/matheus.png" alt="Matheus Pina" class="avatar-img"></div>
              <div class="team-info">
                <h3>Matheus Pina</h3>
                <div class="muted role">Sócio Fundador e Head de Vendas na REDUCE</div>
                <p class="bio muted">Mais de 12 anos de experiência em TI com atuação em área comercial. Consultoria de negócios em multinacionais e nacionais com forte relacionamento comercial.</p>
              </div>
            </div>
        </div>
      </section>

      <section class="contact" style="margin-top:1rem">
        <div><strong>Fale com nosso time</strong><div class="muted">Atendimento e consultoria via WhatsApp</div></div>
        <div><a id="contactWhatsapp" class="btn" href="#">Abrir WhatsApp</a></div>
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

    // bind contact button for direct WhatsApp
    const contactBtn = document.getElementById('contactWhatsapp');
    if(contactBtn){
      contactBtn.addEventListener('click', (e)=>{ e.preventDefault(); if(window.WhatsAppHelper) window.WhatsAppHelper.open('Olá, quero conversar sobre serviços.'); else { const phone = (window.WhatsAppConfig && window.WhatsAppConfig.PHONE) ? window.WhatsAppConfig.PHONE : '11 934753051'; const normalized = String(phone).replace(/\D/g,''); const phoneWithCountry = (normalized.length===11) ? '55'+normalized : normalized; window.open(`https://wa.me/${phoneWithCountry}?text=${encodeURIComponent('Olá, quero conversar sobre serviços.')}`,'_blank'); } });
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
        // prefer the existing #videosGrid created in the template; if missing, create a card and grid
        let grid = document.getElementById('videosGrid');
        if(!grid){
          const sec = document.createElement('section');
          sec.className = 'card';
          sec.innerHTML = `<h2>Vídeos</h2><p class="muted">Assista demonstrações e casos.</p><div id="videosGrid" class="grid"></div>`;
          app.appendChild(sec);
          grid = sec.querySelector('#videosGrid');
        }
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

        grid.querySelectorAll('.video-wrap').forEach(w=> io.observe(w));

      }catch(e){ console.error('Erro carregando videos:', e); }
    })();
  }

  function renderServices(){
    document.getElementById('app').innerHTML = `
      <section class="card services-hero">
        <div class="services-hero-inner">
          <h1>Áreas que Construímos Agentes Para:</h1>
          
        </div>
      </section>

      <section class="grid services-grid" aria-label="Áreas atendidas por agentes">
        <div class="card">
          <h3>Suprimentos e Compras</h3>
          <ul>
            <li>Leitura automática de NF</li>
            <li>Boleto</li>
            <li>Automação via e-mail</li>
          </ul>
        </div>

        <div class="card">
          <h3>Fábrica e Warehouse</h3>
          <ul>
            <li>Documentos escritos à mão</li>
            <li>Transformação em dados estruturados</li>
            <li>Transcrição direta no ERP</li>
          </ul>
        </div>

        <div class="card">
          <h3>Distribuição e Transportes</h3>
          <ul>
            <li>Leitura de documentos</li>
            <li>Construção de aplicativos</li>
          </ul>
        </div>

        <div class="card">
          <h3>Comercial</h3>
          <ul>
            <li>WhatsApp</li>
            <li>SMS</li>
            <li>Preenchimento automático em CRM</li>
          </ul>
        </div>

        <div class="card">
          <h3>Comércio Exterior</h3>
          <ul>
            <li>Leitura de documentos de importação e exportação</li>
            <li>Automação de processos</li>
          </ul>
        </div>

        <div class="card">
          <h3>Administrativo, RH e Faturamento</h3>
          <ul>
            <li>Universidade corporativa via WhatsApp</li>
            <li>Leitura de currículos</li>
            <li>Leitura de boletos e documentos</li>
            <li>Abertura de processos</li>
          </ul>
        </div>
      </section>
    `;
  }

  function renderStructure(){
    document.getElementById('app').innerHTML = `
      <section class="card">
        <h1>Estrutura e Segurança</h1>
        <p class="muted">Informações sobre arquitetura do agente, autenticação, infraestrutura e medidas de segurança.</p>
      </section>

      <section class="card" style="margin-top:1rem">
        <h2>Estrutura do Agente</h2>
        <ul>
          <li>✓ RAGs separados por clientes</li>
          <li>✓ Integração seguindo regras de autenticação</li>
          <li>✓ Redução na probabilidade matemática de alucinação</li>
        </ul>
      </section>

      <section class="card" style="margin-top:1rem">
        <h2>Segurança</h2>
        <ul>
          <li>✓ Interface utilizando OAuth</li>
          <li>✓ Tokens de autorização temporários</li>
          <li>✓ Programação em JAVA</li>
          <li>✓ Plataforma própria – Doctech</li>
          <li>✓ Autenticação do usuário e banco de dados protegido</li>
          <li>✓ Portas abertas apenas 80 e 443 (HTTP e HTTPS)</li>
          <li>✓ Proteção por VPN</li>
          <li>✓ Sistema operacional Linux</li>
        </ul>
        <p style="margin-top:.8rem">Cada negócio possui suas particularidades que podem ser atendidas por inúmeros softwares. Por isso seu agente será construído exclusivamente para a sua operação.</p>
      </section>
    `;
  }

  function router(){
    const appEl = document.getElementById('app');
    const hash = location.hash.replace('#','') || '/';
    const route = routes[hash] || routes['/'];

    if(!appEl){
      route();
      return;
    }

    // If this is the very first render (no anim class yet), render and fade-in
    const hasAnim = appEl.classList.contains('anim-in') || appEl.classList.contains('anim-out');
    if(!hasAnim){
      route();
      // add anim-in in next frame so transition applies
      requestAnimationFrame(()=> appEl.classList.add('anim-in'));
      return;
    }

    // Route change animation: fade out, replace content, fade in
    appEl.classList.remove('anim-in');
    appEl.classList.add('anim-out');

    const TRANS_MS = 260; // should match CSS
    setTimeout(()=>{
      route();
      requestAnimationFrame(()=>{
        appEl.classList.remove('anim-out');
        appEl.classList.add('anim-in');
      });
    }, TRANS_MS);
  }

  window.addEventListener('hashchange', router);
  window.addEventListener('load', ()=>{
    router();
  });

  // --- header hide on scroll
  (function initHeaderHide(){
    const header = document.querySelector('.site-header');
    if(!header) return;
    let lastY = window.scrollY || 0;
    let ticking = false;
    const threshold = 60; // wait until user scrolled a bit

    window.addEventListener('scroll', (ev)=>{
      const currentY = window.scrollY || 0;
      if(ticking) return;
      ticking = true;
      window.requestAnimationFrame(()=>{
        // if mobile nav/menu is open, don't hide header
        const navOpen = document.querySelector('.main-nav.open');
        if(navOpen){ header.classList.remove('site-header-hidden'); }
        else if(currentY > lastY && currentY > threshold){
          header.classList.add('site-header-hidden');
        } else {
          header.classList.remove('site-header-hidden');
        }
        lastY = Math.max(0, currentY);
        ticking = false;
      });
    }, { passive: true });
  })();

})();
