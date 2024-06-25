/* The script implements encoding and decoding text using the XOR or Base64 method. The script supports input of Cyrillic languages. */
/* Copyright (c) 2024 Serhii I. Myshko](https://github.com/sergeiown/Encryption_Variations/blob/main/LICENSE */

import { processText } from './encryption.js';
import { getFromLocalStorage } from './storage.js';
import { copyToClipboard } from './clipboard.js';
import { showTemporaryMessage } from './message.js';

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
        processText(textInput, encryptionMethodSelect, outputTextarea);
    }
});

textInput.addEventListener('input', () => {
    processText(textInput, encryptionMethodSelect, outputTextarea);
});

encryptionMethodSelect.addEventListener('change', () => {
    showTemporaryMessage('Encryption method is selected: ' + encryptionMethodSelect.value);
    processText(textInput, encryptionMethodSelect, outputTextarea);
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
