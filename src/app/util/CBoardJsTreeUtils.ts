import * as $ from 'jquery';
import * as _ from 'lodash';



/**
 *
 * Configuration for DataSet/Widget/Dashboard tree
 */
let jsTreeConfig1 = {
    core: {
        multiple: false,
        animation: true,
        error: (error) => { },
        check_callback: (operation, node, nodeParent, nodePosition, more) => {
            if (operation === 'move_node') {
                return nodeParent.id.substring(0, 6) === 'parent' || nodeParent.id.substring(0, 4) === 'root';
            }
            return true;
        },
        worker: true
    },
    types: {
        default: {
            valid_children: ['default', 'file']
        },
        file: {
            icon: 'glyphicon glyphicon-file'
        }
    },
    dnd: {
        check_while_dragging: true
    },
    state: { key: 'cboard' },
    version: 1,
    plugins: ['types', 'unique', 'state', 'sort', 'dnd']
};

/**
 * Holds all jstree related functions and variables, including the actual class and methods to create, access and manipulate instances.
 * @param domID
 */
function jstree_GetWholeTree(domID) {
    return $(`#${domID}`).jstree(true);
}

/**
 * get an array of all selected nodes
 * @returns {jQuery}
 */
function jstree_GetSelectedNodes(domID) {
    return jstree_GetWholeTree(domID).get_selected(true);
}

/**
 *
 * @param listIn [{
 *      "id": id,
 *      "name": name,
 *      "categoryName": folder[/subfolder]*
 *      }]
 * @returns {Array}
 */
function jstree_CvtVPath2TreeData(listIn) {
    let newParentId = 1;
    let listOut = [];
    listOut.push({ id: 'root', parent: '#', text: 'Root', state: { opened: true } });
    for (let i = 0; i < listIn.length; i++) {
        let arr = listIn[i].categoryName.split('/');
        arr.push(listIn[i].name);
        let parent = 'root';
        for (let j = 0; j < arr.length; j++) {
            let flag = false;
            let a = arr[j],
                m;
            for (m = 0; m < listOut.length; m++) {
                if (listOut[m].text === a && listOut[m].parent === parent && listOut[m].id.substring(0, 6) === 'parent') {
                    flag = true;
                    break;
                }
            }
            if (!flag) {
                if (j === arr.length - 1) {
                    listOut.push({
                        id: listIn[i].id.toString(),
                        parent: parent,
                        text: a,
                        icon: 'glyphicon glyphicon-file'
                    });
                } else {
                    listOut.push({
                        id: `parent${newParentId}`,
                        parent: parent,
                        text: a
                    });
                }
                parent = `parent${newParentId}`;
                newParentId++;
            } else {
                parent = listOut[m].id;
            }
        }
    }
    return listOut;
}

function jstree_CheckTreeNode(actionType, treeID, popup?) {
    let selectedNodes = jstree_GetSelectedNodes(treeID);
    if (selectedNodes === undefined) {
        return false;
    } else if (selectedNodes.length === 0) {
        popup('Please, select one widget first!', 'modal-warning', 'lg');
        return false;
    } else if (typeof (selectedNodes[0].children) !== 'undefined' && selectedNodes[0].children.length > 0) {
        popup(`Can't ${actionType} a folder!`, 'modal-warning', 'lg');
        return false;
    } else {
        return true;
    }
}

function jstree_ReloadTree(treeID, treeData, ngScope) {
    jstree_GetWholeTree(treeID).settings.core.data = treeData;
    jstree_GetWholeTree(treeID).refresh();
}

/**
 *
 * @param paramObj {
 *      "actionType": tag,
 *      "treeID": treeID,
 *      "copyFunc": function,
 *      "node": selectedNode:
 * }
 * @returns {Function}
 */
function jstree_CopyNode(paramObj) {
    return function () {
        if (!jstree_CheckTreeNode(paramObj.actionType, paramObj.treeID)) {
            return;
        }
        paramObj.copyFunction(paramObj.oldNode);
    }
}

/**
 * {
 *   treeID: xx,
 *   ngScope: $scope,
 *   ngHttp: $http,
 *   ngTimeout $timeout,
 *   listName: "widgetList",
 *   updateUrl: xxx
 * }
 * @param option
 * @returns {{ready: ready, activate_node: activate_node, dblclick: dblclick, move_node: move_node}}
 */
function jstree_baseTreeEventsObj(option) {
    return {
        ready: () => {
            option.ngTimeout(() => {
                option.ngScope.ignoreChanges = false;
            });
        },
        activate_node: (obj, e) => {
            let myJsTree = jstree_GetWholeTree(option.treeID);
            let data = myJsTree.get_selected(true)[0];
            if (data.children.length > 0) {
                myJsTree.deselect_node(data);
                myJsTree.toggle_node(data);
            }
        },
        dblclick: function () {
            let selectedNodes = jstree_GetSelectedNodes(option.treeID);
            if (selectedNodes.length === 0) {
                return; // Ignore double click folder action
            }
            option.ngScope.editNode();
        },
        move_node: (e, data) => {
            let updateItem = (nodeid, newCategory) => {
                let item = _.find(option.ngScope[option.listName], (i) => { return i.id === nodeid; });
                item.categoryName = newCategory;
                option.ngHttp.post(option.updateUrl, { json: $.toJson(item) }).success((serviceStatus) => {
                    if (serviceStatus.status === '1') {
                        // console.log('success!');
                    } else {
                        option.ModalUtils.alert(serviceStatus.msg, 'modal-warning', 'lg');
                    }
                });
            };

            let updateNode = (node, tarPath) => {
                let children = node.children;
                if (children.length === 0) {
                    updateItem(node.id, tarPath);
                } else {
                    let newTarPath = tarPath === '' ? node.text : `${tarPath}/${node.text}`;
                    for (let i = 0; i < children.length; i++) {
                        let child = myJsTree.get_node(children[i]);
                        updateNode(child, newTarPath);
                    }
                }
            };

            let myJsTree = jstree_GetWholeTree(option.treeID),
                curNode = data.node,
                tarNodeID = data.parent;
            let tarPath = myJsTree.get_path(tarNodeID, '/').substring(5);
            updateNode(curNode, tarPath);
        }
    }
}
