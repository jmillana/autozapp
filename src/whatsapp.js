const fs = require('fs/promises');
const audio = require('./audio.js');
const tmp = require('tmp');
const utils = require('./utils.js');

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

/**
 * Transcripts the audio message
 * @param {Message} msg - Whatsapp message
 * @param {OpenAI} openai - OpenAI instance
 * @return {string} - Transcription of the audio message
 * @throws {Error} - If the audio can't be transcripted
 */
async function transcriptAudioMsg(msg, openai) {
	const quotedMsg = await msg.getQuotedMessage();
	if (quotedMsg === undefined) {
		return;
	}

	if (quotedMsg.type !== 'ptt' && quotedMsg.type !== 'audio') {
		console.log('Audio file not attached');
		return;
	}
	let transcriptMode = audio.TranscriptModes.LOCAL;
	if (msg.body.includes('p2w') || msg.body.includes('$')) {
		transcriptMode = audio.TranscriptModes.OPENAI_API;
	}

	const lastPart = msg.body.split(' ').pop();
	const lang = lastPart.length === 2 ? lastPart : null;
	const originalAudio = tmp.tmpNameSync({ postfix: '.ogg' });

	console.log('Downloading audio...');

	try {
		await downloadAudio(quotedMsg, originalAudio);
		await utils.checkFile(originalAudio);
	} catch (error) {
		console.log('Error downloading the audio');
		throw error;
	}

	try {
		wavFile = await audio.oggToWav(originalAudio);
		await utils.checkFile(wavFile);
	} catch (error) {
		console.log('Error converting the audio to wav');
		throw error;
	} finally {
		await utils.removeFile(originalAudio);
	}

	console.log('WAV audio file generated');
	console.log('Generating transcription...');
	try {
		const transcription = await audio.transcript(
			wavFile,
			lang,
			transcriptMode,
			openai,
		);
		console.log(`transcription generated: ${transcription}`);
		return transcription;
	} catch (error) {
		console.log(error);
	}
}

module.exports = { downloadAudio, transcriptAudioMsg };
