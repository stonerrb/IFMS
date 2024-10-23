const express = require('express');
const cors = require('cors');
require('../db/mongoose');
// import routes

// ---------------------------- MAIN ------------------------- // 

const app = express();
const port = 5050;

app.use(express.json());
app.use(cors());


app.listen(port, () => {
    console.log(`Server is running on ${port}`);
})

module.exports = {app};