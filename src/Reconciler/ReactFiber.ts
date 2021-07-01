import { NoFlags } from "./ReactFiberFlags";
import { Fiber } from "./ReactInternalTypes";
import { HostRoot, WorkTag } from "./ReactWorkTags";

export function createHostRootFiber(){
    // 只是要创建一个tag为hostRoot的fiberNode
    return createFiber(HostRoot,null,null)
}

function createFiber(tag:WorkTag,pendingProps,key:string|null){
    return new FiberNode(tag,pendingProps,key)
}

function FiberNode(tag:WorkTag,pendingProps,key:string | null){
    this.tag = tag;
    this.key = key;
    this.elementType = null;
    this.type  = null;
    this.stateNode = null;

    // Fiber
    this.return = null;
    this.child = null;
    this.sibling = null;
    this.index = 0;

    this.pendingProps = pendingProps;
    this.momeizedProps = null;
    this.updateQueue = null;
    this.memoizedState = null;

    // this.dependencies = null;
    // this.mode = mode;

    this.flags = NoFlags;
    // this.subtreeFlags = NoFlags;
    this.deletions = null;
    this.alternate = null;
}

export function createWorkInProgress(current:Fiber,pendingProps:any){
    // 创建和current一样的fiber
    let workInProgress = current.alternate;
    if(workInProgress === null){
        // 首屏渲染这里应该都是null
        workInProgress = createFiber(
            current.tag,
            pendingProps,
            current.key
        )
        workInProgress.elementType = current.elementType;
        workInProgress.type = current.type;
        workInProgress.stateNode = current.stateNode;
        workInProgress.alternate = current;
        current.alternate = workInProgress;
    }

    workInProgress.child = current.child;
    workInProgress.memoizedProps = current.memoizedProps;
    workInProgress.memoizedState = current.memoizedState;
    workInProgress.updateQueue = current.updateQueue;
    workInProgress.slibing = current.slibing;
    workInProgress.index = current.index;

    return workInProgress;
}