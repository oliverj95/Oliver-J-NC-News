const {selectTopics} = require("../models/app.model")

exports.getTopics = (req, res, next) => {
    selectTopics()
    .then((topics) => {
        res.status(200).send({topics: topics})
    })
    .catch(next)
}