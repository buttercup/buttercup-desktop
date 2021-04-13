const path = require("path");
const { Application } = require("spectron");
const electronPath = require("electron");

describe("Buttercup application", function () {
    beforeEach(async function () {
        this.app = new Application({
            path: electronPath,
            args: [path.join(__dirname, "../..")]
        });
        await this.app.start();
    });

    afterEach(async function () {
        if (this.app && this.app.isRunning()) {
            await this.app.stop();
        }
    });

    it("shows initial window", async function () {
        const windowCount = await this.app.client.getWindowCount();
        expect(windowCount).to.equal(1);
    });
});
