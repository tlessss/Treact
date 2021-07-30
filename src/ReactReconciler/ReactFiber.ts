import {HostRoot} from './ReactWorkTags';
import {initUpdateQueue} from './ReactUpdateQueue';
import {Fiber} from '../shared/ReactType';

export function createRoot(container){
    const fiberRoot = new FiberRoot(container);
    const rootFiber = new FiberNode(HostRoot,null,null);
    fiberRoot.current = rootFiber;
    rootFiber.stateNode = fiberRoot;

    initUpdateQueue(rootFiber);
    
    return fiberRoot;
}

export function createWorkInProgress(current:Fiber){
    // 创建 workInProgress 函数要判断是否已经创建过了。
    // 一个完整的Fiber的构建流程？
    // 创建的时候只有tag、pendingProps和key参数，其他参数都需要之后赋值
    const workInProgress = new FiberNode(current.tag,current.key,current.pendingProps);
    // 这里还有很多参数要同步
    workInProgress.memoizedState = current.memoizedState;
    workInProgress.updateQueue = current.updateQueue;
    
    return workInProgress;
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

