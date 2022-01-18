const db = require("./db/connection")
const express = require ("express")
const app = express()
const { getTopics, getArticlesById } = require("./controllers/app.controller")


app.use(express.json())

app.get("/api/topics", getTopics)
app.get(`/api/articles/:article_id`, getArticlesById)

app.all("*", (req, res) => {
    res.status(404).send({message: "Status code 404: not found"})
})

// app.use((err, req, res, next) => {
//     console.log(err);
//         res.status(400).send({message: "Status code 400: Invalid URL"})
// })

module.exports = app;