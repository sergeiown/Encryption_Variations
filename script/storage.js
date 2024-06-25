/* The script implements encoding and decoding text using the XOR or Base64 method. The script supports input of Cyrillic languages. */
/* Copyright (c) 2024 Serhii I. Myshko](https://github.com/sergeiown/Encryption_Variations/blob/main/LICENSE */

export function saveToLocalStorage(name, value) {
    localStorage.setItem(name, value);
}

export function getFromLocalStorage(name) {
    return localStorage.getItem(name) || '';
}
