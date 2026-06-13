const express = require('express');
const dbConnection = require('./db/connection');
const userRoutes = require('./routes/user.routes'); 
const noteRoutes = require('./routes/note.routes'); 

const app = express();
app.use(express.json());

dbConnection();

app.use('/users', userRoutes); 
app.use('/notes', noteRoutes); 

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});