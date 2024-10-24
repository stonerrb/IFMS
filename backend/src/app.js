const express = require('express');
const cors = require('cors');
require('../db/mongoose');
// import routes

const userRoute = require('../routes/userRoute');
const floorRoute = require('../routes/floorRoute');

// ---------------------------- MAIN ------------------------- // 

const app = express();
const port = 5050;

app.use(express.json());
app.use(cors());
app.use(userRoute); 
app.use(floorRoute);

app.listen(port, () => {
    console.log(`Server is running on ${port}`);
})

module.exports = {app};