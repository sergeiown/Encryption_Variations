/* The script implements encoding and decoding text using the XOR or Base64 method. The script supports input of Cyrillic languages. */
/* Copyright (c) 2024 Serhii I. Myshko](https://github.com/sergeiown/Encryption_Variations/blob/main/LICENSE */

import { showTemporaryMessage } from './message.js';

export function copyToClipboard(text) {
    if (!navigator.clipboard) {
        fallbackCopyTextToClipboard(text);
        return;
    }

    navigator.clipboard
        .writeText(text)
        .then(() => {
            const msg = text ? 'Result copied' : 'There is no text to copy';
            showTemporaryMessage(msg);
        })
        .catch((err) => {
            console.error('Failed to copy the result to clipboard', err);
        });
}

function fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;

    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        const successful = document.execCommand('copy');
        const msg = successful ? 'Result copied' : 'There is no text to copy';
        showTemporaryMessage(msg);
    } catch (err) {
        console.error('Failed to copy the result to clipboard', err);
    }

    document.body.removeChild(textArea);
}
