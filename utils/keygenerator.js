function generateKey() {
	const tokens = 'NTg0NjE2MzQ2MDE3NTk1Mzky.XR64Iw.pGJHaOKRflmY1PsRIhDUfMNppH0';
	let keyOut = '';

	// segments
	for (let i = 0; i < 5; i++) {
		for (let y = 0; y < 4; y++) {
			const random = Math.floor((Math.random() * 35) + 1);
			const char = tokens.charAt(random);
			keyOut += char;
		}

		if (i !== 4) {
			keyOut += '-';
		}
	}

	return keyOut;
}

exports.generateKey = generateKey;
