import { getApp, getApps } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-firestore.js";

// Usa o app já inicializado no seu index/chat
const app = getApps().length ? getApp() : null;

if (!app) {
  console.error("Firebase App não inicializado! Certifique-se de inicializar no seu arquivo principal.");
}

const db = getFirestore(app);

// Adiciona FontAwesome (ícone user)
const faLink = document.createElement("link");
faLink.rel = "stylesheet";
faLink.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css";
document.head.appendChild(faLink);

// Cria o botão no canto superior esquerdo
const btn = document.createElement("button");
btn.innerHTML = `<i class="fa-solid fa-user"></i>`;
btn.title = "Mostrar usuários do chat";

btn.style.position = "fixed";
btn.style.top = "12px";
btn.style.left = "12px";
btn.style.zIndex = "9999";
btn.style.padding = "8px 14px";
btn.style.borderRadius = "6px";
btn.style.border = "none";
btn.style.backgroundColor = "#282c34";
btn.style.color = "#61dafb";
btn.style.cursor = "pointer";
btn.style.fontSize = "20px";
btn.style.boxShadow = "0 2px 6px rgba(0,0,0,0.2)";
btn.style.transition = "background-color 0.3s ease";
btn.onmouseenter = () => btn.style.backgroundColor = "#20232a";
btn.onmouseleave = () => btn.style.backgroundColor = "#282c34";

document.body.appendChild(btn);

// Cria o painel lateral
const painel = document.createElement("div");
painel.style.position = "fixed";
painel.style.top = "0";
painel.style.left = "-320px";
painel.style.width = "320px";
painel.style.height = "100vh";
painel.style.backgroundColor = "#20232a";
painel.style.color = "#61dafb";
painel.style.padding = "20px";
painel.style.boxShadow = "2px 0 8px rgba(0,0,0,0.4)";
painel.style.transition = "left 0.3s ease";
painel.style.overflowY = "auto";
painel.style.zIndex = "9998";
painel.style.fontFamily = "Segoe UI, Tahoma, Geneva, Verdana, sans-serif";

document.body.appendChild(painel);

// Header do painel
const header = document.createElement("div");
header.style.display = "flex";
header.style.justifyContent = "space-between";
header.style.alignItems = "center";
header.style.marginBottom = "16px";

const title = document.createElement("h2");
title.textContent = "Usuários que falaram";
title.style.margin = "0";
title.style.fontSize = "1.4rem";

const fecharBtn = document.createElement("button");
fecharBtn.textContent = "×";
fecharBtn.title = "Fechar painel";
fecharBtn.style.fontSize = "24px";
fecharBtn.style.background = "none";
fecharBtn.style.border = "none";
fecharBtn.style.color = "#61dafb";
fecharBtn.style.cursor = "pointer";
fecharBtn.style.lineHeight = "1";
fecharBtn.style.padding = "0";

fecharBtn.onclick = () => {
  painel.style.left = "-320px";
};

header.appendChild(title);
header.appendChild(fecharBtn);
painel.appendChild(header);

// Lista de usuários
const listaUsuarios = document.createElement("ul");
listaUsuarios.style.listStyle = "none";
listaUsuarios.style.padding = "0";
listaUsuarios.style.margin = "0";
painel.appendChild(listaUsuarios);

async function carregarUsuarios(roomID) {
  listaUsuarios.innerHTML = "Carregando usuários...";

  try {
    const usersCol = collection(db, "rooms", roomID, "users");
    const usersSnapshot = await getDocs(usersCol);

    listaUsuarios.innerHTML = "";

    if (usersSnapshot.empty) {
      listaUsuarios.textContent = "Nenhum usuário encontrado.";
      return;
    }

    usersSnapshot.forEach(userDoc => {
      const user = userDoc.data();
      const li = document.createElement("li");
      li.style.padding = "6px 0";
      li.style.borderBottom = "1px solid #282c34";
      li.style.display = "flex";
      li.style.alignItems = "center";
      li.style.gap = "8px";

      li.innerHTML = `<i class="fa-solid fa-user"></i> ${user.name || userDoc.id}`;
      listaUsuarios.appendChild(li);
    });
  } catch (error) {
    listaUsuarios.textContent = "Erro ao carregar usuários.";
    console.error(error);
  }
}

btn.onclick = () => {
  if (painel.style.left === "0px") {
    painel.style.left = "-320px";
  } else {
    painel.style.left = "0px";

    // Pega o IP/sala atual do sessionStorage (igual chat.html)
    const roomID = sessionStorage.getItem("ip");
    if (!roomID) {
      listaUsuarios.innerHTML = "IP da sala não encontrado na sessão.";
      return;
    }

    carregarUsuarios(roomID);
  }
};
