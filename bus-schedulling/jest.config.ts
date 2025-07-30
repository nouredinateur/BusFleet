import type { Config } from "jest";
import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: "./",
});

// Add any custom config to be passed to Jest
const config: Config = {
  coverageProvider: "v8",
  testEnvironment: "jsdom",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    // Mock the problematic ES module
    "^boring-avatars$": "<rootDir>/src/__mocks__/boring-avatars.js",
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  // Add more setup options before each test is run
  setupFilesAfterEnv: ["<rootDir>/setupTests.ts"],
  // Transform ES modules from node_modules that need to be processed
  transformIgnorePatterns: [
    "node_modules/(?!(boring-avatars)/)"
  ],
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(config);
