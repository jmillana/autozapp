/**
 * This module contains the functions to transcript the audio
 *
 * The audio can be transcripted using two different modes:
 * - openai: using the OpenAI transcription API
 *
 * */
const fs = require('fs');

/*
/**
 * Generates the transcription on the given audio using the OpenAI
 * transcription API.
 *
 * @param {string} audioFile - File to be transcripted
 * @param {string} lang - Language of the audio file
 * @param {string} openai - OpenAI instance
 *
 */
async function transcriptOpenAI(audioFile, openai, lang = null) {
	const prompt =
		'The transcription must be in the same language than ' +
		'the audio. The audio language is likel to be catalan (cat) and ' +
		'some times spanish (es).';
	const options = {
		file: fs.createReadStream(audioFile),
		model: 'whisper-1',
		prompt: prompt,
	};
	if (lang !== null) {
		options.lang = lang;
	}
	try {
		const transcription = await openai.audio.transcriptions.create(options);
		return transcription.text;
	} catch (error) {
		console.log(`Error generating the transcription: ${error}`);
		throw error;
	}
}

module.exports = {
	transcriptOpenAI,
};
