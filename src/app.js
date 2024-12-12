const express = require("express");
const { readings } = require("./readings/readings");
const { readingsData } = require("./readings/readings.data");
const { read, store } = require("./readings/readings-controller");
const { recommend, compare } = require("./price-plans/price-plans-controller");

const app = express();
app.use(express.json());

//[GOOD]: Dependency Injection (DI)
//[TODO]: Consider to centralize all DI into a file.
const { getReadings, setReadings } = readings(readingsData);

app.get("/readings/read/:smartMeterId", (req, res) => {
    res.send(read(getReadings, req));
});

app.post("/readings/store", (req, res) => {
    res.send(store(setReadings, req));
});

app.get("/price-plans/recommend/:smartMeterId", (req, res) => {
    res.send(recommend(getReadings, req));
});

app.get("/price-plans/compare-all/:smartMeterId", (req, res) => {
    res.send(compare(getReadings, req));
});

//[TEST]: implement new API which calculates the total priceof a smart meters
app.get("/readings/cost/:smartMeterId", (req, res) => {
    
});

const port = process.env.PORT || 8080;
app.listen(port);

console.log(`🚀 app listening on port ${port}`);
