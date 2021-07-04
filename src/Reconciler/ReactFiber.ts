import { NoFlags } from "./ReactFiberFlags";
import { Fiber } from "./ReactInternalTypes";
import { ClassComponent, Fragment, HostComponent, HostRoot, HostText, IndeterminateComponent, WorkTag } from "./ReactWorkTags";

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

function shouldConstruct(Component:Function){
    const prototype = Component.prototype;
    return !!(prototype && prototype.isReactComponent)
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

export function createFiberFromFragment(elements,key){
    const fiber = createFiber(Fragment,elements,key)
    return fiber;
}

export function createFiberFromElement(element){
    let owner = null;
    const type = element.type;
    const key = element.key;
    const pendingProps = element.props;
    const fiber = createFiberFromTypeAndProps(
        type,
        key,
        pendingProps,
        owner
    )
    return fiber;
}

export function createFiberFromTypeAndProps(type,key,pendingProps,owner){
    let fiberTag = IndeterminateComponent;
    let resolvedType = type;
    if(typeof type === 'function'){
        if(shouldConstruct(type)){
            fiberTag = ClassComponent;
        }
    }else if(typeof type === 'string'){
        fiberTag = HostComponent;
    }else{
        // 
    }
    const fiber = createFiber(fiberTag as WorkTag,pendingProps,key);
    fiber.elementType = type;
    fiber.type = resolvedType;
    return fiber;
}

export function createFiberFromText(content:string){
    const fiber = createFiber(HostText,content,null)
    return fiber;
}