import { VaultSource, VaultSourceStatus, init } from "buttercup";
import { describeSource } from "./sources";

function getFakeSource() {
    return new VaultSource("Test", "dropbox", "");
}

beforeAll(() => {
    init();
});

test("outputs ID and name", () => {
    const output = describeSource(getFakeSource());
    expect(output).toHaveProperty("id");
    expect(output).toHaveProperty("name", "Test");
    expect(output.id).toMatch(/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/);
});

test("outputs correct state", () => {
    const output = describeSource(getFakeSource());
    expect(output).toHaveProperty("state", VaultSourceStatus.Locked);
});

test("outputs correct type", () => {
    const output = describeSource(getFakeSource());
    expect(output).toHaveProperty("type", "dropbox");
});
