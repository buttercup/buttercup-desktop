const {
    Credentials,
    MemoryDatasource,
    Vault,
    VaultFormatA,
    VaultFormatID,
    VaultSource,
    VaultSourceStatus,
    setDefaultFormat
} = require("buttercup");
const { describeSource } = require("../../../build/main/library/sources.js");

async function createTextSourceCredentials() {
    const memoryProperty = `test${Math.random()}`;
    const vault = new Vault();
    const general = vault.createGroup("General");
    general.createEntry("Login").setProperty("username", "user").setProperty("password", "test");
    const mds = new MemoryDatasource(
        Credentials.fromDatasource({ type: "memory", property: memoryProperty }, "test")
    );
    const encrypted = await mds.save(vault.format.getHistory(), Credentials.fromPassword("test"));
    const creds = Credentials.fromDatasource(
        {
            type: "memory",
            content: encrypted,
            property: memoryProperty
        },
        "test"
    );
    return creds.toSecureString();
}

describe("library/sources", function () {
    describe("describeSource", function () {
        beforeEach(async function () {
            setDefaultFormat(VaultFormatA);
            const credStr = await createTextSourceCredentials();
            this.source = new VaultSource("Test Source", "memory", credStr);
        });

        afterEach(function () {
            setDefaultFormat();
        });

        describe("when source locked", function () {
            it("returns the correct properties for a source", function () {
                const description = describeSource(this.source);
                expect(description).to.deep.equal({
                    id: this.source.id,
                    name: "Test Source",
                    state: VaultSourceStatus.Locked,
                    type: "memory",
                    order: 1000,
                    format: null
                });
            });
        });

        describe("when source unlocked", function () {
            beforeEach(async function () {
                await this.source.unlock(Credentials.fromPassword("test"), {
                    storeOfflineCopy: false
                });
            });

            it("returns the correct properties for a source", function () {
                const description = describeSource(this.source);
                expect(description).to.deep.equal({
                    id: this.source.id,
                    name: "Test Source",
                    state: VaultSourceStatus.Unlocked,
                    type: "memory",
                    order: 1000,
                    format: VaultFormatID.A
                });
            });
        });
    });
});
