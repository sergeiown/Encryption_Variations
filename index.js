/* The script implements encoding and decoding text using the XOR or Base64 method. The script supports input of Cyrillic languages. */
/* Copyright (c) 2024 Serhii I. Myshko](https://github.com/sergeiown/Encryption_Variations/blob/main/LICENSE */

const textInput = document.getElementById('textInput');
const encryptionMethodSelect = document.getElementById('encryptionMethod');
const outputTextarea = document.getElementById('output');
const clearButton = document.getElementById('clearButton');
const copyButton = document.getElementById('copyButton');

window.addEventListener('load', () => {
    const storedText = getFromLocalStorage('storedText');
    const storedMethod = getFromLocalStorage('encryptionMethod');

    if (storedMethod) {
        encryptionMethodSelect.value = storedMethod;
    }

    if (storedText) {
        textInput.value = storedText;
        processText();
    }
});

textInput.addEventListener('input', () => {
    processText();
});

encryptionMethodSelect.addEventListener('change', () => {
    showTemporaryMessage('Encryption method is selected: ' + encryptionMethodSelect.value);
    processText();
});

clearButton.addEventListener('click', () => {
    const msg = !textInput.value ? 'There is no text to clear' : 'Result cleared';

    textInput.value = '';
    outputTextarea.value = '';
    localStorage.removeItem('storedText');

    showTemporaryMessage(msg);
});

copyButton.addEventListener('click', () => {
    copyToClipboard(outputTextarea.value);
});

// General text processing function
function processText() {
    const text = textInput.value.trim();
    const encryptionMethod = encryptionMethodSelect.value;
    saveToLocalStorage('storedText', text);
    saveToLocalStorage('encryptionMethod', encryptionMethod);

    if (encryptionMethod === 'base64') {
        processTextBase64(text);
    } else if (encryptionMethod === 'xor') {
        processTextXOR(text);
    }
}

// The function of text processing using the Base64 method
function processTextBase64(text) {
    const isEncoded = isBase64(text);
    if (isEncoded) {
        const decodedText = decodeBase64(text);
        outputTextarea.value = decodedText;
    } else {
        const encodedText = base64EncodeUnicode(text);
        outputTextarea.value = encodedText;
    }
}

// Text processing function using the XOR method
function processTextXOR(text) {
    const isEncoded = isXOREncoded(text);
    const encryptionKey = 12345;
    if (isEncoded) {
        const decodedText = decodeXOR(text, encryptionKey);
        outputTextarea.value = decodedText;
    } else {
        const encodedText = encodeXOR(text, encryptionKey);
        outputTextarea.value = encodedText;
    }
}

// Check if the text is encoded using the Base64 method
function isBase64(str) {
    try {
        if (btoa(atob(str)) !== str) {
            return false;
        }

        // Check if the string contains invalid characters
        if (/[\u0000-\u001f\u007f-\uffff]/.test(atob(str))) {
            return false;
        }

        return true;
    } catch (error) {
        return false;
    }
}

// Decoding text using the Base64 method
function decodeBase64(encodedText) {
    const binaryString = atob(encodedText.replace(/-/g, '+').replace(/_/g, '/'));
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    const decoder = new TextDecoder('utf-8');
    return decoder.decode(bytes);
}

// Check if the text is encoded using the XOR method
function isXOREncoded(str) {
    return /^[0-9a-fA-F]{4,}$/i.test(str);
}

// Decoding text using the XOR method
function decodeXOR(encodedText, key) {
    let decodedText = '';
    for (let i = 0; i < encodedText.length; i += 4) {
        const chunk = encodedText.substring(i, i + 4);
        const decodedChunk = parseInt(chunk, 16) ^ key;
        decodedText += String.fromCharCode(decodedChunk);
    }
    return decodedText;
}

// Encoding text using the XOR method
function encodeXOR(text, key) {
    let encodedText = '';
    for (let i = 0; i < text.length; i++) {
        const charCode = text.charCodeAt(i);
        const encodedChunk = (charCode ^ key).toString(16).padStart(4, '0');
        encodedText += encodedChunk;
    }
    return encodedText;
}

// Encoding text using the Base64 method
function base64EncodeUnicode(str) {
    return btoa(
        encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (match, p1) => {
            return String.fromCharCode('0x' + p1);
        })
    );
}

// Storing values in local storage
function saveToLocalStorage(name, value) {
    localStorage.setItem(name, value);
}

// Getting a value from local storage
function getFromLocalStorage(name) {
    return localStorage.getItem(name) || '';
}

// Copy text to clipboard
function copyToClipboard(text) {
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

// Copy text to clipboard on unsupported browsers
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

// Show a temporary message to the user
function showTemporaryMessage(messageText) {
    const existingMessage = document.getElementById('temporaryMessage');

    if (existingMessage) {
        existingMessage.remove();
    }

    const message = document.createElement('div');
    message.textContent = messageText;
    message.style.position = 'fixed';
    message.style.top = '10px';
    message.style.right = '10px';
    message.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
    message.style.color = 'white';
    message.style.padding = '10px';
    message.style.borderRadius = '5px';
    message.style.zIndex = '1000';
    message.style.transition = 'opacity 1.5s';
    message.style.opacity = '1';
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
