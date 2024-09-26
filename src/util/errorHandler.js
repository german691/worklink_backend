export const handleError = (message, status) => {
  const error = new Error(message);
  error.status = status;
  throw error;
};

export const handleErrorResponse = (res, error) => {
  if (error.isJoi) {
    return res.status(400).json({
      status: 400,
      message: error.details[0]?.message || "The data received didn't pass Joi validations - (unclear reason)",
    });
  }

  return res.status(error.status).json({
    status: error.status || 500,
    message: error.message || 'Internal server error',
    details: error.details ?? [],
  });
};
