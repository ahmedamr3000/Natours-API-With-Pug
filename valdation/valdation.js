export const valdation = (scema) => {
  return (req, res, next) => {
    let valdation = scema.validate(req.body, { abortEarly: false });
    if (valdation.error && valdation.error.details) {
      let errors = valdation.error.details.map((er) => er.message);
      return res.status(400).json({ message: 'valdation error', errors });
    } else {
      next();
    }
  };
};
