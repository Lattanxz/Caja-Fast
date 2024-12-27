const jwt = require("jsonwebtoken");

exports.authenticateToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1]; // 'Bearer <token>'
  if (!token) {
    return res.status(401).json({ error: "Token no proporcionado" });
  }

  jwt.verify(token, "tu_secreto", (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Token no válido" });
    }
    req.user = user; // Pasar el usuario decodificado en req.user
    next(); // Continuar con la siguiente función middleware
  });
};
