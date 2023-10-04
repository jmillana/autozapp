async function ask_chatgpity(prompt, openai) {
	const response = await openai.chat.completions.create({
		messages: [
			{
				role: 'user',
				content: prompt,
			},
		],
		model: 'gpt-3.5-turbo',
	});
	return response.choices[0].message.content;
}

/**
 * Generate a summary of the given text
 * @param {string} text - Text to be summarized
 * @param {string} openai - OpenAI instance
 * */
async function summarize(text, openai) {
	prompt = `Get the key point of the provided text, as short as possible [${text}]? 
	the summary must be in the same language that the provided text`;
	return await ask_chatgpity(prompt, openai);
}

/**
 * Translate the given text to the given language
 * @param {string} text - Text to be translated
 * @param {string} request - Language to translate to
 * @param {string} openai - OpenAI instance
 */
async function translate(text, request, openai) {
	prompt = `Translate the text: [${text}] to: [${request}]
	the response must only be the traslated text`;
	return ask_chatgpity(prompt, openai);
}

/**
 * Explain the given text to the specified question
 * @param {string} text - Text to be translated
 * @param {string} question - Question to be answered
 * @param {string} openai - OpenAI instance
 * @param {string} language - Language of the explanation
 */
async function explain(text, question, openai, language = 'es') {
	prompt = `Explain the following: [${question}] in the given 
		text: [${text}] the response must be in language: [${language}]`;
	return ask_chatgpity(prompt, openai);
}

module.exports = {
	summarize,
	translate,
	explain,
};
