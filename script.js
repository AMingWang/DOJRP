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
        title: "網站表單提交通知 📄", // 嵌入訊息的標題
        description: `使用者輸入的內容：\n**${messageContent}**`, // 輸入框的內容作為訊息主體
        color: 0x2ECC71, // 側邊欄的顏色 (綠色，用於成功通知)
        timestamp: new Date().toISOString(), // 顯示發送時間
        fields: [ // 增加一個欄位來顯示額外資訊
            {
                name: "發送來源",
                value: "網頁前端測試工具",
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
        avatar_url: "https://i.imgur.com/gHh5v5w.png", 
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
