export function naiveClone<T extends { [key: string]: any }>(obj: T): T {
    const clone = { ...obj };
    for (const key in clone) {
        if (typeof clone[key] === "object" && clone[key]) {
            clone[key] = naiveClone(clone[key]);
        }
    }
    return clone;
}
