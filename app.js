const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const OpenAI = require('openai');

const whatsapp = require('./src/whatsapp.js');

require('dotenv').config();

/**
 * Load the OpenAI API if the api key is present
 * @return {OpenAI} - OpenAI API object
 * */
function loadOpenAIAPI() {
	let openai = null;
	if (process.env.OPENAI_API_KEY !== undefined) {
		openai = new OpenAI({
			apiKey: process.env.OPENAI_API_KEY,
		});
		console.log('OpenAI API enabled');
	} else {
		console.log('OpenAI API disabled');
	}
	return openai;
}
const openai = loadOpenAIAPI();

/**
 * Get the help menu
 * @return {string} - Help menu
 */
function getHelpMenu() {
	const helpMenu =
		'*Usage:*\n' +
		'*!ping*: Pong\n' +
		'*!text* <$> <language>: Transcipt the audio of the attached audio\n' +
		'    *$*: Use OpenAI API, by default trys to use the local model\n' +
		'    *language*: Set the language of the audio (en, es, ca, ...)\n' +
		'*!help*: Show this same menu\n';
	return helpMenu;
}

const client = new Client({
	authStrategy: new LocalAuth(),
});

client.on('loading_screen', (percent, message) => {
	console.log('LOADING SCREEN', percent, message);
});

client.on('qr', (qr) => {
	// Generate and scan this code with your phone
	qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
	console.log('Client is ready!');
});

client.on('message', async (msg) => {
	// Fired on all the messages excluding your own
	const contact = await msg.getContact();
	console.log(`Recieved message from: ${contact.pushname}`);

	console.log(msg.body);
});

client.on('message_create', async (msg) => {
	// Fired on all message creations, including your own
	const contact = await msg.getContact();

	if (msg.body === '!help') {
		msg.reply(getHelpMenu());
	}

	console.log(msg.body);
	if (msg.body === '!ping') {
		// Anyone can ping
		msg.reply('pong');
	}

	if (msg.id.fromMe) {
		console.log('Message from Self');
	} else {
		return;
	}
	// From here on only on messages from self
	if (msg.body === '!pong') {
		// Only you can pong
		msg.reply('ping');
	}

	if (msg.body.startsWith('!imdeaf') || msg.body.startsWith('!text')) {
		console.log('Processing transcription request');
		try {
			const transcription = await whatsapp.transcriptAudioMsg(msg, openai);
			if (!transcription) {
				console.log('Empty transcription');
				return;
			}
			msg.reply(transcription);
		} catch (error) {
			console.log('Error:', error);
		}
	}
});

client.initialize();
