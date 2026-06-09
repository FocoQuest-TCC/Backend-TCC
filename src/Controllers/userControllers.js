const knex = require("../database/index.js");

module.exports = {

    //Search

    async getAllUsers(req, res){
        try {
            const result = await knex("users").orderBy("UserID")
            return res.status(200).send(result) 
        } catch (error) {
            return res.status(500).send({ error: error.message })
        }
    },

    async getUserById(req, res){
        const { id } = req.params
        try {
            const result = await knex("users").where("UserID", id)
            return res.status(200).send(result)
        } catch (error) {
            return res.status(500).send({ error: error.message })
        }
    },

    //Creation

    async createUser(req, res){
        const info = {name, email, password} = req.body
        await knex("users").insert(info)
        return res.status(201).send({ message: "User created successfully" });
    },

    async updateUser(req, res){
        const { id } = req.params
        const info = {name, email, password} = req.body
        await knex("users").where("UserID", id).update(info)
        return res.status(201).send({ message: "User updated successfully" });
    },

    async deleteUser(req, res){
        const {id} = req.params;
        await knex("users").where("UserID", id).del()
        return res.status(201).send({ message: "User deleted successfully" });
    }
}