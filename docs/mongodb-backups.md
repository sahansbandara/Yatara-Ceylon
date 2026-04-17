# MongoDB Backups

## Recommended format

Use `mongodump`, not CSV.

- `CSV` is bad for MongoDB backups because it loses nested objects, arrays, `ObjectId`, and date types.
- `JSON` is okay for ad hoc exports, but it is still weaker for full recovery.
- `mongodump --archive --gzip` is the best fit here because it keeps MongoDB data in a restorable dump format and stays small enough for routine snapshots.

This repo now includes:

- a manual backup command
- a manual restore command
- a scheduled GitHub Actions workflow for daily snapshots

## Environment variables

For local use:

- `MONGODB_URI` - primary application database connection
- `MONGODB_BACKUP_URI` - optional dedicated backup connection. Recommended for a read-only backup user.
- `MONGODB_RESTORE_URI` - optional dedicated restore target. Recommended for a local or staging restore database.

Priority order:

- backup script: `MONGODB_BACKUP_URI` -> `MONGODB_URI`
- restore script: `MONGODB_RESTORE_URI` -> `MONGODB_BACKUP_URI` -> `MONGODB_URI`

## Local backup

Install MongoDB Database Tools first.

### macOS

```bash
brew install mongodb-database-tools
```

### Create a backup

```bash
npm run backup:mongodb
```

That writes a compressed archive into `backups/mongodb/` and a matching `.meta.json` file beside it.

You can also choose the output path:

```bash
node scripts/backup-mongodb.mjs ./backups/mongodb/manual-before-cleanup.archive.gz
```

The script reads `MONGODB_BACKUP_URI` first, then falls back to `MONGODB_URI`.

If it falls back to `MONGODB_URI`, the script prints a warning so you know a dedicated backup user is not configured yet.

## Restore a backup

Restore into the URI from `MONGODB_RESTORE_URI`, then `MONGODB_BACKUP_URI`, then `MONGODB_URI`.

```bash
npm run restore:mongodb -- ./backups/mongodb/mongodb-2026-04-12T08-00-00-000Z.archive.gz
```

If you want the target collections dropped before the restore, add `--drop`:

```bash
npm run restore:mongodb -- ./backups/mongodb/mongodb-2026-04-12T08-00-00-000Z.archive.gz --drop
```

Use `--drop` carefully. It removes existing collection contents before the restore.
To reduce accidental restores into the primary app database, `--drop` now expects `MONGODB_RESTORE_URI` unless you intentionally pass `--allow-fallback-target`.

```bash
npm run restore:mongodb -- ./backups/mongodb/mongodb-2026-04-12T08-00-00-000Z.archive.gz --drop --allow-fallback-target
```

Only use `--allow-fallback-target` when you are certain the fallback URI is the database you really want to overwrite.

## First-run verification

After configuring the env and installing MongoDB Database Tools:

```bash
mongodump --version
npm run backup:mongodb
```

Expected result:

- a new `backups/mongodb/*.archive.gz` file
- a matching `*.meta.json` file
- console output showing which env var was used as the backup source

## Daily GitHub backup

The workflow lives in `.github/workflows/mongodb-backup.yml`.

- runs every day at `02:00` Asia/Colombo
- can also be started manually from GitHub Actions with `workflow_dispatch`
- uploads the backup as a GitHub Actions artifact
- keeps artifacts for `30` days

### Required GitHub secret

Add this repository secret:

- `MONGODB_BACKUP_URI`

Use a dedicated MongoDB user for backups if you can. Read-only access is enough for `mongodump`.

### Atlas network access note

If Atlas only allows a fixed IP list, GitHub-hosted runners usually will not connect reliably. In that case, either:

- allow broader access for the backup user, or
- run backups locally with `npm run backup:mongodb`, or
- move the scheduled backup to an environment that already has Atlas access

If your app already connects from Vercel with an open Atlas access list, this workflow usually works without extra changes.
