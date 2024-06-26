/* The script implements encoding and decoding text using the XOR or Base64 method. The script supports input of Cyrillic languages. */
/* Copyright (c) 2024 Serhii I. Myshko](https://github.com/sergeiown/Encryption_Variations/blob/main/LICENSE */

import { saveToLocalStorage } from './storage.js';

export function processText(textInput, encryptionMethodSelect, outputTextarea) {
    const text = textInput.value.trim();
    const encryptionMethod = encryptionMethodSelect.value;
    saveToLocalStorage('storedText', text);
    saveToLocalStorage('encryptionMethod', encryptionMethod);

    const encryptionMethods = {
        base64: processTextBase64,
        xor: processTextXOR,
    };

    encryptionMethods[encryptionMethod]?.(text, outputTextarea);
}

function processTextBase64(text, outputTextarea) {
    const isEncoded = isBase64(text);
    outputTextarea.value = isEncoded ? decodeBase64(text) : base64EncodeUnicode(text);
}

function processTextXOR(text, outputTextarea) {
    const isEncoded = isXOREncoded(text);
    const encryptionKey = 12345; // The key value is limited to Unicode (UTF-16) where each character is encoded with 16 bits which allows to use codes from 0 to 65535

    outputTextarea.value = isEncoded ? decodeXOR(text, encryptionKey) : encodeXOR(text, encryptionKey);
}

/* The reason for creating functions with different approaches was the difference between client-side JavaScript and Node.js which lies in the specific capabilities and limitations of both environments. The browser function uses atob and btoa to work with Base64 but additionally uses TextEncoder and TextDecoder to process UTF-8 characters including Cyrillic. The function for Node.js uses Buffer to work with Base64 which already supports UTF-8 encoding and is more flexible for working with different character sets including Cyrillic. */
function isBase64(str) {
    // Regular expression to check the Base64 format
    const base64Pattern = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;
    if (!base64Pattern.test(str)) {
        return false;
    }

    try {
        // Decoding Base64 to Uint8Array
        const binaryString = atob(str);
        const byteArray = Uint8Array.from(binaryString, (char) => char.charCodeAt(0));

        // Decoding Uint8Array to UTF-8
        const decodedString = new TextDecoder('utf-8').decode(byteArray);

        // UTF-8 encoding in Uint8Array
        const encodedBytes = new TextEncoder().encode(decodedString);
        const encodedBase64 = btoa(String.fromCharCode(...encodedBytes));

        // Check whether the newly encoded text matches the original
        return encodedBase64 === str;
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
