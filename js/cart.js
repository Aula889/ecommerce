/* js/cart.js — gerencia carrinho (localStorage) e checkout simulado */

(function(){
  // Chaves usadas no localStorage
  const KEY = 'ai_cart';
  const ORDERS = 'ai_orders';

  // getCart() — retorna array do localStorage (ai_cart)
  function getCart(){
    try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch(e){ return []; }
  }

  // saveCart(cart) — salva no localStorage
  function saveCart(cart){ localStorage.setItem(KEY, JSON.stringify(cart)); }

  // addToCart(product) — adiciona produto (ou incrementa qty)
  function addToCart(product){
    const cart = getCart();
    const existing = cart.find(i=>i.id==product.id);
    if(existing){ existing.qty +=1; } else { cart.push({ ...product, qty:1 }); }
    saveCart(cart);
    // Evento customizado para notificar outras partes da UI que o carrinho foi atualizado
    window.dispatchEvent(new CustomEvent('cart:updated', { detail: cart }));
  }

  // calc(cart) — calcula subtotal, taxa fictícia e total
  function calc(cart){
    const subtotal = cart.reduce((s,i)=>s + (i.price * i.qty), 0);
    const tax = subtotal * 0.12; // imposto fictício
    return { subtotal, tax, total: subtotal + tax };
  }

  // render() — mostra carrinho, resumo e formulário de checkout (simulado)
  function render(){
    const cart = getCart();
    const app = document.getElementById('app');
    if(!app) return;
    app.innerHTML = '<section class="card"><h1>Seu Carrinho</h1></section>';

    // Se vazio, mostramos um link para nossas áreas / serviços
    if(cart.length===0){
      app.innerHTML += '<p class="muted">Seu carrinho está vazio. <a href="#/services">Ver nossos serviços</a></p>';
      return;
    }

    // Lista de itens
    const list = document.createElement('div');
    list.className='grid';
    list.innerHTML = cart.map(item=>`
      <div class="card">
        <h3>${item.title}</h3>
        <p class="muted">Quantidade: ${item.qty}</p>
        <p>R$ ${item.price.toFixed(2)}</p>
      </div>
    `).join('');
    app.appendChild(list);

    // Resumo e formulário de checkout
    const summary = document.createElement('aside');
    summary.className='cart-summary';
    const { subtotal, tax, total } = calc(cart);
    summary.innerHTML = `
      <h3>Resumo do pedido</h3>
      <p>Subtotal: R$ ${subtotal.toFixed(2)}</p>
      <p>Impostos (12%): R$ ${tax.toFixed(2)}</p>
      <p><strong>Total: R$ ${total.toFixed(2)}</strong></p>
      <div style="margin-top:.6rem">
        <label class="muted">Cupom (simulado)</label>
        <input id="coupon" class="form-control" placeholder="INSIRA-CUPOM">
        <button id="applyCoupon" class="btn btn-ghost" style="margin-top:.5rem">Aplicar</button>
      </div>
      <hr>
      <h4>Finalizar</h4>
      <form id="checkoutForm">
        <input class="form-control" name="name" placeholder="Nome*" required>
        <input class="form-control" name="email" placeholder="Email*" type="email" required>
        <input class="form-control" name="phone" placeholder="Telefone*" required>
        <input class="form-control" name="company" placeholder="Empresa (opcional)">
        <label><input type="checkbox" name="whatsapp" checked> Atendimento por WhatsApp</label>
        <button type="submit" class="btn">Finalizar</button>
      </form>
      <div id="orderResult" aria-live="polite"></div>
    `;
    app.appendChild(summary);

    // Handler cupom (simulado)
    document.getElementById('applyCoupon').addEventListener('click', ()=>{
      const code = document.getElementById('coupon').value.trim();
      if(code === 'DESCONTO10'){
        alert('Cupom aplicado: 10% off (simulado)');
      } else { alert('Cupom inválido (simulado)'); }
    });

    // Handler do checkout: salva pedido em ai_orders e limpa carrinho
    document.getElementById('checkoutForm').addEventListener('submit', (e)=>{
      e.preventDefault();
      const fd = new FormData(e.target);
      const order = {
        id: 'PED-' + Date.now().toString(36).toUpperCase().slice(-6),
        customer: { name: fd.get('name'), email: fd.get('email'), phone: fd.get('phone'), company: fd.get('company') },
        items: cart,
        totals: calc(cart),
        createdAt: new Date().toISOString()
      };
      const orders = JSON.parse(localStorage.getItem(ORDERS) || '[]');
      orders.push(order);
      localStorage.setItem(ORDERS, JSON.stringify(orders));
      // Limpa o carrinho
      saveCart([]);
      document.getElementById('orderResult').innerHTML = `<p class="card">Pedido salvo! Número: <strong>${order.id}</strong><br>Você também pode abrir atendimento via WhatsApp para concluir pagamento/contrato.</p>`;
      // Se marcado atendimento por WhatsApp, abre conversa com resumo do pedido
      if(fd.get('whatsapp')){
        const text = encodeURIComponent(`Olá, finalizei um pedido (${order.id}). Total: R$ ${order.totals.total.toFixed(2)}. Meus dados: ${order.customer.name} ${order.customer.phone}`);
        const phone = window.WhatsAppConfig && window.WhatsAppConfig.PHONE ? window.WhatsAppConfig.PHONE : '5581999999999';
        window.open(`https://wa.me/${phone}?text=${text}`,'_blank');
      }
      // Rerender: redireciona para serviços após finalizar pedido
      setTimeout(()=>{ location.hash = '/services'; },800);
    });
  }

  // Expor funções do módulo para uso global
  window.Cart = { addToCart, render };
})();
