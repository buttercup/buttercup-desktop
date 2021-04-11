const { Credentials, VaultSource, VaultSourceStatus } = require("buttercup");
const { describeSource } = require("../../../build/main/library/sources.js");

describe("library/sources", function () {
    describe("describeSource", function () {
        beforeEach(async function () {
            const creds = Credentials.fromDatasource(
                {
                    type: "googledrive",
                    fileID: "x123",
                    token: "abc",
                    refreshToken: "abc"
                },
                "test"
            );
            const credStr = await creds.toSecureString();
            this.source = new VaultSource("Test Source", "googledrive", credStr);
        });

        it("returns the correct properties for a source", function () {
            const description = describeSource(this.source);
            expect(description).to.deep.equal({
                id: this.source.id,
                name: "Test Source",
                state: VaultSourceStatus.Locked,
                type: "googledrive"
            });
        });
    });
});
