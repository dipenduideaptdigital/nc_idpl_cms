
import { describe, it, expect } from "vitest";

import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
} from "../../../src/modules/auth/auth.validation.js";

// Test data and helpers

const VALID_PASSWORD = "Strong@123";

const validRegisterPayload = (overrides = {}) => ({
  name: "Dipendu Mahata",
  email: "dipendu@example.com",
  password: VALID_PASSWORD,
  ...overrides,
});

const validLoginPayload = (overrides = {}) => ({
  email: "dipendu@example.com",
  password: "MyOldPassword",
  ...overrides,
});

const validForgotPasswordPayload = (overrides = {}) => ({
  email: "dipendu@example.com",
  ...overrides,
});

const validResetPasswordPayload = (overrides = {}) => ({
  token: "valid-reset-token",
  password: VALID_PASSWORD,
  ...overrides,
});

const validChangePasswordPayload = (overrides = {}) => ({
  currentPassword: "MyOldPassword",
  newPassword: VALID_PASSWORD,
  ...overrides,
});

// Shared password policy test data.
const invalidPasswords = [
  ["shorter than 8 characters", "Aa1!bc"],
  ["longer than 72 characters", `Aa1!${"a".repeat(69)}`],
  ["missing a lowercase letter", "STRONG@123"],
  ["missing an uppercase letter", "strong@123"],
  ["missing a number", "Strong@abc"],
  ["missing a special character", "Strong123"],
];

const recaptchaSchemas = [
  [
    "registerSchema",
    registerSchema,
    validRegisterPayload(),
  ],
  [
    "loginSchema",
    loginSchema,
    validLoginPayload(),
  ],
  [
    "forgotPasswordSchema",
    forgotPasswordSchema,
    validForgotPasswordPayload(),
  ],
];

// registerSchema

describe("registerSchema", () => {
  it("accepts valid registration data", () => {
    const result = registerSchema.safeParse(
      validRegisterPayload()
    );

    expect(result.success).toBe(true);
  });

  it("trims whitespace from the name", () => {
    const result = registerSchema.safeParse(
      validRegisterPayload({
        name: "  Dipendu Mahata  ",
      })
    );

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data.name).toBe("Dipendu Mahata");
    }
  });

  it("accepts a name containing exactly 2 characters", () => {
    const result = registerSchema.safeParse(
      validRegisterPayload({ name: "AB" })
    );

    expect(result.success).toBe(true);
  });

  it("rejects a name shorter than 2 characters", () => {
    const result = registerSchema.safeParse(
      validRegisterPayload({ name: "A" })
    );

    expect(result.success).toBe(false);
  });

  it("rejects a name that is too short after trimming", () => {
    const result = registerSchema.safeParse(
      validRegisterPayload({ name: "  A  " })
    );

    expect(result.success).toBe(false);
  });

  it.each(["name", "email", "password"])(
    "rejects registration when %s is missing",
    (field) => {
      const payload = validRegisterPayload();

      delete payload[field];

      const result = registerSchema.safeParse(payload);

      expect(result.success).toBe(false);
    }
  );

  it("normalizes email to lowercase", () => {
    const result = registerSchema.safeParse(
      validRegisterPayload({
        email: "DIPENDU@EXAMPLE.COM",
      })
    );

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data.email).toBe("dipendu@example.com");
    }
  });

  it("trims whitespace from email", () => {
    const result = registerSchema.safeParse(
      validRegisterPayload({
        email: "  dipendu@example.com  ",
      })
    );

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data.email).toBe("dipendu@example.com");
    }
  });

  it.each([
    "not-an-email",
    "dipendu@",
    "@example.com",
    "",
  ])("rejects invalid email: %s", (email) => {
    const result = registerSchema.safeParse(
      validRegisterPayload({ email })
    );

    expect(result.success).toBe(false);
  });

  it.each(invalidPasswords)(
    "rejects a password that is %s",
    (_description, password) => {
      const result = registerSchema.safeParse(
        validRegisterPayload({ password })
      );

      expect(result.success).toBe(false);
    }
  );

  it("accepts a password at the minimum length boundary", () => {
    const password = "Aa1!bcde"; // Exactly 8 characters

    const result = registerSchema.safeParse(
      validRegisterPayload({ password })
    );

    expect(result.success).toBe(true);
  });

  it("accepts a password at the maximum length boundary", () => {
    const password = `Aa1!${"a".repeat(68)}`; // Exactly 72 characters

    expect(password).toHaveLength(72);

    const result = registerSchema.safeParse(
      validRegisterPayload({ password })
    );

    expect(result.success).toBe(true);
  });

  it("accepts a valid non-empty reCAPTCHA token", () => {
    const result = registerSchema.safeParse(
      validRegisterPayload({
        recaptchaToken: "valid-recaptcha-token",
      })
    );

    expect(result.success).toBe(true);
  });

  it("allows reCAPTCHA token to be omitted", () => {
    const result = registerSchema.safeParse(
      validRegisterPayload()
    );

    expect(result.success).toBe(true);
  });

  it.each(["", null])(
    "rejects an empty or null reCAPTCHA token: %s",
    (recaptchaToken) => {
      const result = registerSchema.safeParse(
        validRegisterPayload({ recaptchaToken })
      );

      expect(result.success).toBe(false);
    }
  );

  it("strips unknown properties from parsed registration data", () => {
    const result = registerSchema.safeParse({
      ...validRegisterPayload(),
      isAdmin: true,
      unexpectedField: "value",
    });

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data).not.toHaveProperty("isAdmin");
      expect(result.data).not.toHaveProperty("unexpectedField");
    }
  });
});

// loginSchema

describe("loginSchema", () => {
  it("accepts valid login data", () => {
    const result = loginSchema.safeParse(
      validLoginPayload()
    );

    expect(result.success).toBe(true);
  });

  it("normalizes the email address", () => {
    const result = loginSchema.safeParse(
      validLoginPayload({
        email: "  DIPENDU@EXAMPLE.COM  ",
      })
    );

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data.email).toBe("dipendu@example.com");
    }
  });

  it("rejects an invalid email", () => {
    const result = loginSchema.safeParse(
      validLoginPayload({
        email: "invalid-email",
      })
    );

    expect(result.success).toBe(false);
  });

  it("rejects login when email is missing", () => {
    const payload = validLoginPayload();

    delete payload.email;

    expect(loginSchema.safeParse(payload).success).toBe(false);
  });

  it("rejects login when password is missing", () => {
    const payload = validLoginPayload();

    delete payload.password;

    expect(loginSchema.safeParse(payload).success).toBe(false);
  });

  it("rejects an empty password", () => {
    const result = loginSchema.safeParse(
      validLoginPayload({ password: "" })
    );

    expect(result.success).toBe(false);
  });

  it("does not enforce the registration password-strength policy", () => {
    // The current login schema requires only a non-empty string.
    // Existing users must be able to submit their existing password.
    const result = loginSchema.safeParse(
      validLoginPayload({ password: "x" })
    );

    expect(result.success).toBe(true);
  });

  it("allows reCAPTCHA token to be omitted", () => {
    const result = loginSchema.safeParse(
      validLoginPayload()
    );

    expect(result.success).toBe(true);
  });

  it("rejects an empty reCAPTCHA token", () => {
    const result = loginSchema.safeParse(
      validLoginPayload({ recaptchaToken: "" })
    );

    expect(result.success).toBe(false);
  });
});

// forgotPasswordSchema

describe("forgotPasswordSchema", () => {
  it("accepts a valid email", () => {
    const result = forgotPasswordSchema.safeParse(
      validForgotPasswordPayload()
    );

    expect(result.success).toBe(true);
  });

  it("normalizes email to lowercase", () => {
    const result = forgotPasswordSchema.safeParse(
      validForgotPasswordPayload({
        email: "DIPENDU@EXAMPLE.COM",
      })
    );

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data.email).toBe("dipendu@example.com");
    }
  });

  it("trims whitespace around email", () => {
    const result = forgotPasswordSchema.safeParse(
      validForgotPasswordPayload({
        email: "  dipendu@example.com  ",
      })
    );

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data.email).toBe("dipendu@example.com");
    }
  });

  it("rejects an invalid email", () => {
    const result = forgotPasswordSchema.safeParse(
      validForgotPasswordPayload({
        email: "invalid-email",
      })
    );

    expect(result.success).toBe(false);
  });

  it("rejects a missing email", () => {
    const payload = validForgotPasswordPayload();

    delete payload.email;

    expect(
      forgotPasswordSchema.safeParse(payload).success
    ).toBe(false);
  });

  it("allows reCAPTCHA token to be omitted", () => {
    const result = forgotPasswordSchema.safeParse(
      validForgotPasswordPayload()
    );

    expect(result.success).toBe(true);
  });

  it("accepts a valid non-empty reCAPTCHA token", () => {
    const result = forgotPasswordSchema.safeParse(
      validForgotPasswordPayload({
        recaptchaToken: "valid-recaptcha-token",
      })
    );

    expect(result.success).toBe(true);
  });

  it("rejects an empty reCAPTCHA token", () => {
    const result = forgotPasswordSchema.safeParse(
      validForgotPasswordPayload({
        recaptchaToken: "",
      })
    );

    expect(result.success).toBe(false);
  });

  it("rejects a null reCAPTCHA token", () => {
    const result = forgotPasswordSchema.safeParse(
      validForgotPasswordPayload({
        recaptchaToken: null,
      })
    );

    expect(result.success).toBe(false);
  });
});

// resetPasswordSchema

describe("resetPasswordSchema", () => {
  it("accepts a valid reset-password payload", () => {
    const result = resetPasswordSchema.safeParse(
      validResetPasswordPayload()
    );

    expect(result.success).toBe(true);
  });

  it("rejects a missing token", () => {
    const payload = validResetPasswordPayload();

    delete payload.token;

    expect(
      resetPasswordSchema.safeParse(payload).success
    ).toBe(false);
  });

  it("rejects an empty token", () => {
    const result = resetPasswordSchema.safeParse(
      validResetPasswordPayload({ token: "" })
    );

    expect(result.success).toBe(false);
  });

  it("rejects a non-string token", () => {
    const result = resetPasswordSchema.safeParse(
      validResetPasswordPayload({ token: 12345 })
    );

    expect(result.success).toBe(false);
  });

  it("rejects a missing password", () => {
    const payload = validResetPasswordPayload();

    delete payload.password;

    expect(
      resetPasswordSchema.safeParse(payload).success
    ).toBe(false);
  });

  it.each(invalidPasswords)(
    "rejects a new password that is %s",
    (_description, password) => {
      const result = resetPasswordSchema.safeParse(
        validResetPasswordPayload({ password })
      );

      expect(result.success).toBe(false);
    }
  );

  it("accepts a new password with exactly 8 valid characters", () => {
    const result = resetPasswordSchema.safeParse(
      validResetPasswordPayload({
        password: "Aa1!bcde",
      })
    );

    expect(result.success).toBe(true);
  });
});

// changePasswordSchema

describe("changePasswordSchema", () => {
  it("accepts a valid change-password payload", () => {
    const result = changePasswordSchema.safeParse(
      validChangePasswordPayload()
    );

    expect(result.success).toBe(true);
  });

  it("rejects a missing current password", () => {
    const payload = validChangePasswordPayload();

    delete payload.currentPassword;

    expect(
      changePasswordSchema.safeParse(payload).success
    ).toBe(false);
  });

  it("rejects an empty current password", () => {
    const result = changePasswordSchema.safeParse(
      validChangePasswordPayload({
        currentPassword: "",
      })
    );

    expect(result.success).toBe(false);
  });

  it("rejects a missing new password", () => {
    const payload = validChangePasswordPayload();

    delete payload.newPassword;

    expect(
      changePasswordSchema.safeParse(payload).success
    ).toBe(false);
  });

  it.each(invalidPasswords)(
    "rejects a new password that is %s",
    (_description, password) => {
      const result = changePasswordSchema.safeParse(
        validChangePasswordPayload({ newPassword: password })
      );

      expect(result.success).toBe(false);
    }
  );

  it("accepts a new password at the maximum length boundary", () => {
    const password = `Aa1!${"a".repeat(68)}`;

    expect(password).toHaveLength(72);

    const result = changePasswordSchema.safeParse(
      validChangePasswordPayload({ newPassword: password })
    );

    expect(result.success).toBe(true);
  });

  it("does not require the current password to follow new-password rules", () => {
    const result = changePasswordSchema.safeParse(
      validChangePasswordPayload({
        currentPassword: "old",
        newPassword: VALID_PASSWORD,
      })
    );

    expect(result.success).toBe(true);
  });
});

// Shared schema behavior

describe("shared validation behavior", () => {
  it.each(recaptchaSchemas)(
    "%s allows the reCAPTCHA token to be omitted",
    (_name, schema, payload) => {
      expect(schema.safeParse(payload).success).toBe(true);
    }
  );

  it.each(recaptchaSchemas)(
    "%s rejects an empty reCAPTCHA token",
    (_name, schema, payload) => {
      const result = schema.safeParse({
        ...payload,
        recaptchaToken: "",
      });

      expect(result.success).toBe(false);
    }
  );

  it.each(recaptchaSchemas)(
    "%s rejects a null reCAPTCHA token",
    (_name, schema, payload) => {
      const result = schema.safeParse({
        ...payload,
        recaptchaToken: null,
      });

      expect(result.success).toBe(false);
    }
  );
});
