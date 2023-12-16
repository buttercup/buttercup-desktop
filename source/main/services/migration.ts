import { Layerr } from "layerr";
import { naiveClone } from "../../shared/library/clone";
import { AppStartMode, Config } from "../types";

export type ConfigMigration = [name: string, migration: (config: Config) => Config | null];

const MIGRATIONS: Array<ConfigMigration> = [
    [
        "startInBackground",
        (config: Config) => {
            if (
                config.preferences &&
                typeof config.preferences["startInBackground"] === "boolean"
            ) {
                const prefs = { ...config.preferences };
                prefs.startMode = config.preferences["startInBackground"]
                    ? AppStartMode.HiddenAlways
                    : AppStartMode.None;
                delete prefs["startInBackground"];
                return {
                    ...config,
                    preferences: prefs
                };
            }
            return null; //  No change
        }
    ]
];

export function runConfigMigrations(config: Config): [Config, changed: boolean] {
    let current = naiveClone(config),
        changed = false;
    for (const [name, execute] of MIGRATIONS) {
        try {
            const result = execute(current);
            if (result !== null) {
                changed = true;
                current = result;
            }
        } catch (err) {
            throw new Layerr(err, `Failed executing config migration: ${name}`);
        }
    }
    return [current, changed];
}
