const express = require("express");
const { readings } = require("./readings/readings");
const { readingsData } = require("./readings/readings.data");
const { read, store } = require("./readings/readings-controller");
const { recommend, compare, totalCostWithinTimeRange } = require("./price-plans/price-plans-controller");

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

app.get("/price-plans/total-cost/:smartMeterId", (req, res) => {
    try {
        const result = totalCostWithinTimeRange(getReadings, req);
        res.send(result);
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({ message: error || "Internal Server Error" });
    }
});

//Calculate today'slast 7 days total cost for given smartMeterId

/***
 1. API -> total cost
 2. TDD -> implmenet unit test, assume the dummy result of the function
 3. implement
 */


const port = process.env.PORT || 8080;
app.listen(port);

console.log(`🚀 app listening on port ${port}`);
