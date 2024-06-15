import { IconName, MaybeElement, TreeNodeInfo } from "@blueprintjs/core";
import { GroupFacade, GroupID } from "buttercup";

export interface GroupTreeNodeInfo extends TreeNodeInfo<GroupFacade> {
    id: GroupID;
    label: string;
    icon: IconName | MaybeElement;
    hasCaret: boolean;
    isSelected: boolean;
    isExpanded: boolean;
    childNodes: Array<GroupTreeNodeInfo>;
    className?: string;
    isTrash: boolean;
}
