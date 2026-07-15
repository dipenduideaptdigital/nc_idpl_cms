export const validate = (schema, source = "body") => {
  return async (req, res, next) => {
    try {
      req[source] = await schema.parseAsync(req[source]);
      next();
    } catch (error) {
      next(error);
    }
  };
};