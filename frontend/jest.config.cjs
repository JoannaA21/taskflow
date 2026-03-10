// jest.config.cjs
module.exports = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.js"],
  moduleFileExtensions: ["js", "jsx"],
  moduleNameMapper: {
    "\\.(css|scss|sasspng|jpg|jpeg|gif|svg)$": "identity-obj-proxy",
  },
  //tells Babel to process JSX
  transform: {
    "^.+\\.[jt]sx?$": "babel-jest",
  },
};
