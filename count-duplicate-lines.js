#!/usr/bin/env node

const KEY_WIDTH = 10;
const RULER_TEXT = '--------------------------------------';

// Promise the input piped into this program
async function getStreamedInputData() {
	if (process.stdin.isTTY) {
		throw new Error('Process STDIN is not TTY');
	}
	let data = '';
	process.stdin.on('readable', () => {
		const chunk = process.stdin.read();
		if (chunk !== null) {
			data += chunk;
		}
	});

	return new Promise((resolve) => process.stdin.on('end', () => resolve(data.split('\n'))));
}

// Print two columns, where the left column is 10 characters and aligned to the right
function log(left, right) {
	console.log(
		left.length >= KEY_WIDTH ? left : ' '.repeat(KEY_WIDTH - left.length) + left + ' | ' + right
	);
}

// Porcelain mode includes less formatting text, making it easier to parse by other software
const hasPorcelain = process.argv.includes('-p') || process.argv.includes('--porcelain');

// Run the script
(async () => {
	const lines = (await getStreamedInputData()).filter((line) => !!line);

	const totals = lines.reduce((tot, line) => {
		tot[line] = (tot[line] || 0) + 1;
		return tot;
	}, {});

	const sorted = Object.keys(totals)
		.map((line) => [totals[line], line])
		.sort(([totalA], [totalB]) => totalB - totalA);

	if (hasPorcelain) {
		sorted.forEach(([total, line]) => console.log(total + '\t' + line));
	} else {
		log('COUNT', 'LINE');
		console.log(RULER_TEXT);
		sorted.forEach(([total, line]) => log(String(total), line));
		console.log(RULER_TEXT);
		log(String(lines.length), 'TOTAL LINES');
		log(String(Object.keys(totals).length), 'UNIQUE LINES');
	}
})().catch((error) => console.error(error.stack || error));
