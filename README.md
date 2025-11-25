# Agente de IA — Front-end (HTML / CSS / JS)

Projeto front-end simples para venda/consulta de serviços de "Agente de IA" (atendimento por WhatsApp, leitura de documentos, consultoria).

Testar localmente
- Preferível servir via um servidor estático (recomendado). Fetch em `data/products.json` pode falhar com `file://`.
- Com Python instalado, execute (PowerShell):

```powershell
# no diretório do projeto
py -3 -m http.server 8000; # ou: python -m http.server 8000
```

Abra `http://localhost:8000` no navegador.

Arquivos principais
- `index.html` — SPA entry (Home, Serviços, Loja, Carrinho)
- `admin.html` — painel front-end para editar `products.json` (salva em localStorage e permite baixar JSON)
- `css/` — `variables.css`, `base.css`, `layout.css`, `components.css`
- `js/` — `app.js`, `shop.js`, `cart.js`, `whatsapp.js`, `docreader.js`, `admin.js`
- `data/products.json` — exemplo com 6 itens

Observações importantes
- Sem backend: todas as alterações são locais (localStorage). Para persistir alterações, hospede `data/products.json` em um servidor estático e aponte seu frontend para essa URL.
- WhatsApp: `js/whatsapp.js` usa `window.WhatsAppConfig.PHONE` para definir o número. Para integrar com WhatsApp Business API, envie pedidos do cliente para seu backend e faça requisições autenticadas à API. Não ponha tokens em código cliente.
- PDF/OCR: `js/docreader.js` carrega `PDF.js` e `Tesseract.js` via CDN dinamicamente. OCR acontece no navegador (privado), mas pode ser lento para grandes arquivos.
- Pagamentos: fluxo de checkout é simulado; para produção integre um provedor (Pagar.me, Stripe, etc.) via backend.

SEO e performance
- Scripts carregados com `defer`.
- Imagens usam `loading="lazy"` quando possível.
- Meta tags básicas incluídas.

Próximos passos sugeridos
- Subir `data/products.json` para um servidor estático (ex: S3, Netlify) e adaptar `shop.js` para apontar para a URL.
- Implementar backend para salvar pedidos/integração com WhatsApp Business API.
