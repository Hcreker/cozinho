const pedidos = [
  { mesa: 5, cliente: "Ricardo", tempo: 45, status: "Em preparo", produtos: [{ nome: "1x PIZZA MARGUERITA GRANDE", adicionais: ["+ CATUPIRY", "+ FINA", "+ DOBRO DO RECHEIO"] }] },
  { mesa: 2, cliente: "Ana", tempo: 20, status: "Aguardando", produtos: [{ nome: "1x PIZZA CALABRESA MÉDIA", adicionais: ["+ FINA", "+ DOBRO DO RECHEIO"] }] },
  { mesa: 1, cliente: "Ricardo", tempo: 30, status: "Aguardando", produtos: [{ nome: "1x PIZZA CORAÇÃO GRANDE", adicionais: ["+ CHEEDAR", "+ FINA", "+ DOBRO DO RECHEIO"] }, { nome: "1x PIZZA CHOCOLATE MÉDIA", adicionais: ["+ CREME DE AVELÃ", "+ FINA", "+ DOBRO DO RECHEIO"] }] },
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
    container.innerHTML = `<p>Nenhum pedido ${filtro.toLowerCase()}.</p>`;
    atualizarContagemBotoes();
    return;
  }

  pedidosFiltrados.forEach((pedido) => {
    const indexOriginal = pedidos.indexOf(pedido); // índice no array original
    const card = document.createElement("div");
    card.classList.add("card-pedido", pedido.status === "Aguardando" ? "aguardando" : pedido.status === "Em preparo" ? "preparo" : "finalizados");

    let botoes = "";
    if (pedido.status === "Aguardando") {
      botoes = `
        <div class="actions">
          <button class="btn cancelar" onclick="cancelar(${indexOriginal})">Cancelar ❌</button>
          <button class="btn preparar" onclick="preparar(${indexOriginal})">Preparar ⟶</button>
        </div>
      `;
    } else if (pedido.status === "Em preparo") {
      botoes = `
        <div class="actions">
          <button class="btn voltar" onclick="voltarEtapa(${indexOriginal})">⟵ Voltar etapa</button>
          <button class="btn finalizar" onclick="finalizar(${indexOriginal})">Finalizar ⟶</button>
        </div>
      `;
    } else if (pedido.status === "Finalizado") {
      botoes = `
        <div class="actions">
          <button class="btn voltar" onclick="voltarEtapa(${indexOriginal})">⟵ Voltar etapa</button>
          <button class="btn entregar" onclick="entregar(${indexOriginal})">Entregar ✅</button>
        </div>
      `;
    }

    card.innerHTML = `
      <div class="card-header">
        <span>🍽️ Mesa ${pedido.mesa} - ${pedido.cliente}</span>
        <span class="tempo">⏱️ ${pedido.tempo.toString().padStart(2,"0")}:00</span>
      </div>
      <div class="card-content">
        ${pedido.produtos.map(prod => `
          <div class="item-pedido">
            <strong>${prod.nome}</strong>
            <span class="icone">📋</span>
            <div class="itens">
              ${prod.adicionais.map(a => `<p>${a}</p>`).join("")}
            </div>
          </div>`).join("")}
      </div>
      ${botoes} <!-- botões sempre depois do conteúdo -->
    `;

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

function preparar(i) {
  pedidos[i].status = "Em preparo";
  renderPedidos(document.querySelector(".status-btn.active").getAttribute("data-status"));
}

function cancelar(i) {
  pedidos.splice(i, 1);
  renderPedidos(document.querySelector(".status-btn.active").getAttribute("data-status"));
}

function voltarEtapa(i) {
  if (pedidos[i].status === "Finalizado") {
    pedidos[i].status = "Em preparo"; // volta para preparo
  } else {
    pedidos[i].status = "Aguardando"; // volta para aguardando
  }
  renderPedidos(document.querySelector(".status-btn.active").getAttribute("data-status"));
}

function finalizar(i) {
  pedidos[i].status = "Finalizado";
  renderPedidos(document.querySelector(".status-btn.active").getAttribute("data-status"));
}

function entregar(i) {
  pedidos.splice(i, 1); // remove pedido entregue
  renderPedidos(document.querySelector(".status-btn.active").getAttribute("data-status"));
}

// --- TOGGLE SIDEBAR ---
const menuToggle = document.getElementById("menu-toggle");
const sidebar = document.querySelector(".sidebar");
const body = document.body;

menuToggle.addEventListener("click", () => {
  sidebar.classList.toggle("hidden");
  body.classList.toggle("menu-open");
});

// --- FILTRAGEM POR STATUS ---
const botoesStatus = document.querySelectorAll(".status-btn");
botoesStatus.forEach(btn => {
  btn.addEventListener("click", () => {
    botoesStatus.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    const status = btn.getAttribute("data-status");
    renderPedidos(status);
  });
});

// Renderiza inicialmente com pedidos "Aguardando"
renderPedidos("Aguardando");
