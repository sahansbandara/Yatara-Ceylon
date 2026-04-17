#!/usr/bin/env node

import { spawn } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

dotenv.config({ path: path.join(rootDir, '.env.local') });
dotenv.config({ path: path.join(rootDir, '.env') });

const mongoUri = process.env.MONGODB_BACKUP_URI || process.env.MONGODB_URI;
const sourceEnv = process.env.MONGODB_BACKUP_URI ? 'MONGODB_BACKUP_URI' : 'MONGODB_URI';

if (!mongoUri) {
    console.error('Missing MongoDB connection string. Set MONGODB_BACKUP_URI or MONGODB_URI first.');
    process.exit(1);
}

const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const defaultBackupDir = path.join(rootDir, 'backups', 'mongodb');
const archivePath = path.resolve(process.argv[2] || path.join(defaultBackupDir, `mongodb-${timestamp}.archive.gz`));
const metadataPath = archivePath.replace(/\.archive\.gz$/, '.meta.json');

mkdirSync(path.dirname(archivePath), { recursive: true });

if (sourceEnv === 'MONGODB_URI') {
    console.warn('Using MONGODB_URI for backup.');
    console.warn('Set MONGODB_BACKUP_URI if you want a dedicated least-privilege backup user.');
}

const dumpArgs = [
    `--uri=${mongoUri}`,
    `--archive=${archivePath}`,
    '--gzip',
];

const dump = spawn('mongodump', dumpArgs, {
    cwd: rootDir,
    env: process.env,
    stdio: 'inherit',
});

dump.on('error', (error) => {
    if (error.name === 'Error' && 'code' in error && error.code === 'ENOENT') {
        console.error('mongodump was not found. Install MongoDB Database Tools first.');
        console.error('macOS: brew install mongodb-database-tools');
    } else {
        console.error('Failed to start mongodump.', error);
    }
    process.exit(1);
});

dump.on('exit', (code) => {
    if (code !== 0) {
        process.exit(code ?? 1);
    }

    writeFileSync(
        metadataPath,
        JSON.stringify(
            {
                createdAt: new Date().toISOString(),
                archivePath,
                format: 'mongodump archive (--gzip)',
                sourceEnv,
                restoreCommand: `node scripts/restore-mongodb.mjs "${archivePath}"`,
            },
            null,
            2
        )
    );

    console.log(`MongoDB backup source: ${sourceEnv}`);
    console.log(`MongoDB backup created at ${archivePath}`);
    console.log(`Backup metadata written to ${metadataPath}`);
});
