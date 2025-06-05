import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-firestore.js";
import { getApps, getApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";

const firebaseConfig = {
    apiKey: "AIzaSyCgG8qVpsPMq_nXSAi3Ok-Ri6fBBUklXLc",
    authDomain: "chat-alpha-e-beta.firebaseapp.com",
    projectId: "chat-alpha-e-beta",
    storageBucket: "chat-alpha-e-beta.firebasestorage.app",
    messagingSenderId: "873372870268",
    appId: "1:873372870268:web:20995a415350bf9",
    measurementId: "G-RVQ446VZRD"
};

// Inicializar Firebase se necessário
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);

// Função para obter IP formatado
async function getUserIP() {
    try {
        const res = await fetch("https://api.ipify.org?format=json");
        const data = await res.json();
        return data.ip.replace(/\./g, '_'); // Formata 192.168.1.1 como 192_168_1_1
    } catch (error) {
        console.error('Erro ao obter IP:', error);
        return 'default_room';
    }
}

// Cria botão e painel
const btn = document.createElement("button");
btn.id = "configBtn";
btn.innerHTML = `<i class="fa-solid fa-users"></i>`;
btn.title = "Listar Membros";

const panel = document.createElement("div");
panel.id = "configPanel";
panel.style.display = "none";
panel.innerHTML = `<h3>Membros da Sala</h3><ul id="userList"></ul>`;

// Adiciona ao contêiner da extensão chat
const container = document.querySelector('.ext-chat') || document.body;
container.appendChild(btn);
container.appendChild(panel);

// Estilos com escopo
const style = document.createElement("style");
style.dataset.extId = 'painel-config';
style.textContent = `
    .ext-painel-config #configBtn {
        position: fixed;
        top: 16px;
        left: 16px;
        z-index: 1000;
        background: var(--primary, #3b82f6);
        color: #fff;
        border: none;
        border-radius: 50%;
        padding: 10px;
        cursor: pointer;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        transition: transform 0.2s, background 0.3s;
    }
    .ext-painel-config #configBtn:hover {
        background: var(--primary-hover, #2563eb);
        transform: scale(1.1);
    }
    .ext-painel-config #configPanel {
        position: fixed;
        top: 70px;
        left: 16px;
        background: rgba(255, 255, 255, 0.95);
        padding: 12px;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        z-index: 999;
        max-height: 300px;
        overflow-y: auto;
        animation: fadeIn 0.3s ease-out;
        backdrop-filter: blur(10px);
    }
    .ext-painel-config #configPanel h3 {
        font-size: 16px;
        margin-bottom: 8px;
        color: var(--text, #111827);
    }
    .ext-painel-config #configPanel ul {
        list-style: none;
        padding: 0;
    }
    .ext-painel-config #configPanel li {
        padding: 8px 0;
        font-size: 14px;
        color: var(--text, #111827);
        border-bottom: 1px solid #e5e7eb;
    }
    .ext-painel-config #configPanel li:last-child {
        border-bottom: none;
    }
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(-10px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;
document.head.appendChild(style);

// Adicionar classe de escopo
container.classList.add('ext-painel-config');

// Ação ao clicar no botão
btn.addEventListener("click", async () => {
    panel.style.display = panel.style.display === "none" ? "block" : "none";

    if (panel.style.display === "block") {
        const userList = document.getElementById("userList");
        userList.innerHTML = "<li>Carregando...</li>";

        try {
            if (!db) throw new Error("Firestore não inicializado");
            const ip = await getUserIP();
            const usersRef = collection(db, `rooms/${ip}/users);
            const snapshot = await getDocs(usersRef);

            if (snapshot.empty) {
                userList.innerHTML = "<li>Sem usuário encontrado.</li>";
                return;
            }

            userList.innerHTML = "";
            snapshot.forEach(doc => {
                const data = doc.data();
                const nick = data.nick || doc.id; // Usa nick ou ID como fallback
                const li = document.createElement("li");
                li.textContent = nick;
                userList.appendChild(li);
            });
        } catch (error) {
            console.error('Erro ao listar membros:', error);
            userList.innerHTML = `<li>Erro: ${error.message}</li>`;
        }
    }
});

// Fechar painel ao clicar fora
document.addEventListener('click', (e) => {
    if (!panel.contains(e.target) && !btn.contains(e.target)) {
        panel.style.display = 'none';
    }
});

// Registrar extensão
window.adicionarExtensao?.({
    id: 'painel-config',
    nome: 'Painel de Configuração',
    arquivo: '/painel-config.js'
});
