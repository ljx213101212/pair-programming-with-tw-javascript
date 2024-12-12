const { meters } = require("../meters/meters");
const { readingsData } = require("./readings.data");

//[TEST]: Try to make 100% coverage of readings.data.test.js
describe("generate data", () => {
    it("should generate readings for one meter", () => {
        expect(readingsData[meters.METER0].length).toBeGreaterThan(0);
    });
});