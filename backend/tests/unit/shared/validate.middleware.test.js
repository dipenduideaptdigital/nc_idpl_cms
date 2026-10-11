// tests/unit/shared/validate.middleware.test.js
import { describe, it, expect, vi, beforeEach } from "vitest";
import { validate } from "../../../src/shared/middlewares/validate.middleware.js";

describe("Validate Middleware", () => {
  let req, res, next, mockSchema;

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Dummy req and res
    req = {
      body: { name: "  Dipendu  " },
      query: { page: "2" },
      params: { id: "123" }
    };
    res = {};
    next = vi.fn();

    mockSchema = {
      parseAsync: vi.fn()
    };
  });

  it("VAL-01: should parse req.body by default and assign transformed value", async () => {
    // Schema resolves with a trimmed/transformed value
    mockSchema.parseAsync.mockResolvedValue({ name: "Dipendu" });
    
    const middleware = validate(mockSchema); // source defaults to "body"
    await middleware(req, res, next);

    expect(mockSchema.parseAsync).toHaveBeenCalledWith({ name: "  Dipendu  " });
    expect(req.body).toEqual({ name: "Dipendu" }); // Mutated with parsed value
    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(); // Normal next() called
  });

  it("VAL-02: should parse req.query when source is 'query'", async () => {
    mockSchema.parseAsync.mockResolvedValue({ page: 2 }); // Transformed to number
    
    const middleware = validate(mockSchema, "query");
    await middleware(req, res, next);

    expect(mockSchema.parseAsync).toHaveBeenCalledWith({ page: "2" });
    expect(req.query).toEqual({ page: 2 });
    expect(next).toHaveBeenCalledTimes(1);
  });

  it("VAL-03: should parse req.params when source is 'params'", async () => {
    mockSchema.parseAsync.mockResolvedValue({ id: 123 });
    
    const middleware = validate(mockSchema, "params");
    await middleware(req, res, next);

    expect(mockSchema.parseAsync).toHaveBeenCalledWith({ id: "123" });
    expect(req.params).toEqual({ id: 123 });
    expect(next).toHaveBeenCalledTimes(1);
  });

  it("VAL-04: should catch schema validation errors and forward to next(error)", async () => {
    const validationError = new Error("Zod validation failed");
    mockSchema.parseAsync.mockRejectedValue(validationError);
    
    const middleware = validate(mockSchema);
    await middleware(req, res, next);

    expect(mockSchema.parseAsync).toHaveBeenCalled();
    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(validationError); // Sent to error middleware
    // req.body remains unchanged on failure
    expect(req.body).toEqual({ name: "  Dipendu  " });
  });
});