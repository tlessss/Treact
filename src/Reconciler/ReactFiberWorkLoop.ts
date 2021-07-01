import { Fiber, FiberRoot } from "./ReactInternalTypes";
import { HostRoot } from "./ReactWorkTags";
import {createWorkInProgress} from './ReactFiber';
import {beginWork} from './ReactFiberBeginWork';

let workInProgressRoot = null;
let workInProgress = null;

export function scheduleUpdateOnFiber(fiber){
    // 从这个Fiber节点开始更新，到根节点。
    // 1、找到root
    // 2、进入render阶段
    const root = markUpdateLaneFromFiberToRoot(fiber);
    performSyncWorkOnRoot(root);
}

function markUpdateLaneFromFiberToRoot(sourceFiber:Fiber){
    // 找到根节点
    let node = sourceFiber;
    let parent = node.return;
    while(parent !== null){
        node = parent;
        parent = parent.return;
    }
    if(node.tag === HostRoot){
        const root:FiberRoot = node.stateNode;
        return root;
    }else{
        return null;
    }
}

function performSyncWorkOnRoot(root:FiberRoot){
    let existStatus = renderRootSync(root);

}


function renderRootSync(root:FiberRoot){
    prepareFreshStack(root);
    workLoopSync();
}

function prepareFreshStack(root){
    workInProgressRoot = root;
    workInProgress = createWorkInProgress(root.current,null);
}

function workLoopSync(){
    // while(workInProgress !== null){
        performUnitOfWork(workInProgress);
    // }
}

function performUnitOfWork(unitOfWork:Fiber){
    // 根据现在的workInProgress创造子Fiber
    const current = unitOfWork.alternate;
    console.log(unitOfWork,'unit of work');
    
    let next = beginWork(current,unitOfWork);

}