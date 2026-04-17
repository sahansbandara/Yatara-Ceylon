#!/usr/bin/env node

import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

dotenv.config({ path: path.join(rootDir, '.env.local') });
dotenv.config({ path: path.join(rootDir, '.env') });

const mongoUri = process.env.MONGODB_RESTORE_URI || process.env.MONGODB_BACKUP_URI || process.env.MONGODB_URI;
const targetEnv = process.env.MONGODB_RESTORE_URI
    ? 'MONGODB_RESTORE_URI'
    : process.env.MONGODB_BACKUP_URI
      ? 'MONGODB_BACKUP_URI'
      : 'MONGODB_URI';

if (!mongoUri) {
    console.error('Missing MongoDB connection string. Set MONGODB_RESTORE_URI, MONGODB_BACKUP_URI, or MONGODB_URI first.');
    process.exit(1);
}

const inputPath = process.argv[2];
const shouldDrop = process.argv.includes('--drop');
const allowFallbackTarget = process.argv.includes('--allow-fallback-target');

if (!inputPath) {
    console.error('Usage: node scripts/restore-mongodb.mjs <path-to-backup.archive.gz> [--drop] [--allow-fallback-target]');
    process.exit(1);
}

const archivePath = path.resolve(inputPath);

if (!existsSync(archivePath)) {
    console.error(`Backup archive not found: ${archivePath}`);
    process.exit(1);
}

if (shouldDrop && targetEnv !== 'MONGODB_RESTORE_URI' && !allowFallbackTarget) {
    console.error('Refusing to run --drop without an explicit MONGODB_RESTORE_URI target.');
    console.error('Set MONGODB_RESTORE_URI to a staging/local database or pass --allow-fallback-target intentionally.');
    process.exit(1);
}

if (targetEnv !== 'MONGODB_RESTORE_URI') {
    console.warn(`Restoring using ${targetEnv}.`);
    console.warn('Set MONGODB_RESTORE_URI if you want restores isolated from the primary application database.');
}

const restoreArgs = [
    `--uri=${mongoUri}`,
    `--archive=${archivePath}`,
    '--gzip',
];

if (shouldDrop) {
    restoreArgs.push('--drop');
}

const restore = spawn('mongorestore', restoreArgs, {
    cwd: rootDir,
    env: process.env,
    stdio: 'inherit',
});

restore.on('error', (error) => {
    if (error.name === 'Error' && 'code' in error && error.code === 'ENOENT') {
        console.error('mongorestore was not found. Install MongoDB Database Tools first.');
        console.error('macOS: brew install mongodb-database-tools');
    } else {
        console.error('Failed to start mongorestore.', error);
    }
    process.exit(1);
});

restore.on('exit', (code) => {
    if (code !== 0) {
        process.exit(code ?? 1);
    }

    console.log(`MongoDB restore target: ${targetEnv}`);
    console.log(`MongoDB restore completed from ${archivePath}`);
    if (shouldDrop) {
        console.log('Existing collections were dropped before restore.');
    }
});
