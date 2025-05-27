// __mocks__/CustomAxios.js
const mockAxiosInstance = {
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
  interceptors: {
    request: { use: jest.fn() },
    response: { use: jest.fn() },
  },
};

const CustomAxios = jest.fn().mockImplementation((args) => {
  // Mock token handling
  const mockToken = localStorage.getItem("accessToken") || null;

  // Mock interceptor
  mockAxiosInstance.interceptors.response.use.mockImplementation(
    (successFn, errorFn) => {
      // You can implement actual interceptor logic here if needed
      return jest.fn();
    }
  );

  return mockAxiosInstance;
});

// Export both the mock and the instance for test control
module.exports = {
  default: CustomAxios,
  mockAxiosInstance,
};
