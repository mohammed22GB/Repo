// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allo you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom/extend-expect";
import { setupServer } from "msw/node";
import { handlers } from "./test-utilities/testMocks/handlers";

// const windowMock = {
//   open: jest.fn(),
// };

const crypto = require("crypto");

Object?.defineProperties(global.self, {
  crypto: {
    value: {
      subtle: crypto?.webcrypto?.subtle,
      getRandomValues(dataBuffer) {
        return crypto?.randomFillSync(dataBuffer);
      },
      randomUUID() {
        return crypto?.randomUUID();
      },
    },
  },
});

// Mock for `IntersectionObserver`
class IntersectionObserverMock {
  constructor(callback, options) {
    this.callback = callback;
    this.options = options;
    this.observedElements = new Set();
  }

  observe(target) {
    this.observedElements.add(target);

    const entry = {
      isIntersecting: true,
      target,
      intersectionRatio: 1,
      boundingClientRect: target.getBoundingClientRect
        ? target.getBoundingClientRect()
        : {},
      rootBounds: null,
      time: Date.now(),
    };

    this.callback([entry], this);
  }
  unobserve(target) {
    if (this.observedElements.has(target)) {
      this.observedElements.delete(target);
    }
  }

  disconnect() {
    this.observedElements.clear();
  }
}
global.IntersectionObserver = IntersectionObserverMock;

//configure({ asyncUtilTimeout: 5000 });

export const server = setupServer(...handlers);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

module.exports = {
  globals: {
    crypto,
  },
  server,
};
