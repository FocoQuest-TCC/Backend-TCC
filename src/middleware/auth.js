const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "focoquest-development-secret";

function authenticate(req, res, next) {
    const authorization = req.headers.authorization || "";
    const [scheme, token] = authorization.split(" ");

    if (scheme !== "Bearer" || !token) {
        return res.status(401).send({ message: "Token de autenticação ausente" });
    }

    try {
        req.auth = jwt.verify(token, JWT_SECRET);
        return next();
    } catch {
        return res.status(401).send({ message: "Token de autenticação inválido ou expirado" });
    }
}

function sameUser(req, res, next) {
    if (String(req.auth.userId) !== String(req.params.id)) {
        return res.status(403).send({ message: "Você não pode acessar os dados de outro usuário" });
    }
    return next();
}

module.exports = { authenticate, sameUser };