const express = require("express");
const userControllers = require("./Controllers/userControllers.js");
const { authenticate, sameUser } = require("./middleware/auth.js");

const routes = express.Router();

routes.post("/login", userControllers.login);
routes.post("/users", userControllers.createUser);

routes.use(authenticate);
routes.get("/users", userControllers.getAllUsers);
routes.get("/users/:id", userControllers.getUserById);
routes.put("/users/:id", sameUser, userControllers.updateUser);
routes.delete("/users/:id", sameUser, userControllers.deleteUser);
routes.get("/users/:id/data", sameUser, userControllers.getUserData);
routes.put("/users/:id/data", sameUser, userControllers.updateUserData);

module.exports = routes;