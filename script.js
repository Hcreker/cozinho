// === PEDIDOS ===
const pedidos = [
  { mesa: 5, cliente: "Ricardo", tempo: 45, status: "Em preparo", produtos: [{ nome: "1x PIZZA MARGUERITA GRANDE", adicionais: ["+ CATUPIRY", "+ FINA", "+ DOBRO DO RECHEIO"] }] },
  { mesa: 2, cliente: "Ana", tempo: 20, status: "Aguardando", produtos: [{ nome: "1x PIZZA CALABRESA MÉDIA", adicionais: ["+ FINA", "+ DOBRO DO RECHEIO"] }] },
  { mesa: 1, cliente: "Ricardo", tempo: 30, status: "Aguardando", produtos: [{ nome: "1x PIZZA CORAÇÃO GRANDE", adicionais: ["+ CHEEDAR", "+ FINA", "+ DOBRO DO RECHEIO"] }, { nome: "1x PIZZA CHOCOLATE MÉDIA", adicionais: ["+ CREME DE AVELÃ", "+ FINA", "+ DOBRO DO RECHEIO"] }] },
  { mesa: 3, cliente: "Carlos", tempo: 50, status: "Finalizado", produtos: [{ nome: "1x PIZZA FRANGO GRANDE", adicionais: ["+ CATUPIRY", "+ FINA"] }] }
];

function renderPedidos(filtro = "Aguardando") {
  const container = document.getElementById("pedidos");
  container.innerHTML = "";
  const pedidosFiltrados = pedidos.filter(p => filtro === "Todos" ? true : p.status === filtro);

  if (pedidosFiltrados.length === 0) {
    container.innerHTML = `<p class="sem-pedidos">Nenhum pedido ${filtro.toLowerCase()}.</p>`;
    atualizarContagemBotoes();
    return;
  }

  pedidosFiltrados.forEach((pedido) => {
    const indexOriginal = pedidos.indexOf(pedido);
    const card = document.createElement("div");
    card.classList.add("card-pedido", pedido.status === "Aguardando" ? "aguardando" : pedido.status === "Em preparo" ? "preparo" : "finalizados");

    let botoes = "";
    if (pedido.status === "Aguardando") {
      botoes = `<div class="actions">
          <button class="btn cancelar" onclick="cancelar(${indexOriginal})">Cancelar ❌</button>
          <button class="btn preparar" onclick="preparar(${indexOriginal})">Preparar ⟶</button>
        </div>`;
    } else if (pedido.status === "Em preparo") {
      botoes = `<div class="actions">
          <button class="btn voltar" onclick="voltarEtapa(${indexOriginal})">⟵ Voltar etapa</button>
          <button class="btn finalizar" onclick="finalizar(${indexOriginal})">Finalizar ⟶</button>
        </div>`;
    } else if (pedido.status === "Finalizado") {
      botoes = `<div class="actions">
          <button class="btn voltar" onclick="voltarEtapa(${indexOriginal})">⟵ Voltar etapa</button>
          <button class="btn entregar" onclick="entregar(${indexOriginal})">Entregar ✅</button>
        </div>`;
    }

    card.innerHTML = `<div class="card-header">
        <span>🍽️ Mesa ${pedido.mesa} - ${pedido.cliente}</span>
        <span class="tempo">⏱️ ${pedido.tempo.toString().padStart(2,"0")}:00</span>
      </div>
      <div class="card-content">
        ${pedido.produtos.map(prod => `<div class="item-pedido">
            <strong>${prod.nome}</strong>
            <span class="icone">📋</span>
            <div class="itens">
              ${prod.adicionais.map(a => `<p>${a}</p>`).join("")}
            </div>
          </div>`).join("")}
      </div>
      ${botoes}`;

    container.appendChild(card);
  });

  atualizarContagemBotoes();
}

function atualizarContagemBotoes() {
  const botoesStatus = document.querySelectorAll(".status-btn");
  botoesStatus.forEach(btn => {
    const status = btn.getAttribute("data-status");
    const quantidade = status === "Todos" ? pedidos.length : pedidos.filter(p => p.status === status).length;
    btn.textContent = `${status} (${quantidade})`;
  });
}

// Funções de ação dos pedidos
function preparar(i) { pedidos[i].status = "Em preparo"; renderPedidos(document.querySelector(".status-btn.active").getAttribute("data-status")); }
function cancelar(i) { pedidos.splice(i, 1); renderPedidos(document.querySelector(".status-btn.active").getAttribute("data-status")); }
function voltarEtapa(i) { pedidos[i].status = pedidos[i].status === "Finalizado" ? "Em preparo" : "Aguardando"; renderPedidos(document.querySelector(".status-btn.active").getAttribute("data-status")); }
function finalizar(i) { pedidos[i].status = "Finalizado"; renderPedidos(document.querySelector(".status-btn.active").getAttribute("data-status")); }
function entregar(i) { pedidos.splice(i, 1); renderPedidos(document.querySelector(".status-btn.active").getAttribute("data-status")); }

// --- MENU LATERAL ---
const menuToggle = document.getElementById("menu-toggle");
const sidebar = document.querySelector(".sidebar");

// Botão X interno
let menuClose = document.createElement("button");
menuClose.id = "menu-close";
menuClose.textContent = "✕";
sidebar.prepend(menuClose);

menuToggle.addEventListener("click", () => {
  sidebar.classList.add("active");
  menuToggle.classList.add("hidden");
});

menuClose.addEventListener("click", () => {
  sidebar.classList.remove("active");
  menuToggle.classList.remove("hidden");
});

// --- MENU LATERAL ABAS ---
const menuButtons = document.querySelectorAll(".menu-btn");
menuButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    menuButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    const tab = btn.getAttribute("data-tab");

    document.querySelectorAll("main > section").forEach(sec => sec.style.display = "none");

    const abaAtiva = document.getElementById(tab);
    abaAtiva.style.display = tab === "pedidos" ? "flex" : "flex";

    const header = document.querySelector(".header-wrapper");
    header.style.display = tab === "pedidos" ? "flex" : "none";

    if(tab === "pedidos") {
      renderPedidos(document.querySelector(".status-btn.active").getAttribute("data-status"));
    }

    if(tab === "config") {
      const dbStatus = document.getElementById("db-status");
      const testDbBtn = document.getElementById("test-db");

      function verificarDB() {
        dbStatus.textContent = "Verificando...";
        dbStatus.classList.remove("online", "offline");
        setTimeout(() => {
          const conectado = Math.random() > 0.3;
          if(conectado){
            dbStatus.textContent = "Online";
            dbStatus.classList.add("online");
          } else {
            dbStatus.textContent = "Offline";
            dbStatus.classList.add("offline");
          }
        }, 1000);
      }

      testDbBtn.replaceWith(testDbBtn.cloneNode(true));
      document.getElementById("test-db").addEventListener("click", verificarDB);
      verificarDB();
    }
  });
});

// --- FILTROS STATUS ---
const botoesStatus = document.querySelectorAll(".status-btn");
botoesStatus.forEach(btn => {
  btn.addEventListener("click", () => {
    botoesStatus.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    const status = btn.getAttribute("data-status");
    renderPedidos(status);
  });
});

// Render inicial
renderPedidos("Aguardando");
