/**
 * This module contains the functions to transcript the audio
 *
 * The audio can be transcripted using two different modes:
 * - openai: using the OpenAI transcription API
 *
 * */
const fs = require('fs');
const path = require('path');
const exec = require('child_process').exec;
asyncExec = util.promisify(exec);

/**
 * Convert the given audio file in .ogg format into
 * a file with the same name in .wav format
 *
 * @param {string} audioFile - ogg file to be converted
 *
 * */
async function oggToWav(audioFile) {
	inputPath = path.parse(audioFile);
	if (inputPath.ext !== '.ogg') {
		console.log('Not an ogg file');
		return null;
	}
	console.log();
	wavFile = `${inputPath.dir}/${inputPath.name}.wav`;

	const command = `ffmpeg -y -i ${audioFile} -vn ${wavFile}`;
	try {
		await asyncExec(command);
		return wavFile;
	} catch (error) {
		console.log('Error while converting the audio file:', error);
		throw error;
	}
}

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
