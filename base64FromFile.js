/* The script implements a console interface for encoding and decoding text using the base64 method using the specified encryption key and optionally saving the results to a text file. The script supports input of Cyrillic languages. */

const fs = require('fs');
const readline = require('readline');
const os = require('os');

const rl = readline.createInterface({
    input: fs.createReadStream('input.txt'),
    output: process.stdout,
});

// Function for decoding base64 and encoding to base64 text
function processText() {
    rl.on('line', (text) => {
        const result = isBase64(text) ? decodeText(text) : Buffer.from(text, 'utf8').toString('base64');

        console.log(isBase64(text) ? `${os.EOL}Decrypted text:${os.EOL}` : `${os.EOL}Encrypted text:${os.EOL}`, result);
        writeToOutputFile(result);
    });

    rl.on('close', () => {
        console.log(`${os.EOL}File processing complete.`);
    });
}

// Function for decoding base64 text
function decodeText(encodedText) {
    return Buffer.from(encodedText, 'base64').toString('utf8');
}

// Checks if the text is valid base64
function isBase64(str) {
    try {
        const base64Pattern = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;
        if (!base64Pattern.test(str)) {
            return false;
        }

        const decodedBuffer = Buffer.from(str, 'base64');

        const reEncodedBase64 = decodedBuffer.toString('base64');
        if (reEncodedBase64 !== str) {
            return false;
        }

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
