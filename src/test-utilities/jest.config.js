/** @type {import('jest').Config} */

module.exports = {
  transform: {
    "^.+\\.(js|jsx)$": "babel-jest",
    "^.+\\.(js|jsx|mjs)$": "<rootDir>/src/jest-transformer.js",
  },
  collectCoverageFrom: ["src/**/*.{js,jsx,mjs}"],
  testMatch: [
    "<rootDir>/src/**/__tests__/**/*.{js,jsx,mjs}",
    "<rootDir>/src/**/?(*.)(spec|test).{js,jsx,mjs}",
  ],
  transformIgnorePatterns: ["/node_modules/(?!(.*@amcharts\\/amcharts5.*))"],
  moduleNameMapper: {
    "react-toastify/dist/ReactToastify.css":
      "<rootDir>/node_modules/react-toastify/dist/ReactToastify.css",
  },
};
//C:\Users\MohammedGberejaye\Desktop\plug-frontend\node_modules\react-toastify\dist\ReactToastify.css
