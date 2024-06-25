/* The script implements encoding and decoding text using the XOR or Base64 method. The script supports input of Cyrillic languages. */
/* Copyright (c) 2024 Serhii I. Myshko](https://github.com/sergeiown/Encryption_Variations/blob/main/LICENSE */

export function showTemporaryMessage(messageText) {
    const existingMessage = document.getElementById('temporaryMessage');

    if (existingMessage) {
        existingMessage.remove();
    }

    const message = document.createElement('div');
    message.textContent = messageText;
    message.id = 'temporaryMessage';

    document.body.appendChild(message);

    setTimeout(() => {
        message.style.opacity = '0';
    }, 1500);

    setTimeout(() => {
        message.remove();
    }, 3000);

    console.log(messageText);
}
