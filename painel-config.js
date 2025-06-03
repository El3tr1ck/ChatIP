import { getApp, getApps } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-firestore.js";

// Reaproveita o app já inicializado
const app = getApps().length ? getApp() : null;
const db = getFirestore(app);

// Cria botão e painel
const btn = document.createElement("button");
btn.id = "configBtn";
btn.innerHTML = `<i class="fa-solid fa-user"></i>`;
document.body.appendChild(btn);

const panel = document.createElement("div");
panel.id = "configPanel";
panel.style.display = "none";
panel.innerHTML = `<h3>Membros da sala</h3><ul id="userList"></ul>`;
document.body.appendChild(panel);

// Estilos
const style = document.createElement("style");
style.textContent = `
  #configBtn {
    position: fixed;
    top: 16px;
    left: 16px;
    z-index: 1000;
    background-color: #fff;
    border: none;
    border-radius: 50%;
    padding: 10px;
    cursor: pointer;
    box-shadow: 0 2px 6px rgba(0,0,0,0.3);
  }
  #configPanel {
    position: fixed;
    top: 70px;
    left: 16px;
    background: #fff;
    padding: 12px;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.2);
    z-index: 999;
    max-height: 300px;
    overflow-y: auto;
  }
  body {
    padding-top: 80px;
  }
`;
document.head.appendChild(style);

// Função para obter IP
async function getUserIP() {
  const res = await fetch("https://api.ipify.org?format=json");
  const data = await res.json();
  return data.ip;
}

// Ação ao clicar no botão
btn.addEventListener("click", async () => {
  panel.style.display = panel.style.display === "none" ? "block" : "none";

  if (panel.style.display === "block") {
    const userList = document.getElementById("userList");
    userList.innerHTML = "<li>Carregando...</li>";

    try {
      const ip = await getUserIP();
      const usersRef = collection(db, "rooms", ip, "users");
      const snapshot = await getDocs(usersRef);

      if (snapshot.empty) {
        userList.innerHTML = "<li>Nenhum usuário encontrado.</li>";
        return;
      }

      userList.innerHTML = "";
      snapshot.forEach(doc => {
        const data = doc.data();
        const nome = data.nome || doc.id;
        const li = document.createElement("li");
        li.textContent = nome;
        userList.appendChild(li);
      });
    } catch (err) {
      userList.innerHTML = `<li>Erro: ${err.message}</li>`;
    }
  }
});
