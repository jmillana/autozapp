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
const tmp = require('tmp');
const util = require('util');
const { removeFile } = require('./utils.js');
asyncExec = util.promisify(exec);

const TranscriptModes = {
	LOCAL: 'local',
	OPENAI_API: 'openai',
};

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

/**
 * Generates the transcription on the given audio
 *
 * By default the system will try to guess the language of the audio
 * the user can provid an specific language to guide the system.
 *
 * @param {string} audioFile - File to be transcripted
 * @param {string} lang - Language of the audio file
 * @param {string} mode - Mode to use to transcript the audio
 * @param {string} openai - OpenAI instance
 *
 */
async function transcript(
	audioFile,
	lang = null,
	mode = TranscriptModes.LOCAL,
	openai = null,
) {
	const tmpFile = tmp.tmpNameSync({ postfix: '.txt' });

	switch (mode) {
		case TranscriptModes.LOCAL:
			transcription = await transcriptLocal(audioFile, tmpFile, lang);
			break;
		case TranscriptModes.OPENAI_API:
			if (openai === null) {
				console.log('OpenAI instance is required, please provide it');
				throw Error('OpenAI instance is not enabled');
			}
			transcription = await transcriptOpenAI(audioFile, openai, lang);
			break;
		default:
			console.log('Selected mode do not exist');
			throw Error(`Transcription mode: ${mode} not in: ${TranscriptModes}`);
	}
	// Remove the tmp file is exists
	removeFile(tmpFile);
	return transcription;
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
	console.log('Transcripting the audio file using OpenAI API');
	const prompt =
		'The transcription must be in the same language than ' +
		'the audio. The audio language is likely to be catalan (cat) and ' +
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

/**
 * Generates the transcription on the given audio using the local
 * transcription system.
 *
 * @param {string} audioFile - File to be transcripted
 * @param {string} tmpFile - Temporary file to save the transcription
 * @param {string} lang - Language of the audio file
 *
 */
async function transcriptLocal(audioFile, tmpFile, lang = null) {
	console.log('Transcripting the audio file locally');
	throw Error('Local transcription is not implemented yet');
}

module.exports = {
	oggToWav,
	transcript,
	transcriptLocal,
	transcriptOpenAI,
	TranscriptModes,
};
