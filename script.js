// ====================== LISTA DE PEDIDOS (REVISADA COM OBSERVAÇÃO) ======================
const pedidos = [
  { mesa: 1, cliente: "Ricardo", tempoSegundos: 0, tempoEstimado: 35, status: "Aguardando", prioridade: "Normal", produtos: [
    { nome: "PIZZA CORAÇÃO GRANDE", observacao: "Massa bem fina e sem azeitonas", pronto: false, bebida: false },
    { nome: "REFRIGERANTE 2L", observacao: "", pronto: false, bebida: true }
  ]},
  { mesa: 2, cliente: "Ana", tempoSegundos: 0, tempoEstimado: 25, status: "Aguardando", prioridade: "Normal", produtos: [
    { nome: "PIZZA CALABRESA MÉDIA", observacao: "Sem pimenta e bem tostada", pronto: false, bebida: false },
    { nome: "BATATA FRITA", observacao: "Porção bem grande de molho especial", pronto: false, bebida: false },
    { nome: "SUCO NATURAL", observacao: "Com pouco gelo e adoçante", pronto: false, bebida: true }
  ]},
  { mesa: 3, cliente: "Carlos", tempoSegundos: 0, tempoEstimado: 25, status: "Finalizado", prioridade: "Normal", produtos: [
    { nome: "PIZZA FRANGO GRANDE", observacao: "Extra catupiry, por favor!", pronto: false, bebida: false }
  ]},
  { mesa: 4, cliente: "Julia", tempoSegundos: 0, tempoEstimado: 15, status: "Em preparo", prioridade: "Normal", produtos: [
    { nome: "HAMBÚRGUER DUPLO", observacao: "Pão tostado, sem tomate", pronto: false, bebida: false },
    { nome: "COCA-COLA LATA", observacao: "", pronto: false, bebida: true }
  ]},
  { mesa: 5, cliente: "Ricardo", tempoSegundos: 0, tempoEstimado: 40, status: "Em preparo", prioridade: "Normal", produtos: [
    { nome: "PIZZA MARGUERITA GRANDE", observacao: "Queijo mussarela de búfala", pronto: false, bebida: false },
    { nome: "ÁGUA MINERAL", observacao: "", pronto: false, bebida: true }
  ]},
  { mesa: 6, cliente: "Fernanda", tempoSegundos: 0, tempoEstimado: 10, status: "Aguardando", prioridade: "Normal", produtos: [
    { nome: "SALADA CEASAR", observacao: "Molho à parte", pronto: false, bebida: false },
    { nome: "SUCO DE LARANJA", observacao: "", pronto: false, bebida: true }
  ]},
  { mesa: 7, cliente: "João", tempoSegundos: 0, tempoEstimado: 12, status: "Em preparo", prioridade: "Normal", produtos: [
    { nome: "LASANHA BOLONHESA", observacao: "Aquecer bem, bem quente", pronto: false, bebida: false },
    { nome: "PÃO DE ALHO", observacao: "", pronto: false, bebida: false },
    { nome: "REFRIGERANTE LATA", observacao: "Com gelo e limão", pronto: false, bebida: true }
  ]},
  { mesa: 8, cliente: "Mariana", tempoSegundos: 0, tempoEstimado: 10, status: "Aguardando", prioridade: "Normal", produtos: [
    { nome: "PIZZA PORTUGUESA MÉDIA", observacao: "Sem cebola", pronto: false, bebida: false },
    { nome: "REFRIGERANTE 600ml", observacao: "Bem gelado!", pronto: false, bebida: true }
  ]},
  { mesa: 9, cliente: "Paulo", tempoSegundos: 0, tempoEstimado: 20, status: "Finalizado", prioridade: "Normal", produtos: [
    { nome: "ESPAGUETE CARBONARA", observacao: "Com ovo caipira", pronto: false, bebida: false },
    { nome: "SALADA MIX", observacao: "Mais azeite na salada", pronto: false, bebida: false }
  ]},
  { mesa: 10, cliente: "Clara", tempoSegundos: 0, tempoEstimado: 20, status: "Aguardando", prioridade: "Normal", produtos: [
    { nome: "PIZZA CALABRESA GRANDE", observacao: "Borda recheada de cheddar", pronto: false, bebida: false },
    { nome: "BATATA FRITA", observacao: "Sem sal", pronto: false, bebida: false }
  ]},
];

// ====================== ESTADO DE FILTROS GLOBAIS ======================
let mesaFiltro = null;
let prioridadeFiltro = null;

// ====================== DADOS DE CONEXÃO DO BANCO (NOVOS) ======================
let ultimaAtualizacaoDB = "N/A";
let ultimoErroDB = "Nenhum erro conhecido.";

// ====================== CONSTANTES DE URGÊNCIA ======================
const AGUARDANDO_URG_SECONDS = 60 * 5; // 5 minutos
const PREPARO_URG_SECONDS = 60 * 20; // 20 minutos

// ====================== FUNÇÃO MODAL CUSTOMIZADO (AJUSTADA) ======================
function showCustomModal(title, message, showConfirm, callback) {
  const modal = document.getElementById("modal-confirmacao");
  if (!modal) return;

  const titleEl = modal.querySelector(".modal-title"); // Adicione um H2 no HTML se não tiver
  const messageEl = modal.querySelector(".modal-text");
  const confirmarBtn = modal.querySelector("#confirmar-cancelar");
  const fecharBtn = modal.querySelector("#fechar-modal");
  
  // Se o título não existir, o JS adiciona (embora o HTML original não tivesse)
  if (messageEl) messageEl.textContent = message;

  // Mostra ou esconde o botão de confirmação
  if (confirmarBtn) {
    if (showConfirm) {
      confirmarBtn.style.display = "inline-block";
    } else {
      confirmarBtn.style.display = "none";
      // Se não há confirmação, centraliza o botão de fechar/voltar
      if(fecharBtn) fecharBtn.textContent = "Entendido";
    }
  }

  modal.style.display = "flex";
  
  // Define o texto do botão de fechar como 'Não, voltar' se houver confirmação
  if(fecharBtn && showConfirm) fecharBtn.textContent = "Não, voltar";

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

  // Garante que os listeners sejam adicionados apenas se existirem
  if (confirmarBtn && showConfirm) confirmarBtn.addEventListener("click", onConfirm);
  if (fecharBtn) fecharBtn.addEventListener("click", onCancel);
}

// ====================== FUNÇÕES DE PEDIDO ======================
function togglePronto(indexPedido, indexProduto) {
  const pedido = pedidos[indexPedido];
  if (!pedido) return;
  // Só permite marcar/desmarcar se o pedido não estiver FINALIZADO
  if (pedido.status === "Finalizado") return; 
  
  // Impede a marcação se o status for Aguardando
  if (pedido.status === "Aguardando") {
      showCustomModal("Atenção", "O pedido deve estar 'Em preparo' para marcar os itens.", false, () => {});
      return;
  }
  
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
    // Prioriza Urgente dentro de Aguardando/Preparo, depois a ordem padrão
    pedidosFiltrados.sort((a, b) => {
        const ordemStatus = { "Aguardando": 0, "Em preparo": 1, "Finalizado": 2 };
        
        // 1. Prioridade por Status
        const diffStatus = (ordemStatus[a.status] || 99) - (ordemStatus[b.status] || 99);
        if (diffStatus !== 0) return diffStatus;

        // 2. Prioridade por Urgência (dentro do mesmo status)
        if (a.prioridade === "Urgente" && b.prioridade === "Normal") return -1;
        if (a.prioridade === "Normal" && b.prioridade === "Urgente") return 1;

        return 0;
    });
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
      
      // Exibe a observação se ela existir
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
  pedidos[i].tempoSegundos = 0; // Zera o tempo ao iniciar o preparo

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
  
  // Zera a marcação de itens prontos ao voltar de etapa
  pedidos[i].produtos.forEach(p => p.pronto = false);

  pedidos[i].status =
    pedidos[i].status === "Finalizado" ? "Em preparo" : "Aguardando";
    
  // Zera o tempo se retornar para Aguardando ou Preparo
  pedidos[i].tempoSegundos = 0;

  renderPedidos();
}

// ====================== FUNÇÃO FINALIZAR (COM NOVA REGRA) ======================
function finalizar(i) {
  if (!pedidos[i]) return;
  const pedido = pedidos[i];

  // Regra de Negócio: O pedido só é finalizado se todos os produtos estiverem prontos
  const todosItensProntos = pedido.produtos.every(prod => prod.pronto);

  if (todosItensProntos) {
    // AÇÃO DE SUCESSO
    pedido.status = "Finalizado";
    pedido.prioridade = "Normal";
    renderPedidos();
  } else {
    // AÇÃO DE ERRO
    showCustomModal("Atenção", "Para finalizar, todos os itens do pedido devem ser marcados como prontos.", false, (confirmed) => {});
  }
}
// =================================================================================

function entregar(i) {
  if (!pedidos[i]) return;
  pedidos.splice(i, 1);
  renderPedidos();
}

// ====================== TIMER ======================
setInterval(() => {
  pedidos.forEach((p, index) => {

    if (p.status !== "Finalizado") p.tempoSegundos++;

    // Lógica de Urgência
    let novaPrioridade = "Normal";

    if (p.status === "Aguardando" && p.tempoSegundos >= AGUARDANDO_URG_SECONDS) {
        novaPrioridade = "Urgente";
    } else if (p.status === "Em preparo" && p.tempoSegundos >= PREPARO_URG_SECONDS) {
        novaPrioridade = "Urgente";
    }

    if (novaPrioridade !== p.prioridade) {
        p.prioridade = novaPrioridade;
        // Chama renderPedidos() apenas quando a prioridade mudar para reordenar/atualizar
        renderPedidos();
    }

    // Atualiza o tempo no DOM (evita re-renderizar a lista inteira a cada segundo)
    const card = document.querySelector(`.card-pedido[data-index='${index}']`);
    if (card) {
      const tempoSpan = card.querySelector(".tempo");
      if (tempoSpan) {
        const minutos = Math.floor(p.tempoSegundos / 60).toString().padStart(2, "0");
        const segundos = (p.tempoSegundos % 60).toString().padStart(2, "0");
        tempoSpan.textContent = `${minutos}:${segundos}`;
      }
      
      // Atualiza a classe urgente no card se ela foi mudada
      if (p.prioridade === "Urgente" && !card.classList.contains("urgente")) {
          card.classList.add("urgente");
      } else if (p.prioridade === "Normal" && card.classList.contains("urgente")) {
           card.classList.remove("urgente");
      }
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

    // Gera botões para 10 mesas
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

      // Fechar dropdown e renderizar
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

      // Fechar dropdown e renderizar
      dpP.style.display = "none";
      dpBtn.classList.remove("active-dropdown");

      renderPedidos();
    });
  }

  // Lógica de Abertura/Fechamento de Dropdown
  document.querySelectorAll(".dropdown-wrapper").forEach(wrapper => {
    const btn = wrapper.querySelector(".dropdown-btn");
    const content = wrapper.querySelector(".dropdown-content");
    if (!btn || !content) return;

    btn.addEventListener("click", (e) => {
      e.stopPropagation();

      // Fecha outros dropdowns
      document.querySelectorAll(".dropdown-content").forEach(c => {
        if (c !== content) c.style.display = "none";
      });
      document.querySelectorAll(".dropdown-btn").forEach(b => b.classList.remove("active-dropdown"));

      const aberto = content.style.display === "flex";

      if (!aberto) {
        content.style.display = "flex";
        btn.classList.add("active-dropdown");
      } else {
        content.style.display = "none";
      }
    });
  });

  // Fecha dropdowns ao clicar fora
  document.addEventListener("click", () => {
    document.querySelectorAll(".dropdown-content").forEach(c => c.style.display = "none");
    document.querySelectorAll(".dropdown-btn").forEach(b => b.classList.remove("active-dropdown"));
  });
});

// ====================== SCROLL (Para aparecer barra de rolagem se houver muitos itens) ======================
function atualizarScrollCards() {
  const cards = document.querySelectorAll('.card-content');

  cards.forEach(card => {
    card.style.overflowY = 'hidden';
    
    // Simplifica a lógica de scroll
    const precisaScroll = card.scrollHeight > card.clientHeight + 1;
    
    card.style.overflowY = precisaScroll ? 'auto' : 'hidden';
  });
}

window.addEventListener('resize', atualizarScrollCards);

// Usa MutationObserver para detectar quando um card é adicionado ou atualizado
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

// ====================== ADIÇÕES: TELA CONFIGURAÇÕES E NAVEGAÇÃO ======================

const btnMenuPedidos = document.querySelector(".menu-btn.pedidos");
const btnMenuConfig = document.querySelector(".menu-btn.config");
const configSection = document.getElementById("configuracoes");
const contentWrapper = document.querySelector(".content");
const headerWrapper = document.querySelector(".header-wrapper");

// Função para atualizar o DOM com os dados de conexão
function updateConfigDisplay(status) {
    const statusEl = document.getElementById("status-banco");
    const updateEl = document.getElementById("last-update");
    const errorEl = document.getElementById("last-error");

    if (statusEl) {
        statusEl.classList.remove("online", "offline", "testando");
        statusEl.textContent = status;

        if (status === "Online") statusEl.classList.add("online");
        if (status === "Offline") statusEl.classList.add("offline");
        if (status === "Testando...") statusEl.classList.add("testando");
    }

    if (updateEl) updateEl.textContent = ultimaAtualizacaoDB;
    if (errorEl) errorEl.textContent = ultimoErroDB;
}

// FUNÇÃO setupConfigSection() REVISADA PARA MELHOR ESTRUTURA
function setupConfigSection() {
    if (!configSection) return;
    if (configSection.dataset.inited) {
        // Se já inicializado, apenas atualiza os dados
        updateConfigDisplay(document.getElementById("status-banco")?.textContent || "Desconhecido");
        return;
    }

    configSection.innerHTML = '';

    const title = document.createElement("h2");
    title.textContent = "Configurações do Sistema";
    title.className = "config-title";
    configSection.appendChild(title);

    const cardsWrapper = document.createElement("div");
    cardsWrapper.className = "config-cards-wrapper";
    configSection.appendChild(cardsWrapper);

    const statusCard = document.createElement("div");
    statusCard.className = "config-card";

    const subTitle = document.createElement("h2");
    subTitle.textContent = "Status de Conexão com o Banco de Dados";
    statusCard.appendChild(subTitle);

    const statusWrapper = document.createElement("div");
    statusWrapper.className = "config-status-wrapper";

    // Informação do Status e indicadores
    const label = document.createElement("p");
    label.innerHTML = 'Status da conexão: <strong id="status-banco" class="status-indicator">Desconhecido</strong>';

    // Detalhes da Conexão usando UL/LI (MAIS ESTRUTURADO)
    const details = document.createElement("ul");
    details.className = "details-list"; // Classe CSS para a lista
    details.innerHTML = `
        <li>Host: <strong>localhost</strong></li>
        <li>Porta: <strong>3306</strong></li>
        <li>Banco: <strong>chefmaster_db</strong></li>
    `;
    
    // CAMPO: Última Atualização
    const updateInfo = document.createElement("p");
    updateInfo.innerHTML = 'Última Atualização: <strong id="last-update">N/A</strong>';

    // CAMPO: Último Erro
    const errorInfo = document.createElement("p");
    errorInfo.innerHTML = 'Último Erro: <strong id="last-error">Nenhum erro conhecido.</strong>';


    const btnTest = document.createElement("button");
    btnTest.textContent = "Testar Conexão";
    btnTest.className = "btn testar";

    statusWrapper.appendChild(label);
    statusWrapper.appendChild(details); // Adiciona a lista (ul)
    statusWrapper.appendChild(updateInfo); 
    statusWrapper.appendChild(errorInfo); 
    statusWrapper.appendChild(btnTest);

    statusCard.appendChild(statusWrapper);
    cardsWrapper.appendChild(statusCard);

    // Comportamento do botão testar (simulação)
    btnTest.addEventListener("click", () => {
        
        ultimaAtualizacaoDB = "Testando..."; // Atualiza a variável global
        updateConfigDisplay("Testando...");

        setTimeout(() => {
            const conectado = Math.random() > 0.25; 
            const agora = new Date().toLocaleString();

            ultimaAtualizacaoDB = agora;

            if (conectado) {
                ultimoErroDB = "Nenhum.";
                updateConfigDisplay("Online");
            } else {
                ultimoErroDB = `[${agora}] Timeout de conexão. Servidor não respondeu.`;
                updateConfigDisplay("Offline");
            }
        }, 700);
    });

    // Atualiza os dados iniciais após a criação dos elementos (N/A)
    updateConfigDisplay("Desconhecido"); 
    
    configSection.dataset.inited = "1";
}


if (btnMenuPedidos) {
  btnMenuPedidos.addEventListener("click", () => {
    if (contentWrapper) contentWrapper.style.display = "block";
    if (configSection) configSection.style.display = "none";
    if (headerWrapper) headerWrapper.style.display = "flex"; 
    toggleMenu(false);
    renderPedidos();
  });
}

if (btnMenuConfig) {
  btnMenuConfig.addEventListener("click", () => {
    if (contentWrapper) contentWrapper.style.display = "none";
    if (configSection) configSection.style.display = "flex"; 
    if (headerWrapper) headerWrapper.style.display = "none";
    setupConfigSection();
    toggleMenu(false);
  });
}

// Garante estado inicial correto (após DOMContentLoaded)
document.addEventListener('DOMContentLoaded', () => {
    if (configSection) configSection.style.display = "none";
    if (contentWrapper) contentWrapper.style.display = "block";
    if (headerWrapper) headerWrapper.style.display = "flex";
});

// ====================== BOTÃO SAIR (LOGIN INEXISTENTE) ======================
const btnSair = document.querySelector(".menu-btn.sair");
if (btnSair) {
  btnSair.addEventListener("click", () => {
    toggleMenu(false);
    showCustomModal("Sair", "Encerrando sessão...", false, () => {
        // Simula o redirecionamento para a tela de login
        console.log("Sessão encerrada. Redirecionando para /login");
        // window.location.href = "/login"; 
    });
  });
}

// ====================== RENDER INICIAL ======================
// Chama a função renderPedidos para carregar a interface
renderPedidos();