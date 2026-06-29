export const validatePayload = (req, res, next) => {
  // Prevent NoSQL Injection: Reject any keys starting with '$' or containing '.' in the request body, query, or params
  const checkForInvalidKeys = (obj) => {
    if (!obj || typeof obj !== 'object') return false;
    for (const key in obj) {
      if (key.startsWith('$') || key.includes('.')) {
        return true;
      }
      if (typeof obj[key] === 'object') {
        if (checkForInvalidKeys(obj[key])) return true;
      }
    }
    return false;
  };

  if (checkForInvalidKeys(req.body) || checkForInvalidKeys(req.query) || checkForInvalidKeys(req.params)) {
    return res.status(400).json({ error: 'Invalid payload structure detected' });
  }

  // Basic string sanitization for body properties (trim whitespace)
  if (req.body && typeof req.body === 'object') {
    for (const key in req.body) {
      if (typeof req.body[key] === 'string') {
        req.body[key] = req.body[key].trim();
      }
    }
  }

  next();
};
