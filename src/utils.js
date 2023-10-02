const fs = require('fs/promises');
/**
 * Check if the given file exists
 * @param {string} path - File to be checked
 * @return {boolean} - True if the file exists, otherwise raises an error
 * @throws {Error} - If the file cannot be read
 */
async function checkFile(path) {
	try {
		await fs.stat(path);
		return true;
	} catch (error) {
		if (error.code === 'ENOENT') {
			console.log('File does not exist:', path);
		} else {
			console.error('Error reading file:', error);
		}
		throw error;
	}
}

/**
 * Attempt to delete the given file
 * @param {string} path - File to be removed
 * @return {boolean} - True if the file was removed, otherwise false
 */
async function removeFile(path) {
	try {
		await fs.unlink(tmpFile);
		console.log('Tmp file deleted successfully');
		return true;
	} catch (error) {
		console.log('Error while removing the tmp file');
		return false;
	}
}

module.exports = {
	checkFile,
	removeFile,
};
