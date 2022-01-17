const {selectTopics} = require("../models/app.model")
exports.getTopics = () => {
    selectTopics()
    console.log("in the controller")
}