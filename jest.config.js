module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/src"],
  testMatch: ["**/*.test.ts"],
  collectCoverageFrom: ["src/**/*.ts", "!src/**/*.test.ts", "!src/server.ts"],
  coverageDirectory: "coverage",
  coverageReporters: ["lcov", "text", "json"],
};
