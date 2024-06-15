import { EntryFacade, GroupFacade, GroupID, VaultFacade } from "buttercup";
import { sortBy, prop, compose, toLower, reverse } from "ramda";
import { GroupTreeNodeInfo } from "../types";

export function countChildGroups(facade: VaultFacade, parentGroupID: GroupID) {
    const groups = getAllGroupsInGroup(facade, parentGroupID);
    return groups.length;
}

export function countChildGroupsAndEntries(facade: VaultFacade, parentGroupID: GroupID) {
    const groups = getAllGroupsInGroup(facade, parentGroupID);
    let count = groups.length;
    groups.forEach((group) => {
        count += getAllEntriesInGroup(facade, group.id as string).length;
    });
    return count;
}

export function filterNestedGroups(
    groups: Array<GroupTreeNodeInfo> = [],
    term = ""
): Array<GroupTreeNodeInfo> {
    if (term === "") {
        return groups;
    }

    return groups.filter((group) => {
        if (Array.isArray(group.childNodes) && group.childNodes.length > 0) {
            group.childNodes = filterNestedGroups(group.childNodes, term);
        }
        return (
            group.label.toLowerCase().includes(term.toLowerCase()) || group.childNodes.length > 0
        );
    });
}

export const getAllEntriesInGroup = (facade: VaultFacade, groupID: GroupID) => {
    const allGroups = getAllGroupsInGroup(facade, groupID, true);
    return allGroups.reduce((output: Array<EntryFacade>, group: GroupFacade) => {
        return [...output, ...facade.entries.filter((entry) => entry.parentID === group.id)];
    }, []);
};

export const getAllGroupsInGroup = (
    facade: VaultFacade,
    groupID: GroupID,
    includeParent: boolean = false
) => {
    const groups = includeParent
        ? [facade.groups.find((g) => g.id === groupID) as GroupFacade]
        : [];
    facade.groups.forEach((group) => {
        if (group.parentID === groupID) {
            groups.push(group);
            groups.push(...getAllGroupsInGroup(facade, group.id as string));
        }
    });
    return groups;
};

export function getNestedGroups(
    groups: Array<GroupFacade> = [],
    selectedGroupID: GroupID | null,
    expandedGroups: Array<GroupID>,
    parentID: GroupID = "0",
    allowTrash = false
): Array<GroupTreeNodeInfo> {
    return groups
        .filter(
            (group) =>
                group.parentID === parentID &&
                (allowTrash || (!allowTrash && group.attributes.bc_group_role !== "trash"))
        )
        .map((group) => {
            const childNodes = getNestedGroups(
                groups,
                selectedGroupID,
                expandedGroups,
                group.id as string
            );
            const isExpanded = expandedGroups.includes(group.id as string);
            const isTrash = isTrashGroup(group);
            return {
                id: group.id as string,
                label: group.title,
                icon: isTrash ? "trash" : isExpanded ? "folder-open" : "folder-close",
                hasCaret: childNodes.length > 0,
                isSelected: group.id === selectedGroupID,
                isExpanded,
                childNodes,
                className: "node",
                isTrash,
                nodeData: group
            } satisfies GroupTreeNodeInfo;
        });
}

export const isTrashGroup = (group: GroupFacade) =>
    group.attributes && group.attributes.bc_group_role === "trash";

export function sortGroups(
    groups: Array<GroupFacade> = [],
    asc: boolean = true
): Array<GroupFacade> {
    const sortByTitleCaseInsensitive = sortBy(compose(toLower, prop("title")));
    const sorted = sortByTitleCaseInsensitive(groups);
    return asc ? sorted : reverse(sorted);
}
