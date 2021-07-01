import { NoFlags } from "./ReactFiberFlags";
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