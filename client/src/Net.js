// ===== UTIL =====
function validarIP(ip) {
    const regex = /^(25[0-5]|2[0-4]\d|1\d\d|\d\d|\d)\.(25[0-5]|2[0-4]\d|1\d\d|\d\d|\d)\.(25[0-5]|2[0-4]\d|1\d\d|\d\d|\d)\.(25[0-5]|2[0-4]\d|1\d\d|\d\d|\d)$/;
    return regex.test(ip);
}

function adicionarLog(mensagem) {
    const logs = JSON.parse(localStorage.getItem("logs")) || [];
    const data = new Date().toLocaleString();
    logs.unshift(`${data} - ${mensagem}`);
    localStorage.setItem("logs", JSON.stringify(logs));
}

// ===== INICIALIZAÇÃO =====
document.addEventListener("DOMContentLoaded", () => {

    // Último login
    const agora = new Date().toLocaleString();
    document.getElementById("lastLogin").textContent = agora;

    adicionarLog("Login realizado com sucesso");

    // Carregar configurações salvas
    const config = JSON.parse(localStorage.getItem("networkConfig"));

    if (config) {
        ipAddress.value = config.ip;
        subnetMask.value = config.mask;
        gateway.value = config.gateway;
    } else {
        ipAddress.value = "192.168.1.100";
        subnetMask.value = "255.255.255.0";
        gateway.value = "192.168.1.1";
    }

});

// ===== ALTERAR SENHA =====
document.getElementById("changePassword").addEventListener("click", () => {
    const novaSenha = prompt("Digite a nova senha:");

    if (novaSenha && novaSenha.length >= 4) {
        localStorage.setItem("userPassword", novaSenha);
        adicionarLog("Senha alterada");
        alert("Senha alterada com sucesso!");
    } else {
        alert("Senha muito curta!");
    }
});

// ===== VER LOGS =====
document.getElementById("viewLogs").addEventListener("click", () => {
    const logsContainer = document.querySelector(".net-logs");
    const logsList = document.getElementById("accessLogs");

    logsContainer.style.display =
        logsContainer.style.display === "none" ? "block" : "none";

    logsList.innerHTML = "";

    const logs = JSON.parse(localStorage.getItem("logs")) || [];

    logs.forEach(log => {
        const li = document.createElement("li");
        li.textContent = log;
        logsList.appendChild(li);
    });
});

// ===== SALVAR CONFIG =====
document.getElementById("saveSettings").addEventListener("click", () => {

    const ip = ipAddress.value.trim();
    const mask = subnetMask.value.trim();
    const gw = gateway.value.trim();

    if (!validarIP(ip) || !validarIP(mask) || !validarIP(gw)) {
        alert("IP inválido!");
        return;
    }

    localStorage.setItem("networkConfig", JSON.stringify({
        ip: ip,
        mask: mask,
        gateway: gw
    }));

    adicionarLog("Configurações de rede alteradas");

    alert("Configurações salvas com sucesso!");
});

// ===== STATUS DINÂMICO =====
setInterval(() => {
    const status = document.getElementById("connectionStatus");
    const speed = document.getElementById("networkSpeed");

    const conectado = Math.random() > 0.1;

    if (conectado) {
        status.textContent = "Conectado";
        status.style.color = "#22c55e";
        speed.textContent = Math.floor(Math.random() * 200) + " Mbps";
    } else {
        status.textContent = "Desconectado";
        status.style.color = "#ef4444";
        speed.textContent = "0 Mbps";
        adicionarLog("Conexão perdida");
    }

}, 5000);

// ===== GRÁFICO TEMPO REAL =====
const ctx = document.getElementById("networkChart").getContext("2d");

let trafficData = [];
let labels = [];

const networkChart = new Chart(ctx, {
    type: "line",
    data: {
        labels: labels,
        datasets: [{
            label: "Uso de Rede (Mbps)",
            data: trafficData,
            borderColor: "#0078d4",
            backgroundColor: "rgba(0,120,212,0.2)",
            tension: 0.3,
            fill: true
        }]
    },
    options: {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});

setInterval(() => {
    const valor = Math.floor(Math.random() * 200);

    if (trafficData.length > 15) {
        trafficData.shift();
        labels.shift();
    }

    trafficData.push(valor);
    labels.push(new Date().toLocaleTimeString());

    networkChart.update();
}, 2000);