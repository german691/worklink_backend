export const handleError = (message, status) => {
  const error = new Error(message);
  error.status = status || 500;
  throw error;
};

export const handleErrorResponse = (res, error) => {
  const statusCode = error.status || 500; 
  
  if (error.isJoi) {
    return res.status(400).json({
      status: 400,
      message: error.details[0]?.message || "The data received didn't pass Joi validations - (unclear reason)",
    });
  }

  return res.status(statusCode).json({
    status: statusCode,
    message: error.message || 'Internal server error',
    details: error.details ?? [],
  });
};
