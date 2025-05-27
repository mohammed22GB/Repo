export const emailSchema = {
  email: {
    presence: { allowEmpty: false, message: "is required" },
    email: true,
    length: {
      maximum: 64,
    },
  },
};
export const emptyEmailSchema = {
  email: {
    presence: { allowEmpty: true },
    email: true,
    length: {
      maximum: 64,
    },
  },
};
