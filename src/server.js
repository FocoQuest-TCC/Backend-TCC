const express = require("express");
const cors = require("cors");
const routes = require("./routes")
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(routes);

const port = process.env.PORT ?? 6900;

app.listen(port, () => {
    if (!process.env.DATABASE_URL && !process.env.PG_HOST) {
        console.warn("Banco não configurado: crie Backend-TCC-Back/.env com DATABASE_URL ou PG_*.");
    }
    console.log(`Servidor rodando na porta ${port}`);
});