/*
  js/whatsapp.js
  ---------------------------------------------------------------
  Widget simples para abrir conversas com o vendedor via WhatsApp.
  - Mantém uma configuração global `window.WhatsAppConfig.PHONE` com o número do vendedor
  - Expõe `window.WhatsAppHelper.open(message)` para abrir o chat usando `wa.me`
  - O botão flutuante `#whatsapp-float` e o link `#footer-whatsapp` usam essa função
  IMPORTANTE: não coloque tokens sensíveis no front-end. Para enviar mensagens via API
  use um back-end que chame a WhatsApp Business API com segurança.
*/

(function(){
  // Default seller number provided by user. Can be overridden by setting window.WhatsAppConfig before this script runs.
  window.WhatsAppConfig = window.WhatsAppConfig || { PHONE: '11 934753051' };

  // normalizePhone: padroniza um número bruto removendo caracteres e adicionando código do país
  // - recebe '11 934753051' ou '11934753051' e retorna '5511934753051' (com DDI 55)
  function normalizePhone(raw){
    // Remove todos os não-dígitos
    let digits = String(raw).replace(/\D/g,'');
    // Se vier no formato local (11 dígitos) adiciona código do Brasil (55)
    if(digits.length === 11){ digits = '55' + digits; }
    // Se já vier com código do país, retorna como está
    return digits;
  }

  // openWhatsApp: monta o link `wa.me` a partir do número configurado e abre em nova aba
  // - message: texto pré-preenchido que será enviado ao abrir o chat
  function openWhatsApp(message){
    const phoneRaw = window.WhatsAppConfig.PHONE;
    const phone = normalizePhone(phoneRaw);
    const text = encodeURIComponent(message || 'Olá, gostaria de saber mais sobre seus serviços.');
    const url = `https://wa.me/${phone}?text=${text}`;
    window.open(url, '_blank');
  }

  // Event: clique global que detecta o botão flutuante #whatsapp-float
  // - Usamos event delegation (document.addEventListener) para não precisar atachar múltiplos listeners
  document.addEventListener('click', (e)=>{
    // attach to the floating button
    const el = e.target.closest && e.target.closest('#whatsapp-float');
    if(el){
      // Ao clicar no botão flutuante, tentamos resumir o carrinho (se existir) e abrir conversa
      const cart = JSON.parse(localStorage.getItem('ai_cart')||'[]');
      let msg = 'Olá, tenho interesse nos seguintes itens:';
      if(cart.length){ cart.forEach(i=> msg += `\n- ${i.title} x${i.qty}`); }
      openWhatsApp(msg);
    }
  });

  // Footer link: evita o comportamento padrão e abre o WhatsApp via helper
  const footer = document.getElementById('footer-whatsapp');
  if(footer){ footer.addEventListener('click',(e)=>{ e.preventDefault(); openWhatsApp(); }); }

  // NOTE: To integrate with WhatsApp Business API for sending messages from backend:
  // - Send cart/order to your backend endpoint which calls WhatsApp Business Cloud API
  // - Use webhook to receive messages and update order status.
  // Do NOT put API tokens or server keys in client-side code.

  // Expor helper global para facilitar reuso por outros scripts
  window.WhatsAppHelper = { open: openWhatsApp };
})();
