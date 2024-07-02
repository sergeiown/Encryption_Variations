/* The script implements a console interface for encoding and decoding text using the base64 method using the specified encryption key and optionally saving the results to a text file. The script supports input of Cyrillic languages. */

const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

// Function for decoding base64 and encoding to base64 text
function processText() {
    rl.question('\nEnter the text: ', (text) => {
        writeToOutputFile(`\n`);
        writeToOutputFile(`${text}\n`);

        const isEncoded = isBase64(text);

        if (isEncoded) {
            const decodedText = decodeText(text);
            console.log('Decrypted text:', `${decodedText}`);
            writeToOutputFile(`${decodedText}\n`);
        } else {
            const encodedText = Buffer.from(text, 'utf8').toString('base64');
            console.log('Encrypted text:', `${encodedText}`);
            writeToOutputFile(`${encodedText}\n`);
        }

        processText();
    });
}

// Function for decoding base64 text
function decodeText(encodedText) {
    return Buffer.from(encodedText, 'base64').toString('utf8');
}

/* The reason for creating functions with different approaches was the difference between client-side JavaScript and Node.js which lies in the specific capabilities and limitations of both environments. The browser function uses atob and btoa to work with Base64 but additionally uses TextEncoder and TextDecoder to process UTF-8 characters including Cyrillic. The function for Node.js uses Buffer to work with Base64 which already supports UTF-8 encoding and is more flexible for working with different character sets including Cyrillic. */
function isBase64(str) {
    try {
        const base64Pattern = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;
        if (!base64Pattern.test(str)) {
            return false;
        }

        // Base64 decoding in Buffer
        const decodedBuffer = Buffer.from(str, 'base64');

        // Check if the encoded string is the same after decoding
        const reEncodedBase64 = decodedBuffer.toString('base64');
        if (reEncodedBase64 !== str) {
            return false;
        }

        // check if all bytes are UTF-8 compliant
        const utf8String = decodedBuffer.toString('utf8');
        const utf8Bytes = Buffer.from(utf8String, 'utf8');
        return utf8Bytes.equals(decodedBuffer);
    } catch (error) {
        return false;
    }
}

// Writes text to the output.txt file
async function writeToOutputFile(text) {
    try {
        await fs.promises.appendFile('output.txt', text, 'utf8');
    } catch (err) {
        console.error('c output.txt:', err);
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
