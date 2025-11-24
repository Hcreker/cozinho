// ====================== LISTA DE PEDIDOS ======================
const pedidos = [
  { mesa: 1, cliente: "Ricardo", tempoSegundos: 0, tempoEstimado: 35, status: "Aguardando", produtos: [
    { nome: "PIZZA CORAÇÃO GRANDE", adicionais: ["+ CHEDDAR", "+ FINA", "+ DOBRO DO RECHEIO"] },
    { nome: "REFRIGERANTE 2L", adicionais: [], bebida: true }
  ]},
  { mesa: 2, cliente: "Ana", tempoSegundos: 0, tempoEstimado: 25, status: "Aguardando", produtos: [
    { nome: "PIZZA CALABRESA MÉDIA", adicionais: ["+ FINA", "+ DOBRO DO RECHEIO"] },
    { nome: "BATATA FRITA", adicionais: ["+ KETCHUP"] },
    { nome: "SUCO NATURAL", adicionais: ["+ LIMÃO"], bebida: true }
  ]},
  { mesa: 3, cliente: "Carlos", tempoSegundos: 0, tempoEstimado: 25, status: "Finalizado", produtos: [
    { nome: "PIZZA FRANGO GRANDE", adicionais: ["+ CATUPIRY"] }
  ]},
  { mesa: 4, cliente: "Julia", tempoSegundos: 0, tempoEstimado: 15, status: "Em preparo", produtos: [
    { nome: "HAMBÚRGUER DUPLO", adicionais: ["+ BACON", "+ QUEIJO EXTRA"] },
    { nome: "COCA-COLA LATA", adicionais: [], bebida: true }
  ]},
  { mesa: 5, cliente: "Ricardo", tempoSegundos: 0, tempoEstimado: 40, status: "Em preparo", produtos: [
    { nome: "PIZZA MARGUERITA GRANDE", adicionais: ["+ CATUPIRY", "+ FINA", "+ DOBRO DO RECHEIO"] },
    { nome: "ÁGUA MINERAL", adicionais: [], bebida: true }
  ]},
  { mesa: 6, cliente: "Fernanda", tempoSegundos: 0, tempoEstimado: 10, status: "Aguardando", produtos: [
    { nome: "SALADA CEASAR", adicionais: ["+ FRANGO"] },
    { nome: "SUCO DE LARANJA", adicionais: [], bebida: true }
  ]},
  { mesa: 7, cliente: "João", tempoSegundos: 0, tempoEstimado: 12, status: "Em preparo", produtos: [
    { nome: "LASANHA BOLONHESA", adicionais: [] },
    { nome: "PÃO DE ALHO", adicionais: [] },
    { nome: "REFRIGERANTE LATA", adicionais: [], bebida: true }
  ]},
  { mesa: 8, cliente: "Mariana", tempoSegundos: 0, tempoEstimado: 10, status: "Aguardando", produtos: [
    { nome: "PIZZA PORTUGUESA MÉDIA", adicionais: ["+ FINA"] },
    { nome: "REFRIGERANTE 600ml", adicionais: [], bebida: true }
  ]},
  { mesa: 9, cliente: "Paulo", tempoSegundos: 0, tempoEstimado: 20, status: "Finalizado", produtos: [
    { nome: "ESPAGUETE CARBONARA", adicionais: [] },
    { nome: "SALADA MIX", adicionais: [] }
  ]},
  { mesa: 10, cliente: "Clara", tempoSegundos: 0, tempoEstimado: 20, status: "Aguardando", produtos: [
    { nome: "PIZZA CALABRESA GRANDE", adicionais: ["+ FINA", "+ EXTRA QUEIJO"] },
    { nome: "BATATA FRITA", adicionais: ["+ CHEDDAR"] }
  ]},
];

// ====================== ESTADO DE FILTROS GLOBAIS ======================
let mesaFiltro = null; // null = todos
let prioridadeFiltro = null; // null = todos (não usado para filtrar pedidos pois pedidos não têm campo prioridade por enquanto)

// ====================== FUNÇÕES ======================
function togglePronto(indexPedido, indexProduto) {
  const pedido = pedidos[indexPedido];
  if (pedido.status === "Aguardando") return;
  pedido.produtos[indexProduto].pronto = !pedido.produtos[indexProduto].pronto;
  const card = document.querySelector(`.card-pedido[data-index='${indexPedido}']`);
  if (!card) return;
  const item = card.querySelectorAll(".item-pedido")[indexProduto];
  if (item) item.classList.toggle("pronto");
}

function atualizarContagemBotoes() {
  const contagens = { "Aguardando": 0, "Em preparo": 0, "Finalizado": 0 };
  pedidos.forEach(p => contagens[p.status]++);
  const aguardandoBtn = document.querySelector(".status-btn.aguardando");
  const preparoBtn = document.querySelector(".status-btn.preparo");
  const finalizadosBtn = document.querySelector(".status-btn.finalizados");
  const todosBtn = document.querySelector(".status-btn.todos");
  if (aguardandoBtn) aguardandoBtn.textContent = `Aguardando (${contagens["Aguardando"]})`;
  if (preparoBtn) preparoBtn.textContent = `Em preparo (${contagens["Em preparo"]})`;
  if (finalizadosBtn) finalizadosBtn.textContent = `Finalizados (${contagens["Finalizado"]})`;
  if (todosBtn) todosBtn.textContent = `Todos (${pedidos.length})`;
}

// ====================== RENDER PEDIDOS ======================
function renderPedidos() {
  const container = document.getElementById("pedidos-container");
  if (!container) return;
  container.innerHTML = "";

  const statusFiltro = document.querySelector(".status-btn.active")?.dataset.status || "Todos";

  let pedidosFiltrados = pedidos.filter(p => {
    const statusOk = statusFiltro === "Todos" ? true : p.status === statusFiltro;
    const mesaOk = mesaFiltro === null ? true : p.mesa === mesaFiltro;
    return statusOk && mesaOk;
  });

  if (statusFiltro === "Todos") {
    const ordem = { "Aguardando": 0, "Em preparo": 1, "Finalizado": 2 };
    pedidosFiltrados.sort((a, b) => ordem[a.status] - ordem[b.status]);
  }

  if (pedidosFiltrados.length === 0) {
    container.innerHTML = `<div class="sem-pedidos">Nenhum pedido no momento</div>`;
    atualizarContagemBotoes();
    return;
  }

  pedidosFiltrados.forEach(pedido => {
    const indexOriginal = pedidos.indexOf(pedido);

    const card = document.createElement("div");
    card.classList.add("card-pedido",
      pedido.status === "Aguardando" ? "aguardando" :
      pedido.status === "Em preparo" ? "preparo" : "finalizados"
    );
    card.dataset.index = indexOriginal;

    const tempoMin = Math.floor(pedido.tempoSegundos / 60);
    const tempoSec = pedido.tempoSegundos % 60;

    const produtosHTML = pedido.produtos.map(prod => {
      const classe = `item-pedido ${prod.pronto ? "pronto" : ""} ${prod.bebida ? "bebida" : ""}`;
      const adicionaisHTML = prod.adicionais.map(a => `<p>${a}</p>`).join("");
      return `
        <div class="${classe}" onclick="togglePronto(${indexOriginal}, ${pedido.produtos.indexOf(prod)})">
          <strong>${prod.nome}</strong>
          <div class="itens">${adicionaisHTML}</div>
        </div>
      `;
    }).join("");

    card.innerHTML = `
      <div class="card-header">
        <span>Mesa ${pedido.mesa} - ${pedido.cliente}</span>
        <span class="tempo">${tempoMin.toString().padStart(2,"0")}:${tempoSec.toString().padStart(2,"0")}</span>
      </div>
      <div class="card-content">${produtosHTML}</div>
      ${gerarBotoes(pedido, indexOriginal)}
    `;

    container.appendChild(card);
  });

  atualizarContagemBotoes();
  setTimeout(atualizarScrollCards, 50);
}

// ====================== BOTÕES DE AÇÃO ======================
function gerarBotoes(pedido, i) {
  if (pedido.status === "Aguardando") {
    return `<div class="actions">
      <button class="btn cancelar" onclick="cancelar(${i})">Cancelar</button>
      <button class="btn preparar" onclick="preparar(${i})">Preparar</button>
    </div>`;
  } else if (pedido.status === "Em preparo") {
    return `<div class="actions">
      <button class="btn voltar" onclick="voltarEtapa(${i})">Voltar</button>
      <button class="btn finalizar" onclick="finalizar(${i})">Finalizar</button>
    </div>`;
  } else {
    return `<div class="actions">
      <button class="btn voltar" onclick="voltarEtapa(${i})">Voltar</button>
      <button class="btn entregar" onclick="entregar(${i})">Entregar</button>
    </div>`;
  }
}

function preparar(i){ pedidos[i].status="Em preparo"; renderPedidos(); }
function cancelar(i){ pedidos.splice(i,1); renderPedidos(); }
function voltarEtapa(i){ pedidos[i].status=pedidos[i].status==="Finalizado"?"Em preparo":"Aguardando"; renderPedidos(); }
function finalizar(i){ pedidos[i].status="Finalizado"; renderPedidos(); }
function entregar(i){ pedidos.splice(i,1); renderPedidos(); }

// ====================== TIMER ======================
setInterval(()=>{
  pedidos.forEach((p,index)=>{
    if(p.status!=="Finalizado") p.tempoSegundos++;

    const card=document.querySelector(`.card-pedido[data-index='${index}']`);
    if(card){
      const tempoSpan=card.querySelector(".tempo");
      const minutos=Math.floor(p.tempoSegundos/60).toString().padStart(2,"0");
      const segundos=(p.tempoSegundos%60).toString().padStart(2,"0");
      tempoSpan.textContent=`${minutos}:${segundos}`;

      if(p.tempoSegundos>(p.tempoEstimado*60)+300 && p.status!=="Finalizado")
        card.classList.add("urgente");
      else
        card.classList.remove("urgente");
    }
  });
},1000);

// ====================== MENU LATERAL ======================
const menuToggle=document.getElementById("menu-toggle");
const sidebar=document.querySelector(".sidebar");
const overlay=document.getElementById("overlay");
const menuClose=document.getElementById("menu-close");

function toggleMenu(open){
  if(open){
    sidebar.classList.add("active");
    overlay.classList.add("active");
    menuToggle.classList.add("active");
  }else{
    sidebar.classList.remove("active");
    overlay.classList.remove("active");
    menuToggle.classList.remove("active");
  }
}

menuToggle.addEventListener("click",()=> {
  const menuAberto = sidebar.classList.contains("active");
  toggleMenu(!menuAberto);
});
menuClose.addEventListener("click",()=>toggleMenu(false));
overlay.addEventListener("click",()=>toggleMenu(false));

// ====================== FILTROS DE STATUS ======================
document.querySelectorAll(".status-btn").forEach(btn=> {
  btn.addEventListener("click",()=>{
    document.querySelectorAll(".status-btn").forEach(b=>b.classList.remove("active"));
    btn.classList.add("active");
    renderPedidos();
  });
});

// ====================== DROPDOWNS (MESAS E PRIORIDADE) ======================
document.addEventListener("DOMContentLoaded",()=>{

  // ---------- MESAS (1 a 10 fixas) ----------
  const dropdownMesasContent = document.getElementById("dropdown-mesas-content");
  const dropdownMesasBtn = document.getElementById("dropdown-mesas");

  if(dropdownMesasContent && dropdownMesasBtn){

    dropdownMesasContent.innerHTML = "";

    // botão "Todas"
    const btnTodas = document.createElement("button");
    btnTodas.textContent = "Todas";
    btnTodas.dataset.mesa = "todas";
    dropdownMesasContent.appendChild(btnTodas);

    // mesas 1 a 10
    for(let m=1; m<=10; m++){
      const b = document.createElement("button");
      b.textContent = `Mesa ${m}`;
      b.dataset.mesa = m;
      dropdownMesasContent.appendChild(b);
    }

    // quando clica em uma mesa
    dropdownMesasContent.addEventListener("click",(e)=> {
      e.stopPropagation();
      const bt = e.target.closest("button");
      if(!bt) return;

      const val = bt.dataset.mesa;

      if(val === "todas"){
        mesaFiltro = null;
        dropdownMesasBtn.textContent = "Mesas";
      } else {
        mesaFiltro = Number(val);
        dropdownMesasBtn.textContent = `Mesa ${mesaFiltro}`;
      }

      // fecha dropdown e remove estado ativo
      dropdownMesasContent.style.display = "none";
      dropdownMesasBtn.classList.remove("active-dropdown");

      renderPedidos();
    });
  }

  // ---------- PRIORIDADE (Todos, Urgente, Normal) ----------
  const dropdownPrioridadeContent = document.getElementById("dropdown-prioridade-content");
  const dropdownPrioridadeBtn = document.getElementById("dropdown-prioridade");

  if(dropdownPrioridadeContent && dropdownPrioridadeBtn){
    dropdownPrioridadeContent.innerHTML = "";

    // "Todos" opcional
    const pTodas = document.createElement("button");
    pTodas.textContent = "Todos";
    pTodas.dataset.prioridade = "todas";
    dropdownPrioridadeContent.appendChild(pTodas);

    // opções padrão
    const pUrgente = document.createElement("button");
    pUrgente.textContent = "Urgente";
    pUrgente.dataset.prioridade = "Urgente";
    dropdownPrioridadeContent.appendChild(pUrgente);

    const pNormal = document.createElement("button");
    pNormal.textContent = "Normal";
    pNormal.dataset.prioridade = "Normal";
    dropdownPrioridadeContent.appendChild(pNormal);

    // clique nas prioridades
    dropdownPrioridadeContent.addEventListener("click",(e)=>{
      e.stopPropagation();
      const bt = e.target.closest("button");
      if(!bt) return;

      const val = bt.dataset.prioridade;

      if(val === "todas"){
        prioridadeFiltro = null;
        dropdownPrioridadeBtn.textContent = "Prioridade";
      } else {
        prioridadeFiltro = val;
        dropdownPrioridadeBtn.textContent = val;
      }

      // fecha dropdown e remove estado ativo
      dropdownPrioridadeContent.style.display = "none";
      dropdownPrioridadeBtn.classList.remove("active-dropdown");

      renderPedidos();
    });
  }

  // ====================== DROPDOWN BONITO (comportamento comum para ambos) ======================
  const dropdowns = document.querySelectorAll(".dropdown-wrapper");

  dropdowns.forEach(wrapper=>{
    const btn = wrapper.querySelector(".dropdown-btn");
    const content = wrapper.querySelector(".dropdown-content");
    if(!btn || !content) return;

    btn.addEventListener("click",(e)=>{
      e.stopPropagation();

      // fecha outros dropdowns
      document.querySelectorAll(".dropdown-content").forEach(c=>{
        if(c!==content) c.style.display="none";
      });

      const isOpen = content.style.display === "flex";

      document.querySelectorAll(".dropdown-btn").forEach(b=>b.classList.remove("active-dropdown"));

      if(!isOpen){
        content.style.display = "flex";
        btn.classList.add("active-dropdown");
      } else {
        content.style.display = "none";
      }
    });
  });

  // fechar dropdown quando clica fora
  document.addEventListener("click",()=>{
    document.querySelectorAll(".dropdown-content").forEach(c=>c.style.display="none");
    document.querySelectorAll(".dropdown-btn").forEach(b=>b.classList.remove("active-dropdown"));
  });
});

// ====================== SCROLL INTELIGENTE ======================
function atualizarScrollCards(){
  const cards = document.querySelectorAll('.card-content');

  cards.forEach(card => {
    card.style.overflowY = 'hidden';
    const itens = Array.from(card.querySelectorAll('.item-pedido'));

    if(itens.length === 0) return;

    const visibleTop = card.scrollTop;
    const visibleBottom = visibleTop + card.clientHeight;
    let precisaScroll = false;

    for (let it of itens) {
      const top = it.offsetTop;
      const bottom = top + it.offsetHeight;

      if (top < visibleTop - 1 || bottom > visibleBottom + 1) {
        precisaScroll = true;
        break;
      }
    }

    if (!precisaScroll && card.scrollHeight > card.clientHeight + 1)
      precisaScroll = true;

    card.style.overflowY = precisaScroll ? 'auto' : 'hidden';
  });
}

window.addEventListener('resize', atualizarScrollCards);

const scrollObserver = new MutationObserver(() => {
  requestAnimationFrame(atualizarScrollCards);
});

scrollObserver.observe(document.getElementById('pedidos-container'), {
  childList: true,
  subtree: true
});

document.addEventListener('DOMContentLoaded', () => {
  setTimeout(atualizarScrollCards, 50);
});

// ====================== RENDER INICIAL ======================
renderPedidos();
