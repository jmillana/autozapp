const fs = require('fs/promises');

/**
 * Download audio from whatsapp message
 * @param {Message} msg - Whatsapp message
 * @param {string} path - Path to save the audio
 * @return {boolean} - True if the message is a voice clip and was downloaded,
 *                   false otherwise
 */
async function downloadAudio(msg, path) {
	if (msg.type === 'ptt' || msg.type === 'audio') {
		const attachedData = await msg.downloadMedia();
		const binaryData = Buffer.from(attachedData.data, 'base64');
		try {
			await fs.writeFile(path, binaryData);
			return true;
		} catch (error) {
			console.log('Error writing to file:', error);
			throw error;
		}
	}
	throw Error(`The message type is: ${msg.type} expected: 'audio' or 'ptt'`);
}

module.exports = { downloadAudio };
