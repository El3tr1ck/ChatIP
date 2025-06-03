// Adiciona botão ao body
const configBtn = document.createElement('button');
configBtn.id = 'configBtn';
configBtn.textContent = '⚙️';
document.body.appendChild(configBtn);

// Adiciona painel ao body
const configPanel = document.createElement('div');
configPanel.id = 'configPanel';
configPanel.innerHTML = `
  <h2>Membros do Chat</h2>
  <div id="userList">Carregando...</div>
`;
document.body.appendChild(configPanel);

// Estilos via JS
const style = document.createElement('style');
style.textContent = `
  #configBtn {
    position: fixed;
    top: 15px;
    left: 15px;
    z-index: 1000;
    padding: 8px 12px;
    background: #222;
    color: #fff;
    border: none;
    border-radius: 50%;
    font-size: 18px;
    cursor: pointer;
    box-shadow: 0 2px 6px rgba(0,0,0,0.4);
    transition: background 0.3s;
  }

  #configBtn:hover {
    background: #444;
  }

  #configPanel {
    position: fixed;
    top: 0;
    left: -320px;
    width: 300px;
    height: 100%;
    background: #f7f7f7;
    color: #000;
    box-shadow: 2px 0 10px rgba(0, 0, 0, 0.3);
    padding: 20px;
    transition: left 0.3s ease;
    z-index: 999;
    overflow-y: auto;
  }

  #configPanel.show {
    left: 0;
  }

  #configPanel h2 {
    margin-top: 0;
    font-size: 18px;
  }

  .user {
    padding: 8px;
    margin-bottom: 6px;
    background: #fff;
    border-radius: 4px;
    font-size: 14px;
    box-shadow: 0 1px 2px rgba(0,0,0,0.1);
  }
`;
document.head.appendChild(style);

// Ação do botão
configBtn.addEventListener('click', () => {
  configPanel.classList.toggle('show');
});

// Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyCgG8qVpsPMq_nXSAi3Ok-Ri6fBBUklXLc",
  authDomain: "chat-alpha-e-beta.firebaseapp.com",
  databaseURL: "https://chat-alpha-e-beta-default-rtdb.firebaseio.com",
  projectId: "chat-alpha-e-beta",
  storageBucket: "chat-alpha-e-beta.firebasestorage.app",
  messagingSenderId: "873372870268",
  appId: "1:873372870268:web:209c92a30995a415350bf9",
  measurementId: "G-RVQ446VZRD"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Carrega usuários
const userList = document.getElementById('userList');
const usersRef = ref(db, 'users');

onValue(usersRef, (snapshot) => {
  const data = snapshot.val();
  userList.innerHTML = ''; // limpa a lista

  if (data) {
    Object.entries(data).forEach(([uid, user]) => {
      const div = document.createElement('div');
      div.className = 'user';
      div.textContent = user.nome || user.username || uid;
      userList.appendChild(div);
    });
  } else {
    userList.innerHTML = '<p>Nenhum usuário encontrado.</p>';
  }
});
