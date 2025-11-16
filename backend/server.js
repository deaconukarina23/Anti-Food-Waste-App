const express = require("express");
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Backend-ul e functional");
});

app.listen(3000, () => {
    console.log("Serverul ruleaza pe portul 3000");
})