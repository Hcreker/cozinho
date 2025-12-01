// ====================== LISTA DE PEDIDOS (REVISADA COM OBSERVAÇÃO) ======================
const pedidos = [
  { mesa: 1, cliente: "Ricardo", tempoSegundos: 0, tempoEstimado: 35, status: "Aguardando", produtos: [
    { nome: "PIZZA CORAÇÃO GRANDE", observacao: "Massa bem fina e sem azeitonas" },
    { nome: "REFRIGERANTE 2L", observacao: "", bebida: true }
  ]},
  { mesa: 2, cliente: "Ana", tempoSegundos: 0, tempoEstimado: 25, status: "Aguardando", produtos: [
    { nome: "PIZZA CALABRESA MÉDIA", observacao: "Sem pimenta e bem tostada" },
    { nome: "BATATA FRITA", observacao: "Porção bem grande de molho especial" },
    { nome: "SUCO NATURAL", observacao: "Com pouco gelo e adoçante", bebida: true }
  ]},
  { mesa: 3, cliente: "Carlos", tempoSegundos: 0, tempoEstimado: 25, status: "Finalizado", produtos: [
    { nome: "PIZZA FRANGO GRANDE", observacao: "Extra catupiry, por favor!" }
  ]},
  { mesa: 4, cliente: "Julia", tempoSegundos: 0, tempoEstimado: 15, status: "Em preparo", produtos: [
    { nome: "HAMBÚRGUER DUPLO", observacao: "Pão tostado, sem tomate" },
    { nome: "COCA-COLA LATA", observacao: "", bebida: true }
  ]},
  { mesa: 5, cliente: "Ricardo", tempoSegundos: 0, tempoEstimado: 40, status: "Em preparo", produtos: [
    { nome: "PIZZA MARGUERITA GRANDE", observacao: "Queijo mussarela de búfala" },
    { nome: "ÁGUA MINERAL", observacao: "", bebida: true }
  ]},
  { mesa: 6, cliente: "Fernanda", tempoSegundos: 0, tempoEstimado: 10, status: "Aguardando", produtos: [
    { nome: "SALADA CEASAR", observacao: "Molho à parte" },
    { nome: "SUCO DE LARANJA", observacao: "", bebida: true }
  ]},
  { mesa: 7, cliente: "João", tempoSegundos: 0, tempoEstimado: 12, status: "Em preparo", produtos: [
    { nome: "LASANHA BOLONHESA", observacao: "Aquecer bem, bem quente" },
    { nome: "PÃO DE ALHO", observacao: "" },
    { nome: "REFRIGERANTE LATA", observacao: "Com gelo e limão", bebida: true }
  ]},
  { mesa: 8, cliente: "Mariana", tempoSegundos: 0, tempoEstimado: 10, status: "Aguardando", produtos: [
    { nome: "PIZZA PORTUGUESA MÉDIA", observacao: "Sem cebola" },
    { nome: "REFRIGERANTE 600ml", observacao: "Bem gelado!", bebida: true }
  ]},
  { mesa: 9, cliente: "Paulo", tempoSegundos: 0, tempoEstimado: 20, status: "Finalizado", produtos: [
    { nome: "ESPAGUETE CARBONARA", observacao: "Com ovo caipira" },
    { nome: "SALADA MIX", observacao: "Mais azeite na salada" }
  ]},
  { mesa: 10, cliente: "Clara", tempoSegundos: 0, tempoEstimado: 20, status: "Aguardando", produtos: [
    { nome: "PIZZA CALABRESA GRANDE", observacao: "Borda recheada de cheddar" },
    { nome: "BATATA FRITA", observacao: "Sem sal" }
  ]},
];

// ====================== ESTADO DE FILTROS GLOBAIS ======================
let mesaFiltro = null;
let prioridadeFiltro = null;
pedidos.forEach(p => p.prioridade = "Normal");

// ====================== CONSTANTES DE URGÊNCIA ======================
const AGUARDANDO_URG_SECONDS = 60;
const PREPARO_URG_SECONDS = 1200; // 20 minutos

// ====================== FUNÇÃO MODAL CUSTOMIZADO ======================
function showCustomModal(title, message, showConfirm, callback) {
  const modal = document.getElementById("modal-confirmacao");
  if (!modal) return;

  modal.querySelector(".modal-text").textContent = message;
  modal.style.display = "flex";

  const confirmarBtn = modal.querySelector("#confirmar-cancelar");
  const fecharBtn = modal.querySelector("#fechar-modal");

  function cleanup() {
    modal.style.display = "none";
    if (confirmarBtn) confirmarBtn.removeEventListener("click", onConfirm);
    if (fecharBtn) fecharBtn.removeEventListener("click", onCancel);
  }

  function onConfirm() {
    cleanup();
    callback(true);
  }

  function onCancel() {
    cleanup();
    callback(false);
  }

  if (confirmarBtn) confirmarBtn.addEventListener("click", onConfirm);
  if (fecharBtn) fecharBtn.addEventListener("click", onCancel);
}

// ====================== FUNÇÕES DE PEDIDO ======================
function togglePronto(indexPedido, indexProduto) {
  const pedido = pedidos[indexPedido];
  if (!pedido) return;
  if (pedido.status === "Aguardando") return;
  pedido.produtos[indexProduto].pronto = !pedido.produtos[indexProduto].pronto;

  const card = document.querySelector(`.card-pedido[data-index='${indexPedido}']`);
  if (!card) return;
  const item = card.querySelectorAll(".item-pedido")[indexProduto];
  if (item) item.classList.toggle("pronto");
}

function atualizarContagemBotoes() {
  const contagens = { "Aguardando": 0, "Em preparo": 0, "Finalizado": 0 };
  pedidos.forEach(p => {
    if (contagens[p.status] === undefined) contagens[p.status] = 0;
    contagens[p.status]++;
  });

  const aguardandoEl = document.querySelector(".status-btn.aguardando");
  const preparoEl = document.querySelector(".status-btn.preparo");
  const finalizadosEl = document.querySelector(".status-btn.finalizados");
  const todosEl = document.querySelector(".status-btn.todos");

  if (aguardandoEl) aguardandoEl.textContent = `Aguardando (${contagens["Aguardando"] || 0})`;
  if (preparoEl) preparoEl.textContent = `Em preparo (${contagens["Em preparo"] || 0})`;
  if (finalizadosEl) finalizadosEl.textContent = `Finalizados (${contagens["Finalizado"] || 0})`;
  if (todosEl) todosEl.textContent = `Todos (${pedidos.length})`;
}

// ====================== RENDER PEDIDOS (ATUALIZADA) ======================
function renderPedidos() {
  const container = document.getElementById("pedidos-container");
  if (!container) return;
  container.innerHTML = "";

  const statusFiltro = document.querySelector(".status-btn.active")?.dataset.status || "Todos";

  let pedidosFiltrados = pedidos.filter(p => {
    const statusOk = statusFiltro === "Todos" ? true : p.status === statusFiltro;
    const mesaOk = mesaFiltro === null ? true : p.mesa === mesaFiltro;
    const prioridadeOk = prioridadeFiltro === null ? true : p.prioridade === prioridadeFiltro;
    return statusOk && mesaOk && prioridadeOk;
  });

  if (statusFiltro === "Todos") {
    const ordem = { "Aguardando": 0, "Em preparo": 1, "Finalizado": 2 };
    pedidosFiltrados.sort((a, b) => (ordem[a.status] || 99) - (ordem[b.status] || 99));
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

    if (pedido.prioridade === "Urgente") card.classList.add("urgente");

    card.dataset.index = indexOriginal;

    const tempoMin = Math.floor(pedido.tempoSegundos / 60);
    const tempoSec = pedido.tempoSegundos % 60;

    const produtosHTML = pedido.produtos.map(prod => {
      const classe = `item-pedido ${prod.pronto ? "pronto" : ""} ${prod.bebida ? "bebida" : ""}`;
      
      // NOVO: Exibe a observação se ela existir
      const observacaoHTML = prod.observacao ? 
          `<p class="nota-cliente">${prod.observacao}</p>` : 
          '';

      return `
        <div class="${classe}" onclick="togglePronto(${indexOriginal}, ${pedido.produtos.indexOf(prod)})">
          <strong>${prod.nome}</strong>
          <div class="itens">${observacaoHTML}</div>
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

// ====================== BOTÕES ======================
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

function preparar(i) {
  if (!pedidos[i]) return;
  pedidos[i].status = "Em preparo";
  pedidos[i].prioridade = "Normal";
  pedidos[i].tempoSegundos = 0;

  const card = document.querySelector(`.card-pedido[data-index='${i}']`);
  if (card) card.classList.remove("urgente");

  renderPedidos();
}

function cancelar(i) {
  if (!pedidos[i]) return;
  showCustomModal("Confirmação", "Você tem certeza que deseja cancelar este pedido?", true, (confirmed) => {
    if (confirmed) {
      pedidos.splice(i, 1);
      renderPedidos();
    }
  });
}

function voltarEtapa(i) {
  if (!pedidos[i]) return;
  pedidos[i].status =
    pedidos[i].status === "Finalizado" ? "Em preparo" : "Aguardando";

  renderPedidos();
}

function finalizar(i) {
  if (!pedidos[i]) return;
  pedidos[i].status = "Finalizado";
  pedidos[i].prioridade = "Normal";
  renderPedidos();
}

function entregar(i) {
  if (!pedidos[i]) return;
  pedidos.splice(i, 1);
  renderPedidos();
}

// ====================== TIMER ======================
setInterval(() => {
  pedidos.forEach((p, index) => {

    if (p.status !== "Finalizado") p.tempoSegundos++;

    // AGUARDANDO
    if (p.status === "Aguardando") {
      const nova = p.tempoSegundos > AGUARDANDO_URG_SECONDS ? "Urgente" : "Normal";

      if (nova !== p.prioridade) {
        p.prioridade = nova;
        renderPedidos();
      }
    }

    // EM PREPARO
    if (p.status === "Em preparo") {
      const novaPrep = p.tempoSegundos > PREPARO_URG_SECONDS ? "Urgente" : "Normal";

      if (novaPrep !== p.prioridade) {
        p.prioridade = novaPrep;
        renderPedidos();
      }
    }

    const card = document.querySelector(`.card-pedido[data-index='${index}']`);
    if (card) {
      const tempoSpan = card.querySelector(".tempo");
      const minutos = Math.floor(p.tempoSegundos / 60).toString().padStart(2, "0");
      const segundos = (p.tempoSegundos % 60).toString().padStart(2, "0");
      tempoSpan.textContent = `${minutos}:${segundos}`;
    }
  });
}, 1000);

// ====================== MENU LATERAL ======================
const menuToggle = document.getElementById("menu-toggle");
const sidebar = document.querySelector(".sidebar");
const overlay = document.getElementById("overlay");
const menuClose = document.getElementById("menu-close");

if (menuClose) {
  menuClose.addEventListener("click", () => toggleMenu(false));
}

overlay.addEventListener("click", () => toggleMenu(false));

function toggleMenu(open) {
  if (open) {
    sidebar.classList.add("active");
    overlay.classList.add("active");
    menuToggle.classList.add("active");
  } else {
    sidebar.classList.remove("active");
    overlay.classList.remove("active");
    menuToggle.classList.remove("active");
  }
}

menuToggle.addEventListener("click", () => {
  toggleMenu(!sidebar.classList.contains("active"));
});
menuClose.addEventListener("click", () => toggleMenu(false));
overlay.addEventListener("click", () => toggleMenu(false));

// ====================== FILTROS ======================
document.querySelectorAll(".status-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".status-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    renderPedidos();
  });
});

// ====================== DROPDOWNS ======================
document.addEventListener("DOMContentLoaded", () => {

  const dropdownMesas = document.getElementById("dropdown-mesas-content");
  const btnMesas = document.getElementById("dropdown-mesas");

  if (dropdownMesas && btnMesas) {
    dropdownMesas.innerHTML = "";
    const todas = document.createElement("button");
    todas.textContent = "Todas";
    todas.dataset.mesa = "todas";
    dropdownMesas.appendChild(todas);

    for (let m = 1; m <= 10; m++) {
      const b = document.createElement("button");
      b.textContent = `Mesa ${m}`;
      b.dataset.mesa = m;
      dropdownMesas.appendChild(b);
    }

    dropdownMesas.addEventListener("click", (e) => {
      const b = e.target.closest("button");
      if (!b) return;

      if (b.dataset.mesa === "todas") {
        mesaFiltro = null;
        btnMesas.textContent = "Mesas";
      } else {
        mesaFiltro = Number(b.dataset.mesa);
        btnMesas.textContent = b.textContent;
      }

      dropdownMesas.style.display = "none";
      btnMesas.classList.remove("active-dropdown");

      renderPedidos();
    });
  }

  const dpP = document.getElementById("dropdown-prioridade-content");
  const dpBtn = document.getElementById("dropdown-prioridade");

  if (dpP && dpBtn) {
    dpP.innerHTML = "";

    const pt = document.createElement("button");
    pt.textContent = "Todos";
    pt.dataset.prioridade = "todas";
    dpP.appendChild(pt);

    ["Urgente", "Normal"].forEach(pr => {
      const b = document.createElement("button");
      b.textContent = pr;
      b.dataset.prioridade = pr;
      dpP.appendChild(b);
    });

    dpP.addEventListener("click", (e) => {
      const b = e.target.closest("button");
      if (!b) return;

      if (b.dataset.prioridade === "todas") {
        prioridadeFiltro = null;
        dpBtn.textContent = "Prioridade";
      } else {
        prioridadeFiltro = b.dataset.prioridade;
        dpBtn.textContent = b.dataset.prioridade;
      }

      dpP.style.display = "none";
      dpBtn.classList.remove("active-dropdown");

      renderPedidos();
    });
  }

  document.querySelectorAll(".dropdown-wrapper").forEach(wrapper => {
    const btn = wrapper.querySelector(".dropdown-btn");
    const content = wrapper.querySelector(".dropdown-content");
    if (!btn || !content) return;

    btn.addEventListener("click", (e) => {
      e.stopPropagation();

      document.querySelectorAll(".dropdown-content").forEach(c => {
        if (c !== content) c.style.display = "none";
      });

      const aberto = content.style.display === "flex";

      document.querySelectorAll(".dropdown-btn").forEach(b => b.classList.remove("active-dropdown"));

      if (!aberto) {
        content.style.display = "flex";
        btn.classList.add("active-dropdown");
      } else {
        content.style.display = "none";
      }
    });
  });

  document.addEventListener("click", () => {
    document.querySelectorAll(".dropdown-content").forEach(c => c.style.display = "none");
    document.querySelectorAll(".dropdown-btn").forEach(b => b.classList.remove("active-dropdown"));
  });
});

// ====================== SCROLL ======================
function atualizarScrollCards() {
  const cards = document.querySelectorAll('.card-content');

  cards.forEach(card => {
    card.style.overflowY = 'hidden';
    const itens = Array.from(card.querySelectorAll('.item-pedido'));

    if (itens.length === 0) return;

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

const pedidosContainerEl = document.getElementById('pedidos-container');
if (pedidosContainerEl) {
  scrollObserver.observe(pedidosContainerEl, {
    childList: true,
    subtree: true
  });
}

document.addEventListener('DOMContentLoaded', () => {
  setTimeout(atualizarScrollCards, 50);
});

// ====================== RENDER INICIAL ======================
renderPedidos();

// ====================== ADIÇÕES: TELA CONFIGURAÇÕES E NAVEGAÇÃO ======================

const btnMenuPedidos = document.querySelector(".menu-btn.pedidos");
const btnMenuConfig = document.querySelector(".menu-btn.config");
const configSection = document.getElementById("configuracoes");
const contentWrapper = document.querySelector(".content");

// Seleciona o wrapper do header (que contém os botões de filtro)
const headerWrapper = document.querySelector(".header-wrapper");

function setupConfigSection() {
  if (!configSection) return;
  if (configSection.dataset.inited) return; // já inicializado

  // Limpa a seção para garantir que só criamos uma vez
  configSection.innerHTML = '';

  // --- 1. Título Principal ---
  const title = document.createElement("h2");
  title.textContent = "Configurações do Sistema";
  title.className = "config-title";
  configSection.appendChild(title);

  // --- 2. NOVO: Wrapper para os Cards de Configuração (lado a lado e centralizado) ---
  const cardsWrapper = document.createElement("div");
  cardsWrapper.className = "config-cards-wrapper";
  configSection.appendChild(cardsWrapper); // Adiciona o wrapper à seção

  // --- 3. Card de Status (Adicionado ao Novo Wrapper) ---
  const statusCard = document.createElement("div");
  statusCard.className = "config-card";

  const subTitle = document.createElement("h2");
  subTitle.textContent = "Status de Conexão com o Banco de Dados";
  statusCard.appendChild(subTitle);

  // cria área de status do banco
  const statusWrapper = document.createElement("div");
  statusWrapper.className = "config-status-wrapper";

  const label = document.createElement("p");
  label.innerHTML = 'Status da conexão: <strong id="status-banco" class="status-indicator">Desconhecido</strong>';

  const details = document.createElement("div");
  details.innerHTML = `
    <p>Host: <strong>localhost</strong></p>
    <p>Porta: <strong>3306</strong></p>
    <p>Banco: <strong>chefmaster_db</strong></p>
  `;

  const btnTest = document.createElement("button");
  btnTest.textContent = "Testar Conexão";
  btnTest.className = "btn testar";
    
  statusWrapper.appendChild(label);
  statusWrapper.appendChild(details);
  statusWrapper.appendChild(btnTest);

  statusCard.appendChild(statusWrapper); 
  cardsWrapper.appendChild(statusCard); // Adiciona o card DENTRO do novo wrapper

  // comportamento do botão testar (simulação)
  btnTest.addEventListener("click", () => {
    const statusEl = document.getElementById("status-banco");
    if (!statusEl) return;
    
    // Limpa classes e aplica 'testando'
    statusEl.classList.remove("online", "offline");
    statusEl.classList.add("testando");
    
    statusEl.textContent = "Testando...";

    setTimeout(() => {
      const conectado = Math.random() > 0.25; // 75% chance online (simulação)
      
      // Remove a classe 'testando'
      statusEl.classList.remove("testando");

      if (conectado) {
        statusEl.textContent = "Online";
        statusEl.classList.add("online");
      } else {
        statusEl.textContent = "Offline";
        statusEl.classList.add("offline");
      }
    }, 700);
  });

  configSection.dataset.inited = "1";
}

if (btnMenuPedidos) {
  btnMenuPedidos.addEventListener("click", () => {
    // Mostrar pedidos
    if (contentWrapper) contentWrapper.style.display = "block";
    if (configSection) configSection.style.display = "none";
    // CORREÇÃO: Mostrar o header de filtros
    if (headerWrapper) headerWrapper.style.display = "flex"; 
    toggleMenu(false);
    renderPedidos();
  });
}

if (btnMenuConfig) {
  btnMenuConfig.addEventListener("click", () => {
    // Mostrar configurações
    if (contentWrapper) contentWrapper.style.display = "none";
    if (configSection) configSection.style.display = "flex"; // Usa flex para centralizar
    // CORREÇÃO: Ocultar o header de filtros
    if (headerWrapper) headerWrapper.style.display = "none";
    setupConfigSection();
    toggleMenu(false);
  });
}

// garante estado inicial correto (após DOMContentLoaded)
document.addEventListener('DOMContentLoaded', () => {
    if (configSection) configSection.style.display = "none";
    if (contentWrapper) contentWrapper.style.display = "block";
    // Garante que o header está visível ao iniciar na tela de Pedidos
    if (headerWrapper) headerWrapper.style.display = "flex";
});

// ====================== BOTÃO SAIR (LOGIN INEXISTENTE) ======================
const btnSair = document.querySelector(".menu-btn.sair");
if (btnSair) {
  btnSair.addEventListener("click", () => {
    toggleMenu(false);
    window.location.href = "/login"; 
  });
}