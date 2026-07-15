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
    next(error);
  }
};