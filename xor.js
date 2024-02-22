/* The script implements a console interface for encoding and decoding text using the XOR method using the specified encryption key and optionally saving the results to a text file. The script supports input of Cyrillic languages. */

const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

// Key from 0 to 65535
const encryptionKey = 12345;

// Function for working with text
function processText() {
    rl.question('\nEnter the text: ', (text) => {
        writeToOutputFile(`\n`);
        writeToOutputFile(`${text}\n`);

        const isEncoded = isXOREncoded(text);

        if (isEncoded) {
            const decodedText = decodeText(text, encryptionKey);
            console.log('Decrypted text: ', `${decodedText}`);
            writeToOutputFile(`${decodedText}\n`);
        } else {
            const encodedText = encodeText(text, encryptionKey);
            console.log('Encrypted text: ', `${encodedText}`);
            writeToOutputFile(`${encodedText}\n`);
        }

        processText();
    });
}

// Function for decoding XOR text
function decodeText(encodedText, key) {
    let decodedText = '';
    for (let i = 0; i < encodedText.length; i += 4) {
        const chunk = encodedText.substring(i, i + 4);
        const decodedChunk = parseInt(chunk, 16) ^ key;
        decodedText += String.fromCharCode(decodedChunk);
    }
    return decodedText;
}

// Function for encoding XOR text
function encodeText(text, key) {
    let encodedText = '';
    for (let i = 0; i < text.length; i++) {
        const charCode = text.charCodeAt(i);
        const encodedChunk = (charCode ^ key).toString(16).padStart(4, '0');
        encodedText += encodedChunk;
    }
    return encodedText;
}

// Checks if the text is an encrypted XOR, checks for 16-bit number format
function isXOREncoded(str) {
    return /^[0-9a-fA-F]{4,}$/i.test(str);
}

// Writes text to the output.txt file
async function writeToOutputFile(text) {
    try {
        await fs.promises.appendFile('output.txt', text, 'utf8');
    } catch (err) {
        console.error('Error writing to file output.txt:', err);
    }
}

// If the file exists, delete it
function deleteTextfile() {
    const filePath = 'output.txt';
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
    }
}

// Start the text processing process
deleteTextfile();
processText();
