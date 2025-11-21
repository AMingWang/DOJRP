// 伺服器 IP 和端口
const SERVER_IP_PORT = '31.214.143.251:11000'; 

// 構造 API 端點
const INFO_API_URL = `http://${SERVER_IP_PORT}/info.json`; 
const PLAYERS_API_URL = `http://${SERVER_IP_PORT}/players.json`;

const statusDisplay = document.getElementById('server-status-display');

async function checkServerStatus() {
    let playerCount = 0;
    let maxPlayers = '未知';
    let isOnline = false;

    try {
        // 1. 嘗試獲取伺服器基本資訊 (Info API)
        const infoResponse = await fetch(INFO_API_URL);
        const infoData = await infoResponse.json();
        
        maxPlayers = infoData.vars.sv_maxClients || '未知';
        isOnline = true; // 只要 info.json 成功，伺服器就視為線上

    } catch (error) {
        // 如果 info.json 都失敗，則確認離線
        console.error('Failed to fetch info.json (Hard Offline):', error);
        statusDisplay.className = 'status-box rounded-3 status-offline';
        statusDisplay.innerHTML = `
            狀態：🔴 **伺服器離線或完全無法連線** (OFFLINE)<br>
            請確認伺服器已啟動。
        `;
        return; 
    }
    
    // --- 如果 info.json 成功，我們繼續嘗試獲取玩家 ---
    
    try {
        // 2. 嘗試獲取玩家列表 (Players API)
        const playersResponse = await fetch(PLAYERS_API_URL);
        const playersData = await playersResponse.json();
        playerCount = playersData.length;

    } catch (error) {
        // 如果 players.json 失敗，則可能是 API 臨時問題，但伺服器仍視為線上
        console.warn('Failed to fetch players.json (API may be rate-limited or temporarily down).', error);
        playerCount = '數據無法獲取';
    }

    // 更新狀態顯示
    statusDisplay.className = 'status-box rounded-3 status-online';
    statusDisplay.innerHTML = `
        狀態：🟢 **線上運行中** (ONLINE)<br>
        玩家人數：**${playerCount} / ${maxPlayers}**
    `;
}

// 載入網頁時執行一次，並設定每 30 秒更新一次
checkServerStatus();
setInterval(checkServerStatus, 30000);
