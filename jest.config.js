module.exports = {
    testMatch: [
        '**/*.test.js'
    ],
    testPathIgnorePatterns: [
      '\\\\node_modules\\\\'
    ],
    collectCoverage: true, // Enable coverage collection
    collectCoverageFrom: [
        "src/**/*.{js,jsx,ts,tsx}", // Include files for coverage
        "!src/**/*.d.ts", // Exclude type definition files
        "!src/**/index.{js,jsx,ts,tsx}" // Exclude entry files like index.js
      ],
    coverageDirectory: "coverage", // Directory to store coverage reports
    coverageReporters: ["json", "text", "lcov", "clover"], // Formats for coverage reports
    testEnvironment: "node", // Default environment for Jest

  };