export const validate = (schema, source = "body") => {
  return async (req, res, next) => {
    try {
      req[source] = await schema.parseAsync(req[source]);
      next();
    } catch (error) {
      if (error.name === 'ZodError') {
        error.statusCode = 400;
      }
      next(error);
    }
  };
};