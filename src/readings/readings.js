const readings = (data) => ({
    getReadings: (meterId) => data[meterId] || [],
    setReadings: (meterId, readings) => {
        const currentReadings = data[meterId];
        data[meterId] = [...currentReadings, ...readings];
        return data[meterId];
    },
    // calculateTotalCost: (meterId) => {
    //     const readings = data[meterId] || [];
    //     let ans = 0;
    //     readings.reduce((acc, cur) => acc + cur.reading)
    // }
});

/**
getReadings:

 [
    {
        time: 1607686125,
        reading: 1.919047897962118
    }
]
 */

module.exports = { readings };
