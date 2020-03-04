#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

const DEST_DIR = path.join(__dirname, '../dist');
const DEST_ZIP_DIR = path.join(__dirname, '../dist-zip');

const extractExtensionData = () => {
	const { name, version } = require('../package.json');
	const manifest = require('../src/manifest');
	manifest.version = version;
	fs.writeFileSync(`${__dirname}/../src/manifest.json`, JSON.stringify(manifest, null, 4));
	return { name, version };
};

const makeDestZipDirIfNotExists = () => {
	if (!fs.existsSync(DEST_ZIP_DIR)) {
		fs.mkdirSync(DEST_ZIP_DIR);
	}
};

const buildZip = (src, dist, zipFilename) => {
	console.info(`Building ${zipFilename}...`);

	const archive = archiver('zip', { zlib: { level: 9 } });
	const stream = fs.createWriteStream(path.join(dist, zipFilename));

	return new Promise((resolve, reject) => {
		archive
			.directory(src, false)
			.on('error', err => reject(err))
			.pipe(stream);

		stream.on('close', () => resolve());
		archive.finalize();
	});
};

const main = () => {
	const { name, version } = extractExtensionData();
	const zipFilename = `${name}-v${version}.zip`;

	makeDestZipDirIfNotExists();

	buildZip(DEST_DIR, DEST_ZIP_DIR, zipFilename)
		.then(() => console.info('OK'))
		.catch(console.err);
};

main();