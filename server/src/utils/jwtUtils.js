const jwt = require('jsonwebtoken');

const generateToken = (user) => {
  const payload = {
    id: user.id,
    username: user.username,
  };
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });
};

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (token == null) {
    return res.status(401).json({ message: 'Authentication token required.' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      // Differentiate between expired token and invalid token for clarity if needed
      if (err.name === 'TokenExpiredError') {
        return res.status(403).json({ message: 'Token expired.' });
      }
      return res.status(403).json({ message: 'Invalid token.' });
    }
    req.user = user; // Add decoded user payload to request object
    next(); // Proceed to the next middleware or route handler
  });
};

module.exports = {
  generateToken,
  authenticateToken,
};
