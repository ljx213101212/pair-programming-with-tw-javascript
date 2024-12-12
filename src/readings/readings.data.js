const { meters } = require("../meters/meters");

//[TODO]: generateMetersReading
const generateSingle = () => {
    const startTime = 1607686125; // Friday, 11 December 2020 11:28:45 GMT+00:00
    const hour = 3600;
    const readingsLength = Math.ceil(Math.random() * 20);

    //[TODO]: consider extract the calculation of time and reading into an readings/util.js for enhancing the maintainability
    return [...new Array(readingsLength)].map((reading, index) => ({
        time: startTime - index * hour,
        reading: Math.random() * 2,
    }));
};

//[TODO]: generateAllMetersReadings
const generateAllMeters = () => {
    const readings = {};
    for (const key in meters) {
        //[CHANGE]: removed unnecessary logic
        readings[meters[key]] = generateSingle();
    }

    return readings;
};
/**
[
  {
    "smart-meter-0": [
       {
          time: 1607686125,
          reading: 1.919047897962118
       }
    ]
  }
]
*/

const readingsData = generateAllMeters();

module.exports = { readingsData };
