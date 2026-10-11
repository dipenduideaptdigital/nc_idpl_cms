import { describe, it, expect, vi } from "vitest";
import { asyncHandler } from "../../../src/shared/utils/asyncHandler.js";

describe("asyncHandler Utility", () => {
  it("1. should return a wrapper function", () => {
    const mockFn = vi.fn();
    const wrapper = asyncHandler(mockFn);

    expect(typeof wrapper).toBe("function");
  });

  it("2. should pass req, res, and next to the wrapped function", async () => {
    const mockFn = vi.fn();
    const wrapper = asyncHandler(mockFn);
    
    const req = { method: "GET" };
    const res = { status: vi.fn() };
    const next = vi.fn();

    // Await ensures the promise resolves before assertions
    await wrapper(req, res, next);

    expect(mockFn).toHaveBeenCalledWith(req, res, next);
  });

  it("3. should forward synchronous errors to next", async () => {
    const error = new Error("Synchronous error occurred");
    const mockFn = vi.fn(() => {
      throw error;
    });
    const wrapper = asyncHandler(mockFn);
    const next = vi.fn();

    await wrapper({}, {}, next);

    expect(next).toHaveBeenCalledWith(error);
  });

  it("4. should forward rejected promises to next", async () => {
    const error = new Error("Asynchronous rejection occurred");
    const mockFn = vi.fn(() => Promise.reject(error));
    const wrapper = asyncHandler(mockFn);
    const next = vi.fn();

    await wrapper({}, {}, next);

    expect(next).toHaveBeenCalledWith(error);
  });

  it("5. should not call next on successful execution", async () => {
    const mockFn = vi.fn(() => Promise.resolve("Success"));
    const wrapper = asyncHandler(mockFn);
    const next = vi.fn();

    await wrapper({}, {}, next);

    expect(mockFn).toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled(); // next should not be called with an error or at all
  });
});