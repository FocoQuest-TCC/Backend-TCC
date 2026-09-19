const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const knex = require("../database/index.js");

const JWT_SECRET = process.env.JWT_SECRET || "focoquest-development-secret";
const PASSWORD_ROUNDS = 12;

function publicUser(user) {
    const { password: _, ...safeUser } = user;
    return safeUser;
}

function createToken(user) {
    return jwt.sign({ userId: String(user.UserID) }, JWT_SECRET, { expiresIn: "7d" });
}

function defaultAppData() {
    return {
        tasks: [],
        habits: [],
        boards: [],
        kanbanTasks: [],
        inventory: [],
        gold: 0,
        gems: 0,
    };
}

module.exports = {

    async login(req, res){
        const { password } = req.body;
        const email = typeof req.body.email === "string" ? req.body.email.toLowerCase() : req.body.email;

        if (!email || !password) {
            return res.status(400).send({ message: "Email e senha são obrigatórios" });
        }

        try {
            const user = await knex("users").where({ email }).first();

            if (!user) {
                return res.status(401).send({ message: "Email ou senha inválidos" });
            }

            let passwordMatches = await bcrypt.compare(password, user.password);

            // Rehashes accounts created before bcrypt was enabled.
            if (!passwordMatches && !user.password.startsWith("$2")) {
                passwordMatches = user.password === password;
                if (passwordMatches) {
                    const passwordHash = await bcrypt.hash(password, PASSWORD_ROUNDS);
                    await knex("users").where("UserID", user.UserID).update({ password: passwordHash });
                }
            }

            if (!passwordMatches) {
                return res.status(401).send({ message: "Email ou senha inválidos" });
            }

            return res.status(200).send({ token: createToken(user), user: publicUser(user) });
        } catch (error) {
            return res.status(500).send({ message: "Erro ao entrar", error: error.message });
        }
    },

    //Search

    async getAllUsers(req, res){
        try {
            const result = await knex("users").select("UserID", "name", "email").orderBy("UserID")
            return res.status(200).send(result)
        } catch (error) {
            return res.status(500).send({ error: error.message })
        }
    },

    async getUserById(req, res){
        const { id } = req.params
        try {
            const result = await knex("users").select("UserID", "name", "email").where("UserID", id)
            return res.status(200).send(result)
        } catch (error) {
            return res.status(500).send({ error: error.message })
        }
    },

    //Creation

    async createUser(req, res){
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).send({ message: "Nome, email e senha são obrigatórios" });
        }

        try {
            const existingUser = await knex("users").where({ email }).first();
            if (existingUser) {
                return res.status(409).send({ message: "Este email já está cadastrado" });
            }

            const passwordHash = await bcrypt.hash(password, PASSWORD_ROUNDS);
            const [user] = await knex("users")
                .insert({ name, email: email.toLowerCase(), password: passwordHash, app_data: defaultAppData() })
                .returning(["UserID", "name", "email", "app_data"]);
            return res.status(201).send({ user });
        } catch (error) {
            return res.status(500).send({ message: "Erro ao criar usuário", error: error.message });
        }
    },

    async updateUser(req, res){
        const { id } = req.params;
        const { name, email, password } = req.body;
        const info = {};

        if (name) info.name = name;
        if (email) info.email = email.toLowerCase();
        if (password) info.password = await bcrypt.hash(password, PASSWORD_ROUNDS);

        await knex("users").where("UserID", id).update(info);
        return res.status(200).send({ message: "User updated successfully" });
    },

    async deleteUser(req, res){
        const {id} = req.params;
        await knex("users").where("UserID", id).del()
        return res.status(200).send({ message: "User deleted successfully" });
    },

    async getUserData(req, res) {
        const user = await knex("users").select("app_data").where("UserID", req.params.id).first();
        if (!user) return res.status(404).send({ message: "Usuário não encontrado" });
        return res.status(200).send({ data: user.app_data || defaultAppData() });
    },

    async updateUserData(req, res) {
        const data = req.body?.data;
        if (!data || typeof data !== "object" || Array.isArray(data)) {
            return res.status(400).send({ message: "Os dados do usuário são inválidos" });
        }

        await knex("users").where("UserID", req.params.id).update({ app_data: data });
        return res.status(200).send({ data });
    }
}