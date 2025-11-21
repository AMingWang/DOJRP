// ⚠️ 警告：請務必使用您在 Discord 伺服器中重新生成的新 URL 來替換這個 URL！
const WEBHOOK_URL = 'https://discordapp.com/api/webhooks/1441435902483234981/-vpp_VymNzhXkMccYsNAMhb6y00rEVxtvTBuel6k5X4OMVvdnP5ob3dklsrQIWIzyq2P'; 

// 取得新的 HTML 元素
const embedTitleInput = document.getElementById('embedTitle');
const messageContentInput = document.getElementById('messageContent'); // 將原本的 messageInput 改名為 messageContentInput
const sendButton = document.getElementById('sendButton');
const statusMessage = document.getElementById('statusMessage');

sendButton.addEventListener('click', async () => {
    // 取得輸入值
    const embedTitle = embedTitleInput.value.trim();
    const messageContent = messageContentInput.value.trim();

    if (embedTitle === "" || messageContent === "") {
        statusMessage.textContent = "⚠️ 標題和內容都不能為空！";
        statusMessage.style.color = 'red';
        return;
    }

    statusMessage.textContent = "正在發送 (嵌入式)...";
    statusMessage.style.color = '#7289DA'; // Discord 藍色

    // 構建 Embed 物件
    const newEmbed = {
        title: `【${embedTitle}】`, // 使用用戶輸入的標題
        description: messageContent, // 使用用戶輸入的內容
        color: 0x5865f2, // Discord 藍色
        timestamp: new Date().toISOString(), 
        fields: [
            {
                name: "發送時間",
                value: new Date().toLocaleTimeString('zh-TW'),
                inline: true
            },
            {
                name: "發送來源",
                value: "網站介面",
                inline: true
            }
        ],
        footer: {
            text: "Webhook 自動發送器"
        },
    };

    // 構建 Webhook payload
    const payload = {
        username: "網站控制中心 ⚙️", 
        avatar_url: "https://i.imgur.com/vH9XbJg.png", // 假設這是一個齒輪圖標
        embeds: [newEmbed]
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
            statusMessage.textContent = "✅ 訊息發送成功！請檢查 Discord 頻道。";
            statusMessage.style.backgroundColor = '#d4edda'; // 成功綠色背景
            statusMessage.style.color = '#155724'; // 成功綠色文字
            embedTitleInput.value = ''; // 清空輸入框
            messageContentInput.value = '';
        } else {
            const errorText = await response.text();
            statusMessage.textContent = `❌ 發送失敗: 錯誤碼 ${response.status}. 請檢查 URL 或內容。`;
            statusMessage.style.backgroundColor = '#f8d7da'; // 錯誤紅色背景
            statusMessage.style.color = '#721c24'; // 錯誤紅色文字
        }
    } catch (error) {
        statusMessage.textContent = `❌ 連線錯誤: ${error.message}`;
        statusMessage.style.backgroundColor = '#f8d7da';
        statusMessage.style.color = '#721c24';
    }
});
