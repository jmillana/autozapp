const { expect } = require('chai');
const { downloadAudio } = require('../../../src/whatsapp.js'); // Replace with the actual module path
const fs = require('fs-extra');
const path = require('path');

// Mocking a WhatsApp message object for testing
class MockMessage {
	constructor(type, data) {
		this.type = type;
		this.data = data;
	}

	async downloadMedia() {
		return {
			data: this.data,
		};
	}
}

describe('downloadAudio', () => {
	let tempDir;

	before(function () {
		// Create a temporary directory before running tests
		tempDir = path.join(__dirname, 'temp'); // Use a directory name that makes sense for your project
		fs.ensureDirSync(tempDir); // Create the directory if it doesn't exist
	});

	after(function () {
		// Remove the temporary directory after running tests
		fs.removeSync(tempDir);
	});

	it('should download and save audio when the message type is "ptt"', async () => {
		const msg = new MockMessage('ptt', 'base64-encoded-audio-data');
		downloadPath = `${tempDir}/audio_ptt.ogg`;
		const result = await downloadAudio(msg, downloadPath);
		expect(result).to.equal(true);
		expect(fs.existsSync(downloadPath)).to.equal(true);
	});

	it('should download and save audio when the message type is "audio"', async () => {
		const msg = new MockMessage('audio', 'base64-encoded-audio-data');
		downloadPath = `${tempDir}/audio_audio.ogg`;
		const result = await downloadAudio(msg, downloadPath);
		expect(result).to.equal(true);
		expect(fs.existsSync(downloadPath)).to.equal(true);
	});

	it('should throw an error for an unsupported message type', async () => {
		const msg = new MockMessage('unsupported', 'base64-encoded-data');
		downloadPath = `${tempDir}/audio_audio.mp3`;
		try {
			await downloadAudio(msg, path);
			// If no error is thrown, fail the test
			expect(fs.existsSync(downloadPath)).to.equal(false);
			expect.fail('Expected an error to be thrown');
		} catch (error) {
			expect(error.message).to.include("expected: 'audio' or 'ptt'");
		}
	});
});
