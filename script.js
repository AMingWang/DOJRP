// script.js
// 獲取所有 HTML 元素
const webhookUrlInput = document.getElementById('webhookUrl');
const embedTitleInput = document.getElementById('embedTitle');
const messageContentInput = document.getElementById('messageContent');

// 顏色選擇器相關元素
const embedColorPicker = document.getElementById('embedColorPicker');
const embedColorHexInput = document.getElementById('embedColorHex'); 

const authorNameInput = document.getElementById('authorName');
const authorIconUrlInput = document.getElementById('authorIconUrl');
const footerTextInput = document.getElementById('footerText');
const footerIconUrlInput = document.getElementById('footerIconUrl');
const jsonPreviewArea = document.getElementById('jsonPreview');
const sendButton = document.getElementById('sendButton');
const statusMessage = document.getElementById('statusMessage');

// Field 相關元素
const fieldsContainer = document.getElementById('fieldsContainer');
const addFieldButton = document.getElementById('addFieldButton');

// 設置預設值
// 警告：此 URL 已被用於公開對話，請務必替換為新生成的 URL！
webhookUrlInput.value = 'https://discordapp.com/api/webhooks/1441435902483234981/-vpp_VymNzhXkMccYsNAMhb6y00rEVxtvTBuel6k5X4OMVvdnP5ob3dklsrQIWIzyq2P';
const defaultColorHex = '#5865F2'; 
embedColorPicker.value = defaultColorHex;
embedColorHexInput.value = defaultColorHex.substring(1).toUpperCase(); 

// === 顏色處理函數 ===

/**
 * 處理顏色選擇器變化，更新 Hex 文本框，並觸發 JSON 預覽更新
 */
function handleColorChange() {
    const hex = embedColorPicker.value;
    embedColorHexInput.value = hex.substring(1).toUpperCase();
    updateJsonPreview();
}

// 監聽顏色選擇器變化
embedColorPicker.addEventListener('input', handleColorChange);

// === Field 相關函數 ===

/**
 * 創建一個新的 Field 輸入組
 */
function createFieldElement() {
    const fieldGroup = document.createElement('div');
    fieldGroup.classList.add('field-group');
    
    // 欄位名稱
    const nameRow = document.createElement('div');
    nameRow.classList.add('field-row');
    nameRow.innerHTML = `<label>名稱 (Name):</label><input type="text" class="field-name" placeholder="例如：訂單編號">`;
    fieldGroup.appendChild(nameRow);

    // 欄位值
    const valueRow = document.createElement('div');
    valueRow.classList.add('field-row');
    valueRow.innerHTML = `<label>值 (Value):</label><input type="text" class="field-value" placeholder="例如：#A12345">`;
    fieldGroup.appendChild(valueRow);
    
    // 內聯選項和移除按鈕
    const controlRow = document.createElement('div');
    controlRow.classList.add('field-row');
    controlRow.style.justifyContent = 'space-between';
    
    const inlineGroup = document.createElement('div');
    inlineGroup.classList.add('checkbox-group');
    inlineGroup.innerHTML = `<label style="width: auto;"><input type="checkbox" class="field-inline" checked> 內聯 (Inline)</label>`;
    
    const removeButton = document.createElement('button');
    removeButton.textContent = '移除欄位';
    removeButton.classList.add('remove-field');
    removeButton.type = 'button'; 
    removeButton.onclick = () => {
        fieldGroup.remove();
        updateJsonPreview();
    };

    controlRow.appendChild(inlineGroup);
    controlRow.appendChild(removeButton);
    fieldGroup.appendChild(controlRow);

    // 監聽輸入以更新預覽
    fieldGroup.querySelectorAll('input').forEach(input => {
        input.addEventListener('input', updateJsonPreview);
    });

    return fieldGroup;
}

/**
 * 新增欄位到容器
 */
addFieldButton.addEventListener('click', () => {
    fieldsContainer.appendChild(createFieldElement());
    updateJsonPreview();
});

// 預設加載時新增一個欄位供使用者參考
fieldsContainer.appendChild(createFieldElement());


// === 主要 Payload 構建函數 ===

/**
 * 根據當前表單輸入建立 Discord Webhook 的 JSON payload
 */
function buildPayload() {
    const title = embedTitleInput.value.trim();
    const description = messageContentInput.value.trim();
    const colorHex = embedColorPicker.value.substring(1); 
    const authorName = authorNameInput.value.trim();
    const authorIconUrl = authorIconUrlInput.value.trim();
    const footerText = footerTextInput.value.trim();
    const footerIconUrl = footerIconUrlInput.value.trim();
    
    let colorDecimal = colorHex ? parseInt(colorHex, 16) : 0;
    
    // 讀取所有動態生成的 Field
    const fields = [];
    document.querySelectorAll('.field-group').forEach(group => {
        const nameElement = group.querySelector('.field-name');
        const valueElement = group.querySelector('.field-value');
        const inlineElement = group.querySelector('.field-inline');

        const name = nameElement ? nameElement.value.trim() : '';
        const value = valueElement ? valueElement.value.trim() : '';
        const inline = inlineElement ? inlineElement.checked : false;

        if (name || value) {
            fields.push({
                name: name || '\u200b', 
                value: value || '\u200b', 
                inline: inline
            });
        }
    });

    const embed = {
        ...(title && { title: title }),
        ...(description && { description: description }),
        ...(colorDecimal !== 0 && { color: colorDecimal }), 
        timestamp: new Date().toISOString(),
        
        ...(fields.length > 0 && { fields: fields }),

        ...((authorName || authorIconUrl) && {
            author: {
                ...(authorName && { name: authorName }),
                ...(authorIconUrl && { icon_url: authorIconUrl }),
            }
        }),
        
        ...((footerText || footerIconUrl) && {
            footer: {
                ...(footerText && { text: footerText }),
                ...(footerIconUrl && { icon_url: footerIconUrl }),
            }
        })
    };

    const payload = {
        username: "網站通知中心", 
        avatar_url: "https://i.imgur.com/vH9XbJg.png", 
        embeds: (title || description || fields.length > 0) ? [embed] : []
    };
    
    if (payload.embeds.length === 0 && description) {
        payload.content = description;
    } else if (payload.embeds.length === 0) {
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
        jsonPreviewArea.value = "請至少輸入訊息主內容或標題或 Field 以生成 JSON。";
    }
}

// 將所有靜態輸入框加入 JSON 預覽更新事件
[
    webhookUrlInput, embedTitleInput, messageContentInput, 
    authorNameInput, authorIconUrlInput, footerTextInput, footerIconUrlInput
].forEach(input => {
    input.addEventListener('input', updateJsonPreview);
});

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
        statusMessage.textContent = "⚠️ 發送失敗：沒有任何內容可發送。";
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
            const errorText = await response.text();
            statusMessage.textContent = `❌ 發送失敗: 錯誤碼 ${response.status}. 伺服器回應: ${errorText.substring(0, 50)}...`;
            statusMessage.style.backgroundColor = '#f8d7da';
            statusMessage.style.color = '#721c24';
        }
    } catch (error) {
        statusMessage.textContent = `❌ 連線錯誤: 無法連線到伺服器。錯誤: ${error.message}`;
        statusMessage.style.backgroundColor = '#f8d7da';
        statusMessage.style.color = '#721c24';
    }
});

// 初始化時生成一次預覽
updateJsonPreview();
