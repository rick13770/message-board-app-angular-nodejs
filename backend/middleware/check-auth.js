const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

const checkAuth = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, JWT_SECRET);

    // @ts-ignore
    req.userData = { id: decodedToken.id, email: decodedToken.email };

    next();
  } catch (error) {
    res.status(401).json({ message: 'You are not authenticated!' });
  }
};

module.exports = checkAuth;
