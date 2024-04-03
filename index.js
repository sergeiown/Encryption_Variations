/* The script implements encoding and decoding text using the XOR or Base64 method. The script supports input of Cyrillic languages. */
/* Copyright (c) 2024 Serhii I. Myshko](https://github.com/sergeiown/Encryption_Variations/blob/main/LICENSE */

const textInput = document.getElementById('textInput');
const encryptionMethodSelect = document.getElementById('encryptionMethod');
const outputTextarea = document.getElementById('output');

textInput.addEventListener('input', () => {
    const text = textInput.value.trim();
    const encryptionMethod = encryptionMethodSelect.value;

    if (encryptionMethod === 'base64') {
        processTextBase64(text);
    } else if (encryptionMethod === 'xor') {
        processTextXOR(text);
    }
});

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

function isBase64(str) {
    try {
        return btoa(atob(str)) === str;
    } catch (error) {
        return false;
    }
}

function decodeBase64(encodedText) {
    const binaryString = atob(encodedText.replace(/-/g, '+').replace(/_/g, '/'));
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    const decoder = new TextDecoder('utf-8');
    return decoder.decode(bytes);
}

function isXOREncoded(str) {
    return /^[0-9a-fA-F]{4,}$/i.test(str);
}

function decodeXOR(encodedText, key) {
    let decodedText = '';
    for (let i = 0; i < encodedText.length; i += 4) {
        const chunk = encodedText.substring(i, i + 4);
        const decodedChunk = parseInt(chunk, 16) ^ key;
        decodedText += String.fromCharCode(decodedChunk);
    }
    return decodedText;
}

function encodeXOR(text, key) {
    let encodedText = '';
    for (let i = 0; i < text.length; i++) {
        const charCode = text.charCodeAt(i);
        const encodedChunk = (charCode ^ key).toString(16).padStart(4, '0');
        encodedText += encodedChunk;
    }
    return encodedText;
}

function base64EncodeUnicode(str) {
    return btoa(
        encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (match, p1) => {
            return String.fromCharCode('0x' + p1);
        })
    );
}
