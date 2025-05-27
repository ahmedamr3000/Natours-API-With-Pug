export const validateUpdateData = (req, res, next) => {
  const rules = {
    ratingsAverage: (value) => value <= 5,
    price: (value) => value > 0,
    duration: (value) => value > 0,
    maxGroupSize: (value) => value > 0,
    difficulty: (value) => ['easy', 'medium', 'difficult'].includes(value),
  };

  const errors = [];

  for (const [key, value] of Object.entries(req.body)) {
    if (rules[key] && !rules[key](value)) {
      errors.push(`${key} has an invalid value: ${value}`);
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      status: 'fail',
      message: 'Invalid input data.',
      errors: errors,
    });
  }

  next();
};
