// script.js
// 獲取所有 HTML 元素
const webhookUrlInput = document.getElementById('webhookUrl');
const embedTitleInput = document.getElementById('embedTitle');
const messageContentInput = document.getElementById('messageContent');
const embedColorInput = document.getElementById('embedColor');
const authorNameInput = document.getElementById('authorName');
const authorIconUrlInput = document.getElementById('authorIconUrl');
const footerTextInput = document.getElementById('footerText');
const footerIconUrlInput = document.getElementById('footerIconUrl');
const jsonPreviewArea = document.getElementById('jsonPreview');
const sendButton = document.getElementById('sendButton');
const statusMessage = document.getElementById('statusMessage');

// 讓 JSON 預覽器在每次輸入時更新
[
    webhookUrlInput, embedTitleInput, messageContentInput, embedColorInput,
    authorNameInput, authorIconUrlInput, footerTextInput, footerIconUrlInput
].forEach(input => {
    input.addEventListener('input', updateJsonPreview);
});

// 使用您上次的 URL 作為預設值 (提醒您再次更換 URL!)
webhookUrlInput.value = 'https://discordapp.com/api/webhooks/1441435902483234981/-vpp_VymNzhXkMccYsNAMhb6y00rEVxtvTBuel6k5X4OMVvdnP5ob3dklsrQIWIzyq2P';
embedColorInput.value = '5865F2'; // Discord 藍色

/**
 * 根據當前表單輸入建立 Discord Webhook 的 JSON payload
 */
function buildPayload() {
    // 獲取並清理輸入值
    const title = embedTitleInput.value.trim();
    const description = messageContentInput.value.trim();
    const colorHex = embedColorInput.value.trim();
    const authorName = authorNameInput.value.trim();
    const authorIconUrl = authorIconUrlInput.value.trim();
    const footerText = footerTextInput.value.trim();
    const footerIconUrl = footerIconUrlInput.value.trim();
    
    // 轉換顏色：確保是 16 進位數，並轉換為十進位 (Discord 需要)
    let colorDecimal = 0;
    if (colorHex && /^[0-9A-Fa-f]{6}$/.test(colorHex)) {
        colorDecimal = parseInt(colorHex, 16);
    } else if (colorHex) {
        // 如果顏色格式不正確，可以給個預設值
        colorDecimal = parseInt('5865F2', 16); 
    }

    const embed = {
        // 只有在有值時才加入屬性
        ...(title && { title: title }),
        ...(description && { description: description }),
        ...(colorDecimal !== 0 && { color: colorDecimal }),
        timestamp: new Date().toISOString(),
        
        // 構建 Author 物件
        ...((authorName || authorIconUrl) && {
            author: {
                ...(authorName && { name: authorName }),
                ...(authorIconUrl && { icon_url: authorIconUrl }),
            }
        }),
        
        // 構建 Footer 物件
        ...((footerText || footerIconUrl) && {
            footer: {
                ...(footerText && { text: footerText }),
                ...(footerIconUrl && { icon_url: footerIconUrl }),
            }
        })
        // 可以在這裡添加 fields, image, thumbnail 等，但為了簡潔暫時不加
    };

    // 完整的 Webhook Payload
    const payload = {
        // 可以自訂 Webhook 的發送者名稱和頭像
        username: "網站通知中心", 
        avatar_url: "https://i.imgur.com/vH9XbJg.png", 
        // 只有在至少有標題或描述時才發送 Embed
        embeds: (title || description) ? [embed] : []
    };
    
    // 如果沒有 Embeds，但有 description，則將 description 作為普通 content 發送
    if (payload.embeds.length === 0 && description) {
        payload.content = description;
    } else if (payload.embeds.length === 0) {
        // 如果連 content 都沒有，則返回 null 阻止發送
        return null; 
    }

    return payload;
}

/**
 * 更新 JSON 預覽框的內容
 */
function updateJsonPreview() {
    const payload = buildPayload();
    if (payload) {
        jsonPreviewArea.value = JSON.stringify(payload, null, 2);
    } else {
        jsonPreviewArea.value = "請至少輸入訊息主內容或標題以生成 JSON。";
    }
}

/**
 * 處理發送按鈕點擊事件
 */
sendButton.addEventListener('click', async () => {
    const WEBHOOK_URL = webhookUrlInput.value.trim();
    if (WEBHOOK_URL === "" || !WEBHOOK_URL.startsWith('http')) {
        statusMessage.textContent = "❌ 請提供有效的 Webhook URL！";
        statusMessage.style.backgroundColor = '#f8d7da';
        statusMessage.style.color = '#721c24';
        return;
    }

    const payload = buildPayload();

    if (!payload) {
        statusMessage.textContent = "⚠️ 發送失敗：沒有任何內容可發送 (標題和內容都為空)。";
        statusMessage.style.backgroundColor = '#fff3cd';
        statusMessage.style.color = '#856404';
        return;
    }
    
    statusMessage.textContent = "正在發送中...";
    statusMessage.style.backgroundColor = '#e2e3e5';
    statusMessage.style.color = '#383d41';

    try {
        const response = await fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (response.ok) {
            statusMessage.textContent = "✅ 訊息發送成功！請檢查 Discord 頻道。";
            statusMessage.style.backgroundColor = '#d4edda';
            statusMessage.style.color = '#155724';
        } else {
            // 處理 Discord API 錯誤 (例如 400 Bad Request)
            const errorText = await response.text();
            statusMessage.textContent = `❌ 發送失敗: 錯誤碼 ${response.status}. 伺服器回應: ${errorText.substring(0, 50)}...`;
            statusMessage.style.backgroundColor = '#f8d7da';
            statusMessage.style.color = '#721c24';
        }
    } catch (error) {
        // 處理網路連線錯誤
        statusMessage.textContent = `❌ 連線錯誤: 無法連線到伺服器。錯誤: ${error.message}`;
        statusMessage.style.backgroundColor = '#f8d7da';
        statusMessage.style.color = '#721c24';
    }
});

// 初始化時生成一次預覽
updateJsonPreview();
