import { Fiber } from "./ReactInternalTypes";
import { HostRoot } from "./ReactWorkTags";
import {processUpdateQueue} from './ReactUpdateQueue';
import {reconcileChildFibers,mountChildFibers} from './ReactChildFiber';

export function beginWork(current:Fiber,workInProgress:Fiber){
    // 根据tag不同，进入不同的逻辑
    switch(workInProgress.tag){
        case HostRoot:{
            return updateHostRoot(current,workInProgress);
        }
    }
}

function updateHostRoot(current:Fiber,workInProgress:Fiber){
    const udpateQueue = workInProgress.updateQueue;
    const nextProps = workInProgress.pendingProps;
    const prevState = workInProgress.memoizedState;
    const prevChildren = prevState === null ? null : prevState.element;

    // 暂时不知道这行代码的作用是啥
    // cloneUpdateQueue(current,workInProgress) 
    // 到这里Fiber的子元素被放到了memoizedState的element属性上了
    processUpdateQueue(workInProgress,nextProps,null);
    console.log(workInProgress,'处理过state后的workInProgress');
    const nextState = workInProgress.memoizedState;
    const nextChildren = nextState.element;

    const root = workInProgress.stateNode;
    reconcileChildren(current,workInProgress,nextChildren)
    return workInProgress.child;
}

function reconcileChildren(current:Fiber,workInProgress:Fiber,nextChildren:any){
    if(current === null)   {
        workInProgress.child = mountChildFibers(
            workInProgress,
            null,
            nextChildren
        )
    }else{
        workInProgress.child = reconcileChildFibers(
            workInProgress,
            current.child,
            nextChildren
        )
    }
}