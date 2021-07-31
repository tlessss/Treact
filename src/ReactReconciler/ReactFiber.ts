import {ClassComponent, HostComponent, HostRoot, HostText, IndeterminateComponent} from './ReactWorkTags';
import {initUpdateQueue} from './ReactUpdateQueue';
import {Fiber} from '../shared/ReactType';
import { NoFlags } from './ReactFiberFlags';

export function createRoot(container){
    const fiberRoot = new FiberRoot(container);
    const rootFiber = new FiberNode(HostRoot,null,null);
    fiberRoot.current = rootFiber;
    rootFiber.stateNode = fiberRoot;

    initUpdateQueue(rootFiber);
    
    return fiberRoot;
}

export function createFiber(tag,pendingProps,key){
    return new FiberNode(tag,pendingProps,key)
}

function FiberRoot(container){
    this.containerInfo = container;
    this.finishedWork = null;
}

function FiberNode(tag,pendingProps,key){
    this.tag = tag;
    this.pendingProps = pendingProps;
    this.key = key;
    this.elementType = null;
    this.type = null;
    this.stateNode = null;
    this.return = null;
    this.child = null;
    this.sibling = null;
    this.memoizedProps = null;
    this.updateQueue = null;
    this.memoizedState = null;
    this.flags = null;
    this.deletions = null;
    this.nextEffect = null;
    this.firstEffect = null;
    this.lastEffect = null;
    this.alternate = null;
}

export function useFiber(current,props){
    // ******
    const clone = createWorkInProgress(current,props)
    clone.index = 0;
    clone.sibling = null;
    return clone;
}

export function createFiberFromElement(element){
    // ****** 这里的逻辑还很生疏
    const type = element.type;
    const key = element.key;
    const props = element.props;
    return createFiberFromTypeAndProps(type,key,props);
}

function shouldConstruct(Component:Function){
    const prototype = Component.prototype;
    return !!(prototype && prototype.isReactComponent);
}


function createWorkInProgress(current,pendingProps){
    let workInProgress = current.alternate;
    if(workInProgress === null){
        workInProgress = createFiber(current.tag,pendingProps,current.key);
        workInProgress.elementType = current.elementType;
        workInProgress.type = current.type;
        workInProgress.stateNode = current.stateNode;
    }else{
        workInProgress.pendingProps = pendingProps;
        workInProgress.type = current.type;
        workInProgress.flags = NoFlags;
        workInProgress.nextEffect = null;
        workInProgress.firstEffect = null;
        workInProgress.lastEffect = null;
    }
    workInProgress.child = current.child;
    workInProgress.memoizedProps = current.memoizedProps;
    workInProgress.memoizedState = current.memoizedState;
    workInProgress.updateQueue = current.updateQueue;
    workInProgress.sibling = current.sibling;
    workInProgress.index = current.index;
    workInProgress.ref = current.ref;
}

export function createHostRootFiber(){
    return createFiber(HostRoot,null,null)
}

export function createFiberFromTypeAndProps(type,key,props){
    let fiberTag = IndeterminateComponent;
    let resolvedType = type;
    if(typeof type === 'function'){
        // class | function
        if(shouldConstruct(type)){
            // class
            fiberTag = ClassComponent
        }
    }else if(typeof type === 'string'){
        fiberTag = HostComponent
    }
    const fiber = createFiber(fiberTag,props,key);
    fiber.elementType = type;
    fiber.type = resolvedType;
    return fiber
}

export function createFiberFromText(content){
    return createFiber(HostText,content,null)
}
