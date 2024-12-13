const average = (readings) => {
    return (
        readings.reduce((prev, next) => prev + next.reading, 0) /
        readings.length
    );
};

const timeElapsedInHours = (readings) => {
    readings.sort((a, b) => a.time - b.time);
    const seconds = readings[readings.length - 1].time - readings[0].time;
    const hours = Math.floor(seconds / 3600);
    return hours;
};

const readingsWithinTimeRange = (readings, startDate, endDate) => {
    const timeStart = dayInSeconds(startDate);
    const timeEnd = dayInSeconds(endDate);
   
    return readings.filter((reading) => timeStart <= reading.time && reading.time <= timeEnd);
}

const dayInSeconds = (isoDate) => new Date(isoDate).getTime() / 1000;

const isValidISODate = (isoString) => !isNaN(Date.parse(isoString)) 

const usage = (readings) => {
    return average(readings) * timeElapsedInHours(readings);
};

const usageCost = (readings, rate) => {
    return usage(readings) * rate;
};

const usageForAllPricePlans = (pricePlans, readings) => {
    return Object.entries(pricePlans).map(([key, value]) => {
        return {
            [key]: usageCost(readings, value.rate),
        };
    });
};

module.exports = {
    average,
    timeElapsedInHours,
    usage,
    usageCost,
    usageForAllPricePlans,
    readingsWithinTimeRange,
    isValidISODate
};
