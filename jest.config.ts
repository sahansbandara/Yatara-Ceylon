import type { Config } from 'jest'
import nextJest from 'next/jest.js'

const createJestConfig = nextJest({
    dir: './',
})

const config: Config = {
    coverageProvider: 'v8',
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
    modulePathIgnorePatterns: [
        '<rootDir>/.claude/worktrees/',
    ],
    testPathIgnorePatterns: [
        '/node_modules/',
        '/.next/',
        '<rootDir>/.claude/worktrees/',
    ],
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
    },
}

// next/jest overrides transformIgnorePatterns, so we modify the
// resolved config to ensure ESM-only packages like `jose` are transformed.
const jestConfig = createJestConfig(config)

export default async () => {
    const resolvedConfig = await jestConfig()
    resolvedConfig.transformIgnorePatterns = [
        '/node_modules/(?!.pnpm)(?!(jose|geist|bson|mongodb|mongoose)/)',
        '/node_modules/.pnpm/(?!(jose|geist|bson|mongodb|mongoose)@)',
        '^.+\\.module\\.(css|sass|scss)$',
    ]
    return resolvedConfig
}
