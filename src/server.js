const express = require("express");
const routes = require("./routes")

const app = express();
app.use(cors());
app.use(express.json());
app.use(routes);

app.listen(process.env.PORT ?? 6900, 
    ()=> process.env.PORT ? console.log(process.env.PORT) :
    console.log("Servidor porta 6900"))