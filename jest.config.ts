import type { Config } from "@jest/types";
export default async function JestConfig(): Promise<Config.InitialOptions> {
  return {
    roots: ["<rootDir>"],

    testMatch: ["**/*.spec.[tj]s?(x)"],
    transform: {
      "^.+\\.(ts|tsx)$": "ts-jest",
    },
    testPathIgnorePatterns: ["/node_modules/"],
    verbose: true,
    globals: {
      "ts-jest": {
        tsconfig: {
          resolveJsonModule: true,
        },
      },
    },
  };
}
