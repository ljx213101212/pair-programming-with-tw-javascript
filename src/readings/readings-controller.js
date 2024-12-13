const read = (getData, req) => {
    const meter = req.params.smartMeterId;
    return getData(meter);
};

const store = (setData, req) => {
    const data = req.body;
    //[TODO]: add input data validation to make sure only allow valid data.
    return setData(data.smartMeterId, data.electricityReadings);
};

/**
{
    "smartMeterId": "smart-meter-0",
    "electricityReadings": [
        {
            "time": 1607689999,
            "reading": 2.0
        }
    ]
}
*/

module.exports = { read, store };
