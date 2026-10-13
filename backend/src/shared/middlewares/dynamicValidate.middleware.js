import { StatusCodes } from "http-status-codes";
import { AppError } from "../errors/AppError.js";
import { CMS_REGISTRY } from "../../modules/cms/cms.registry.js";

export const dynamicCmsValidator = async (req, res, next) => {
  try {
    const { sectionKey } = req.params;
    
    const schema = CMS_REGISTRY[sectionKey];

    if (!schema) {
      throw new AppError(
        `Invalid CMS section key: '${sectionKey}'. This section is not registered.`, 
        StatusCodes.BAD_REQUEST
      );
    }

    req.body = await schema.parseAsync(req.body);
    
    next();
  } catch (error) {
    if (error?.name === "ZodError") {
      const validationMessage = Array.isArray(error.issues)
        ? error.issues
            .map((issue) => {
              const field = issue.path.length
                ? issue.path.join(".")
                : "body";

              return `${field}: ${issue.message}`;
            })
            .join("; ")
        : "Invalid CMS content";

      return next(
        new AppError(
          validationMessage,
          StatusCodes.BAD_REQUEST
        )
      );
    }

    return next(error);
  }
};