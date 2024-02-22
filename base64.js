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
            console.log('Decrypted text: ', `${decodedText}`);
            writeToOutputFile(`${decodedText}\n`);
        } else {
            const encodedText = Buffer.from(text, 'utf8').toString('base64');
            console.log('Encrypted text: ', `${encodedText}`);
            writeToOutputFile(`${encodedText}\n`);
        }

        processText();
    });
}

// Function for decoding base64 text
function decodeText(encodedText) {
    return Buffer.from(encodedText, 'base64').toString('utf8');
}

// Checks if the text is valid base64
function isBase64(str) {
    try {
        return Buffer.from(str, 'base64').toString('base64') === str;
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
