const { meters, meterPricePlanMap } = require("../meters/meters");
const { pricePlanNames } = require("./price-plans");
const { readings } = require("../readings/readings");
const { compare, recommend, totalCostWithinTimeRange } = require("./price-plans-controller");
const { NO_PRICE_PLAN_ERROR, invalidDateError } = require("../constants");
const { query } = require("express");

describe("price plans", () => {
    it("should compare usage cost for all price plans", () => {
        const { getReadings } = readings({
            [meters.METER0]: [
                { time: 1607686125, reading: 0.26785 },
                { time: 1607599724, reading: 0.26785 },
                { time: 1607513324, reading: 0.26785 },
            ],
        });

        const expected = {
            pricePlanComparisons: [
                {
                    [pricePlanNames.PRICEPLAN0]: 0.26785 * 48 * 10,
                },
                {
                    [pricePlanNames.PRICEPLAN1]: 0.26785 * 48 * 2,
                },
                {
                    [pricePlanNames.PRICEPLAN2]: 0.26785 * 48 * 1,
                },
            ],
            smartMeterId: meters.METER0
        };

        const recommendation = compare(getReadings, {
            params: {
                smartMeterId: meters.METER0,
            },
            query: {}
        });

        expect(recommendation).toEqual(expected);
    });

    it("should recommend usage cost for all price plans by ordering from cheapest to expensive", () => {
        const { getReadings } = readings({
            [meters.METER0]: [
                { time: 1607686125, reading: 0.26785 },
                { time: 1607599724, reading: 0.26785 },
                { time: 1607513324, reading: 0.26785 },
            ],
        });

        const expected = [
            {
                [pricePlanNames.PRICEPLAN2]: 0.26785 * 48 * 1,
            },
            {
                [pricePlanNames.PRICEPLAN1]: 0.26785 * 48 * 2,
            },
            {
                [pricePlanNames.PRICEPLAN0]: 0.26785 * 48 * 10,
            },
        ];

        const recommendation = recommend(getReadings, {
            params: {
                smartMeterId: meters.METER0,
            },
            query: {}
        });

        expect(recommendation).toEqual(expected);
    });

    it("should limit recommendation", () => {
        const { getReadings } = readings({
            [meters.METER0]: [
                { time: 1607686125, reading: 0.26785 },
                { time: 1607599724, reading: 0.26785 },
                { time: 1607513324, reading: 0.26785 },
            ],
        });

        const expected = [
            {
                [pricePlanNames.PRICEPLAN2]: 0.26785 * 48 * 1,
            },
            {
                [pricePlanNames.PRICEPLAN1]: 0.26785 * 48 * 2,
            },
        ];

        const recommendation = recommend(getReadings, {
            params: {
                smartMeterId: meters.METER0,
            },
            query: {
                limit: 2
            }
        });

        expect(recommendation).toEqual(expected);
    });

    it("should calculate the total cost within last 7 days", () => {

        const testStart = "2024-12-06";
        const testEnd = "2024-12-13";

        const startDate = new Date(testStart).getTime() / 1000;
        const endDate = new Date(testEnd).getTime() / 1000; //in seconds
        const readingUnit = 0.2;

        const numOfvalidReadings = 4;
        const totalValidReading =  numOfvalidReadings * readingUnit;
        const timeInHours = (endDate - startDate) / 3600;
        const averageReading = totalValidReading / numOfvalidReadings;
        const energyConsumed = averageReading * timeInHours; //kwh
        const expectedCost = {
            smartMeterId: meters.METER0,
            totalCost: energyConsumed * meterPricePlanMap[meters.METER0].rate
        }

        const { getReadings } = readings({
            [meters.METER0]: [
                { time: endDate, reading: readingUnit }, 
                { time: startDate, reading: readingUnit} //cover unsorted scenario
            ],
        });

        const actualCost = totalCostWithinTimeRange(getReadings, {
            params: {
                smartMeterId: meters.METER0,
            },
            query: {
                startDate: testStart,
                endDate: testEnd
            }
        });
        expect(actualCost).toEqual(expectedCost);
    });

    it("should throw error for meters without a plan", () => {
        const testStart = "2024-12-06";
        const testEnd = "2024-12-13";

        const startDate = new Date(testStart).getTime() / 1000;
        const endDate = new Date(testEnd).getTime() / 1000; //in seconds
        const readingUnit = 0.2;

        const { getReadings } = readings({
            [meters.METER3]: [ //meters without a plan
                { time: startDate, reading: readingUnit },
                { time: endDate, reading: readingUnit }, 
            ],
        });

        const actualCostFn = () => {
            return totalCostWithinTimeRange(getReadings, {
                params: {
                    smartMeterId: meters.METER3,
                },
                query: {
                    startDate: testStart,
                    endDate: testEnd
                }
            });
        }
        expect(actualCostFn).toThrow(NO_PRICE_PLAN_ERROR);
    })

    it("shoud throw error for startDate is not a valid iso string", () => {

        const testStart = "xxxx-xx-xx";
        const testEnd = "2024-12-13";

        const { getReadings } = readings({
            [meters.METER0]: [ //meters without a plan
                { time: 12345, reading: 0.2 },
                { time: 12346, reading: 0.2 }, 
            ],
        });

        const actualCostFn = () => {
            return totalCostWithinTimeRange(getReadings, {
                params: {
                    smartMeterId: meters.METER0,
                },
                query: {
                    startDate: testStart,
                    endDate: testEnd
                }
            });
        }
        expect(actualCostFn).toThrow(invalidDateError("startDate", testStart));
    })

    it("shoud throw error for endDate is not a valid iso string", () => {

        const testStart = "2024-12-06";
        const testEnd = "xxxx-xx-xx";

        const { getReadings } = readings({
            [meters.METER0]: [ //meters without a plan
                { time: 12345, reading: 0.2 },
                { time: 12346, reading: 0.2 }, 
            ],
        });

        const actualCostFn = () => {
            return totalCostWithinTimeRange(getReadings, {
                params: {
                    smartMeterId: meters.METER0,
                },
                query: {
                    startDate: testStart,
                    endDate: testEnd
                }
            });
        }
        expect(actualCostFn).toThrow(invalidDateError("endDate", testEnd));
    })
});
