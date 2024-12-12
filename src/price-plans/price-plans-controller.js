const { pricePlans } = require("./price-plans");
const { usageForAllPricePlans } = require("../usage/usage");

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
const compare = (getData, req) => {
    const meter = req.params.smartMeterId;
    const pricePlanComparisons = usageForAllPricePlans(pricePlans, getData(meter));
    return {
        smartMeterId: req.params.smartMeterId,
        pricePlanComparisons,
    };
};

module.exports = { recommend, compare };
