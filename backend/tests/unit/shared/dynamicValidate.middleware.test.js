import { describe, it, expect, vi, beforeEach } from "vitest";
import { StatusCodes } from "http-status-codes";
import { dynamicCmsValidator } from "../../../src/shared/middlewares/dynamicValidate.middleware.js";
import { AppError } from "../../../src/shared/errors/AppError.js";
import { CMS_REGISTRY } from "../../../src/modules/cms/cms.registry.js";

vi.mock("../../../src/modules/cms/cms.registry.js", () => {
  return {
    CMS_REGISTRY: {
      valid_section_key: {
        parseAsync: vi.fn()
      }
    }
  };
});

describe("Dynamic CMS Validate Middleware", () => {
  let req, res, next;

  beforeEach(() => {
    vi.clearAllMocks();
    
    req = {
      params: {},
      body: { content: "raw data" }
    };
    res = {};
    next = vi.fn();
  });

  it("DVAL-01: should parse body and assign transformed value for a valid section key", async () => {
    req.params.sectionKey = "valid_section_key";
    
    const mockTransformedBody = { content: "validated and transformed data" };
    CMS_REGISTRY["valid_section_key"].parseAsync.mockResolvedValue(mockTransformedBody);

    await dynamicCmsValidator(req, res, next);

    expect(CMS_REGISTRY["valid_section_key"].parseAsync).toHaveBeenCalledWith({ content: "raw data" });
    expect(req.body).toEqual(mockTransformedBody);
    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(); // Normal next() called
  });

  it("DVAL-02: should throw 400 AppError if section key is unknown/unregistered", async () => {
    req.params.sectionKey = "unknown_malicious_key";

    await dynamicCmsValidator(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    const error = next.mock.calls[0][0];
    expect(error).toBeInstanceOf(AppError);
    expect(error.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(error.message).toContain("Invalid CMS section key: 'unknown_malicious_key'");
    expect(next).not.toHaveBeenCalledWith();
  });

  it("DVAL-03: should forward schema validation errors to next(error) for invalid body", async () => {
    req.params.sectionKey = "valid_section_key";
    
    const validationError = new Error("Zod schema validation failed on body");
    CMS_REGISTRY["valid_section_key"].parseAsync.mockRejectedValue(validationError);

    await dynamicCmsValidator(req, res, next);

    expect(CMS_REGISTRY["valid_section_key"].parseAsync).toHaveBeenCalled();
    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(validationError);
    
    // normal next was never called
    expect(next).not.toHaveBeenCalledWith();
  });
});