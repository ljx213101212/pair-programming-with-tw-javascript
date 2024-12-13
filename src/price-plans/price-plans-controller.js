const { pricePlans } = require("./price-plans");
const { usageForAllPricePlans, usageCost, readingsWithinTimeRange, isValidISODate} = require("../usage/usage");
const { meterPricePlanMap } = require("../meters/meters");
const { NO_PRICE_PLAN_ERROR, invalidDateError } = require("../constants");

const recommend = (getReadings, req) => {
    const meter = req.params.smartMeterId;
    //[TODO]: consider to rename pricePlanComparisons to sortedPricePlanComparisons
    const pricePlanComparisons = usageForAllPricePlans(pricePlans, getReadings(meter)).sort((a, b) => extractCost(a) - extractCost(b))
    //[TODO]: centrialize the constants.
    if("limit" in req.query) {
        return pricePlanComparisons.slice(0, req.query.limit);
    }
    return pricePlanComparisons; //from cost low to high
};

const extractCost = (cost) => {
    const [, value] = Object.entries(cost).find( ([key]) => key in pricePlans)
    return value
}

//[TODO]: Consider a more meaningful name, such as: getPricePlanComparisons
//[TODO]: Consider to update getData to getReadings to align with naming convensions.
const compare = (getReadings, req) => {
    const meter = req.params.smartMeterId;
    const pricePlanComparisons = usageForAllPricePlans(pricePlans, getReadings(meter));
    return {
        smartMeterId: req.params.smartMeterId,
        pricePlanComparisons,
    };
};

const totalCostWithinTimeRange = (getReadings, req) => {
    //[TODO]
    const meter = req.params.smartMeterId;
    const { startDate, endDate } = req.query;

    if (!meterPricePlanMap.hasOwnProperty(meter)) {
        throw(NO_PRICE_PLAN_ERROR);
    }
    if (!isValidISODate(startDate)) {
        throw(invalidDateError("startDate", startDate));
    }
    if (! isValidISODate(endDate)) {
        throw(invalidDateError("endDate", endDate));
    }

    const readingsInRange = readingsWithinTimeRange(getReadings(meter), startDate, endDate)
    const totalCost = readingsInRange.length >= 2 ? usageCost(readingsInRange, meterPricePlanMap[meter].rate) : 0;
    return {
        smartMeterId: meter,
        totalCost,
    };
}

module.exports = { recommend, compare, totalCostWithinTimeRange };
