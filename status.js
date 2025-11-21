// ❗❗❗ 已替換為您的 FiveM 伺服器 IP 和端口 ❗❗❗
const SERVER_IP_PORT = '31.214.143.251:11000'; 

// 構造 API 端點
const INFO_API_URL = `http://${SERVER_IP_PORT}/info.json`; 
const PLAYERS_API_URL = `http://${SERVER_IP_PORT}/players.json`;

const statusDisplay = document.getElementById('server-status-display');

async function checkServerStatus() {
    // 檢查是否已設定 IP，如果沒有則顯示警告
    if (SERVER_IP_PORT.includes('【請輸入您的伺服器 IP:端口】')) {
        statusDisplay.className = 'status-box status-offline';
        statusDisplay.innerHTML = '🔴 **錯誤：** 請在 status.js 中設定您的伺服器 IP 和端口！';
        return;
    }
    
    try {
        // 1. 獲取玩家列表和人數
        const playersResponse = await fetch(PLAYERS_API_URL);
        const playersData = await playersResponse.json();
        const playerCount = playersData.length;

        // 2. 獲取伺服器最大人數
        const infoResponse = await fetch(INFO_API_URL);
        const infoData = await infoResponse.json();
        
        // 嘗試從 info.json 獲取最大人數
        const maxPlayers = infoData.vars.sv_maxClients || '未知';

        // 成功連線，更新狀態顯示
        statusDisplay.className = 'status-box status-online';
        statusDisplay.innerHTML = `
            狀態：🟢 **線上運行中** (ONLINE)<br>
            玩家人數：**${playerCount} / ${maxPlayers}**
        `;

    } catch (error) {
        // 連線失敗（可能是伺服器離線或 CORS 錯誤）
        console.error('Failed to fetch server status. Check CORS settings on FiveM server.', error);
        statusDisplay.className = 'status-box status-offline';
        statusDisplay.innerHTML = `
            狀態：🔴 **伺服器離線或無法連線** (OFFLINE)<br>
            請確認您的伺服器已開啟，並檢查 FiveM 的 CORS 設定。
        `;
    }
}

// 載入網頁時執行一次，並設定每 30 秒更新一次
checkServerStatus();
setInterval(checkServerStatus, 30000);
