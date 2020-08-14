import { ITreeOptions } from 'angular-tree-component';


export class TreeConfig implements ITreeOptions {
    isExpandedField = 'expanded';
    actionMapping: any;
    allowDrag(node) {
        return node.isLeaf;
    };
    allowDrop(node, to) {
        return to.parent.data.children;
    };
    useCheckbox = false;
}
