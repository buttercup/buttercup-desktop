import { init } from "buttercup";

module.exports = async function (globalConfig, projectConfig) {
    if (!globalThis.bcupInitd) {
        globalThis.bcupInitd = true;
        init();
    }
};
