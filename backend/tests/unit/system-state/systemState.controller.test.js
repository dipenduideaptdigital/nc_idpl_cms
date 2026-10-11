import { beforeEach, describe, expect, it, vi } from "vitest";
import { StatusCodes } from "http-status-codes";

import {
  getSystemStateController,
  updateSystemStateController,
} from "../../../src/modules/system-state/systemState.controller.js";
import * as systemStateService from "../../../src/modules/system-state/systemState.service.js";
import { sendResponse } from "../../../src/shared/utils/apiResponse.js";

vi.mock("../../../src/modules/system-state/systemState.service.js", () => ({
  getSystemStateConfig: vi.fn(),
  updateSystemStateConfig: vi.fn(),
}));

vi.mock("../../../src/shared/utils/apiResponse.js", () => ({
  sendResponse: vi.fn(),
}));


const flushAsyncHandler = () =>
  new Promise((resolve) => setImmediate(resolve));

describe("System State Controller", () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    vi.resetAllMocks();

    req = {
      body: {},
      user: {
        id: "actor_123",
        name: "Admin Name",
      },
    };

    res = {};
    next = vi.fn();
  });

  describe("getSystemStateController()", () => {
    it("SSC-01: returns the current system-state configuration in an OK response", async () => {
      const mockConfig = {
        state: "MAINTENANCE",
        title: "Scheduled maintenance",
        version: 3,
      };

      systemStateService.getSystemStateConfig.mockResolvedValue(
        mockConfig,
      );

      getSystemStateController(req, res, next);
      await flushAsyncHandler();

      expect(
        systemStateService.getSystemStateConfig,
      ).toHaveBeenCalledTimes(1);

      expect(
        systemStateService.getSystemStateConfig,
      ).toHaveBeenCalledWith();

      expect(sendResponse).toHaveBeenCalledTimes(1);

      expect(sendResponse).toHaveBeenCalledWith({
        res,
        statusCode: StatusCodes.OK,
        message:
          "System state configuration retrieved successfully.",
        data: mockConfig,
      });

      expect(next).not.toHaveBeenCalled();
    });

    it("SSC-02: passes a null configuration through without inventing a fallback", async () => {
      systemStateService.getSystemStateConfig.mockResolvedValue(
        null,
      );

      getSystemStateController(req, res, next);
      await flushAsyncHandler();

      expect(sendResponse).toHaveBeenCalledTimes(1);

      expect(sendResponse).toHaveBeenCalledWith({
        res,
        statusCode: StatusCodes.OK,
        message:
          "System state configuration retrieved successfully.",
        data: null,
      });

      expect(next).not.toHaveBeenCalled();
    });

    it("SSC-03: forwards a service error to Express error middleware", async () => {
      const serviceError = new Error(
        "System state lookup failed",
      );

      systemStateService.getSystemStateConfig.mockRejectedValue(
        serviceError,
      );

      getSystemStateController(req, res, next);
      await flushAsyncHandler();

      expect(next).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledWith(serviceError);

      expect(sendResponse).not.toHaveBeenCalled();
    });
  });

  describe("updateSystemStateController()", () => {
    it("SSC-04: passes the request payload and authenticated actor to the service and responds successfully", async () => {
      const requestBody = {
        state: "MAINTENANCE",
        version: 4,
        title: "Scheduled maintenance",
      };

      const updatedConfig = {
        ...requestBody,
        version: 5,
        enabledBy: "Admin Name",
      };

      req.body = requestBody;

      systemStateService.updateSystemStateConfig.mockResolvedValue(
        updatedConfig,
      );

      updateSystemStateController(req, res, next);
      await flushAsyncHandler();

      expect(
        systemStateService.updateSystemStateConfig,
      ).toHaveBeenCalledTimes(1);

      expect(
        systemStateService.updateSystemStateConfig,
      ).toHaveBeenCalledWith(
        requestBody,
        "actor_123",
        "Admin Name",
      );

      expect(sendResponse).toHaveBeenCalledTimes(1);

      expect(sendResponse).toHaveBeenCalledWith({
        res,
        statusCode: StatusCodes.OK,
        message:
          "System successfully transitioned to MAINTENANCE mode.",
        data: updatedConfig,
      });

      expect(next).not.toHaveBeenCalled();
    });

    it.each([
      "ACTIVE",
      "READ_ONLY",
      "EMERGENCY",
      "COMING_SOON",
    ])(
      "SSC-05: builds the success message for the returned %s state",
      async (state) => {
        const updatedConfig = {
          state,
          version: 2,
        };

        systemStateService.updateSystemStateConfig.mockResolvedValue(
          updatedConfig,
        );

        updateSystemStateController(req, res, next);
        await flushAsyncHandler();

        expect(sendResponse).toHaveBeenCalledWith({
          res,
          statusCode: StatusCodes.OK,
          message: `System successfully transitioned to ${state} mode.`,
          data: updatedConfig,
        });

        expect(next).not.toHaveBeenCalled();
      },
    );

    it("SSC-06: forwards a service error to Express error middleware and sends no success response", async () => {
      const serviceError = new Error(
        "System state update failed",
      );

      systemStateService.updateSystemStateConfig.mockRejectedValue(
        serviceError,
      );

      req.body = {
        state: "MAINTENANCE",
        version: 1,
      };

      updateSystemStateController(req, res, next);
      await flushAsyncHandler();

      expect(
        systemStateService.updateSystemStateConfig,
      ).toHaveBeenCalledWith(
        req.body,
        req.user.id,
        req.user.name,
      );

      expect(next).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledWith(serviceError);

      expect(sendResponse).not.toHaveBeenCalled();
    });
  });
});