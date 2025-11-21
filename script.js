// ⚠️ 警告：這是一個**公開的 Webhook URL**。
// 為了您的伺服器安全，請務必在 Discord 刪除舊的 Webhook 並取得**新的 URL** 替換到這裡！
const WEBHOOK_URL = 'https://discordapp.com/api/webhooks/1441435902483234981/-vpp_VymNzhXkMccYsNAMhb6y00rEVxtvTBuel6k5X4OMVvdnP5ob3dklsrQIWIzyq2P'; 

const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');
const statusMessage = document.getElementById('statusMessage');

sendButton.addEventListener('click', async () => {
    const messageContent = messageInput.value.trim();

    if (messageContent === "") {
        statusMessage.textContent = "請輸入訊息內容！";
        statusMessage.style.color = 'orange';
        return;
    }

    statusMessage.textContent = "正在發送 (嵌入式)...";
    statusMessage.style.color = 'gray';

    // 構建 Embed 物件，使用綠色並增加一個欄位
    const newEmbed = {
        title: "Discord community 通知", // 嵌入訊息的標題
        description: `管理員：\n**${messageContent}**`, // 輸入框的內容作為訊息主體
        color: 0x2ECC71, // 側邊欄的顏色 (綠色，用於成功通知)
        timestamp: new Date().toISOString(), // 顯示發送時間
        fields: [ // 增加一個欄位來顯示額外資訊
            {
                name: "發送來源",
                value: "Discord community",
                inline: true // 允許與其他欄位並排顯示
            }
        ],
        footer: {
            text: "系統發送於"
        },
    };

    // 構建 Webhook payload
    const payload = {
        username: "網站通知機器人 🤖", 
        // 假設這個頭像是機器人圖標
        avatar_url: "data:image/png;base64,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", 
        embeds: [newEmbed] // 將構建好的 embed 放入陣列
    };

    try {
        const response = await fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (response.ok) {
            statusMessage.textContent = "✅ 嵌入式訊息發送成功！請檢查 Discord 頻道。";
            statusMessage.style.color = 'green';
            messageInput.value = ''; // 清空輸入框
        } else {
            const errorText = await response.text();
            statusMessage.textContent = `❌ 發送失敗: 錯誤碼 ${response.status}. 伺服器回應: ${errorText.substring(0, 50)}...`;
            statusMessage.style.color = 'red';
        }
    } catch (error) {
        statusMessage.textContent = `❌ 發送失敗: 無法連線到伺服器。錯誤: ${error.message}`;
        statusMessage.style.color = 'red';
    }
});
