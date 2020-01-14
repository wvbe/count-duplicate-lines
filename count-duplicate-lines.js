#!/usr/bin/env node

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

	return new Promise(resolve => process.stdin.on('end', () => resolve(data.split('\n'))));
}

function lpad(str, len, padChar) {
	return str.length >= len
		? str
		: Array.from(new Array(len - str.length))
				.map(() => padChar)
				.join('') + str;
}

const hasPorcelain = process.argv.includes('-p') || process.argv.includes('--porcelain');
(async () => {
	const lines = (await getStreamedInputData()).filter(line => !!line);

	const totals = lines.reduce((tot, line) => {
		tot[line] = (tot[line] || 0) + 1;
		return tot;
	}, {});

	const totalsAsArray = Object.keys(totals)
		.map(line => [totals[line], line])
		.sort(([totalA, _lineA], [totalB, _lineB]) => totalB - totalA);

	if (!hasPorcelain) {
		console.log(lpad('COUNT', 10, ' ') + ' | LINE');
		console.log('--------------------------------------');
	}
	totalsAsArray.forEach(([total, line]) =>
		hasPorcelain
			? console.log(total + '\t' + line)
			: console.log(lpad(total + '', 10, ' ') + ' | ' + line)
	);

	if (!hasPorcelain) {
		console.log('--------------------------------------');
		console.log(lpad(lines.length + '', 10, ' ') + ' | TOTAL LINES');
		console.log(lpad(Object.keys(totals).length + '', 10, ' ') + ' | UNIQUE LINES');
	}
})().catch(error => console.error(error.stack || error));
