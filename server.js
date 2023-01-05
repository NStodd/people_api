require('dotenv').config()
const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const morgan = require("morgan")

const { PORT = 3000, DATABASE_URL } = process.env

const app = express()

// connect to the database
mongoose.connect(DATABASE_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
})

// connection events
mongoose.connection
    .on("open", () => {console.log("you are connected to mongoose")})
    .on("close", () => {console.log("you are disconnected from mongoose")})
    .on("error", (error) => {console.log(error)})



// Models
const PeopleSchema = new mongoose.Schema({
    name: String,
    image: String,
    title: String
})

const People = mongoose.model("People", PeopleSchema)


// Middleware
app.use(cors())
app.use(morgan("dev"))
app.use(express.json())


// Routes
// test route
app.get('/', (req, res) => {
    res.send("hello world")
})

// Index Route, get all the people
app.get("/people", async (req, res) => {
    try {
        // send all the people
        res.json(await People.find({}))
    } catch (err) {
        // send the error
        res.status(400).json(err)
    }
})

//Create Route, make a new person in people
app.post("/people", async (req, res) => {
    try {
        //create a new person
        res.json(await People.create(req.body))
    } catch (err) {
        // send the error
        res.status(400).json(err)
    }
})

// Update Route, update a person in people
app.put("/people/:id", async (req, res) => {
    try {
        res.json(await People.findByIdAndUpdate(req.params.id, req.body))
    } catch (err) {
        res.status(400).json(err)
    }
})

// Delete Route, remove a person from people
app.delete("/people/:id", async (req, res) => {
    try {
        res.json(await People.findByIdAndDelete(req.params.id, req.body))
    } catch (err){
        res.status(400).json(err)
    }
})

// Show Route, get a person by index
app.get("/people/:id", async (req, res) => {
    try {
        res.json(await People.findById(req.params.id))
    } catch (err) {
        res.status(400).json(err)
    }
})

app.listen(PORT, () => console.log(`listening to port ${PORT}`))
