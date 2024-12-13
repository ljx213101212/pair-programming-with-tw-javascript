const NO_PRICE_PLAN_ERROR = "Error! Current meter has no price plan.";

const invalidDateError = (param, value) => {
    return `Error: ${param}: ${value} is not in valid ISO 8601 format.`;
}

module.exports = {
    NO_PRICE_PLAN_ERROR,
    invalidDateError
}