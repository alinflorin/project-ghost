/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable prefer-spread */

const fs = require('fs/promises');
const glob = require('glob-promise');

const languageCodes = ['en-US', 'ro-RO'];

const convert = (obj) => {
	let x = null;
	eval(`x = ${obj}`);
	return x;
};

(async () => {
	const languageData = await Promise.all(
		languageCodes.map(async (lc) => ({
			data: convert(
				(
					await fs.readFile(`./src/locales/${lc}.ts`, {
						encoding: 'utf-8',
						flag: 'r',
					})
				).replace('export default ', '')
			),
			code: lc,
		}))
	);

	const foundFiles = await glob('../**/*.{ts,tsx,cs}', {
		absolute: false,
		ignore: [
			'../*/**/node_modules/**',
			'../*/**/bin/**',
			'../*/**/obj/**',
			'../*/**/.git/**',
			'./public/**',
		],
	});

	const promises = foundFiles.map(async (file) => {
		const folderName = file.split('/')[1];
		const fileContents = await fs.readFile(file, { flag: 'r', encoding: 'utf-8' });
		const matches = fileContents.match(
			new RegExp(`[\\'\\"]${folderName}\\.[a-zA-Z\\.|:0-9]+[\\"\\']`, 'gi')
		);
		return matches;
	});

	const matches = await Promise.all(promises);
	const listOfLists = matches.filter((x) => x != null);
	const foundKeys = Array.from(
		new Set(
			[].concat
				.apply([], listOfLists)
				.map((x) => x.substr(1, x.length - 2))
				.map((x) => {
					if (x.indexOf('|') > -1) {
						return x.substr(0, x.indexOf('|'));
					}
					return x;
				})
		)
	);

	for (const foundKey of foundKeys) {
		const splitByDot = foundKey.split('.');
		for (const langData of languageData) {
			let currentObj = langData.data;
			for (let i = 0; i < splitByDot.length; i++) {
				const ns = splitByDot[i];
				if (i === splitByDot.length - 1) {
					if (currentObj[ns] == null) {
						currentObj[ns] = '';
					}
					continue;
				}
				if (currentObj[ns] == null) {
					currentObj[ns] = {};
				}
				currentObj = currentObj[ns];
			}
		}
	}

	for (const langData of languageData) {
		await fs.writeFile(
			`./src/locales/${langData.code}.ts`,
			'export default ' + JSON.stringify(langData.data, null, 2)
		);
	}
	console.log('Done');
})();
