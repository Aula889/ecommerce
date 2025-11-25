/* js/docreader.js — preview de PDF/Imagem + OCR (PDF.js + Tesseract via CDN) */

(function(){
  const PDFJS_URL = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.min.js';
  const TESSERACT_URL = 'https://cdn.jsdelivr.net/npm/tesseract.js@4.0.2/dist/tesseract.min.js';

  // Flags para evitar recarregar scripts repetidamente
  let pdfjsLoaded = false;       // indica se PDF.js já foi inserido no documento
  let tesseractLoaded = false;   // indica se Tesseract.js já foi carregado
  let currentCanvas = null;      // canvas atual contendo renderização da página/imagem

  // loadScript(src) — injeta script dinamicamente, retorna Promise
  function loadScript(src){
    return new Promise((res,rej)=>{
      if(document.querySelector(`script[src="${src}"]`)) return res();
      const s = document.createElement('script'); s.src=src; s.onload=res; s.onerror=rej; document.head.appendChild(s);
    });
  }

  // ensurePdf() / ensureTess() — garantem que as libs sejam carregadas uma vez
  async function ensurePdf(){ if(!pdfjsLoaded){ await loadScript(PDFJS_URL); pdfjsLoaded=true; } }
  async function ensureTess(){ if(!tesseractLoaded){ await loadScript(TESSERACT_URL); tesseractLoaded=true; } }

  // createModal() — cria modal com input, preview e botão de OCR
  function createModal(){
    const modal = document.createElement('div'); modal.className='modal';
    modal.innerHTML = `
      <div class="modal-body">
        <h3>Leitura de Documentos</h3>
        <p class="muted">Arraste ou selecione um PDF. Preview será renderizado abaixo.</p>
        <input type="file" accept="application/pdf,image/*" id="docFile">
        <div id="preview" style="margin-top:.6rem"></div>
        <div style="margin-top:.6rem"><button id="extractText" class="btn btn-ghost">Extrair texto (OCR)</button> <button id="closeDoc" class="btn">Fechar</button></div>
        <div style="margin-top:.6rem"><textarea id="ocrResult" class="form-control" rows="6" placeholder="Resultado da extração"></textarea></div>
      </div>
    `;
    document.body.appendChild(modal);

    // Fecha o modal quando o botão 'Fechar' é clicado
    modal.querySelector('#closeDoc').addEventListener('click', ()=> modal.remove());
    // on file change: PDF -> render com PDF.js; imagem -> desenha em canvas
    modal.querySelector('#docFile').addEventListener('change', async (e)=>{
      const f = e.target.files[0]; if(!f) return;
      if(f.type==='application/pdf'){
        await ensurePdf();
        // pdfjs global PDFJS
        // 1) abre PDF e renderiza primeira página em canvas
        const array = await f.arrayBuffer();
        const pdf = await window.pdfjsLib.getDocument({data:array}).promise;
        // 2) define viewport (escala)
        const page = await pdf.getPage(1);
        const viewport = page.getViewport({ scale: 1.5 });
        // 3) cria canvas e renderiza
        const canvas = document.createElement('canvas'); currentCanvas = canvas;
        canvas.width = viewport.width; canvas.height = viewport.height;
        const ctx = canvas.getContext('2d');
        await page.render({ canvasContext: ctx, viewport }).promise;
        // 4) mostra o canvas no preview
        const prev = modal.querySelector('#preview'); prev.innerHTML = ''; prev.appendChild(canvas);
      } else {
        // image
        // imagem: desenha em canvas e mostra no preview
        const img = document.createElement('img'); img.src = URL.createObjectURL(f);
        img.onload = ()=>{
          const canvas = document.createElement('canvas');
          canvas.width = img.naturalWidth; canvas.height = img.naturalHeight;
          const ctx = canvas.getContext('2d'); ctx.drawImage(img,0,0);
          currentCanvas = canvas;
          modal.querySelector('#preview').innerHTML = '';
          modal.querySelector('#preview').appendChild(canvas);
        }
      }
    });

    // on click 'Extrair texto' -> cria worker Tesseract, faz OCR do canvas e mostra resultado
    modal.querySelector('#extractText').addEventListener('click', async ()=>{
      if(!currentCanvas) return alert('Nenhuma página carregada.');
      await ensureTess();
      const { createWorker } = window.Tesseract;
      const worker = createWorker({ logger: m=> console.log(m) });
      document.getElementById('ocrResult').value = 'Extraindo...';
      // carrega worker e inicializa linguagens por padrão (por+eng)
      await worker.load(); await worker.loadLanguage('por+eng'); await worker.initialize('por+eng');
      const dataURL = currentCanvas.toDataURL();
      const { data: { text } } = await worker.recognize(dataURL);
      document.getElementById('ocrResult').value = text;
      // termina worker
      await worker.terminate();
    });
  }

  window.DocReader = { open: createModal };
})();
