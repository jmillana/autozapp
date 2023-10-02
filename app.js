const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

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
});

client.initialize();
