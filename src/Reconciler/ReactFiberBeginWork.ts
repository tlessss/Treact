import { Fiber } from "./ReactInternalTypes";
import { HostRoot } from "./ReactWorkTags";
import {processUpdateQueue} from './ReactUpdateQueue';

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
    processUpdateQueue(workInProgress,nextProps,null);

}