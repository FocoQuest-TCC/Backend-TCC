const express = require("express");
const userControllers = require("./Controllers/userControllers.js");

const routes = express.Router();

routes.get("/users", userControllers.getAllUsers);
routes.get("/users/:id", userControllers.getUserById);
routes.post("/users", userControllers.createUser);
routes.put("/users/:id", userControllers.updateUser);
routes.delete("/users/:id", userControllers.deleteUser);

module.exports = routes;