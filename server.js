"use strict";

const e = require('express');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use (express.json());

const stationsRouter = require('./routes/stations')
const metroRouter = require('./routes/metro')

app.use('/stations', stationsRouter);
app.use('/', metroRouter);

app.get('/', (req, res) => {
    res.send('Hello World!');
    }
);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    }

);
