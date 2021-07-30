import { Fiber } from "../shared/ReactType";
import { HostRoot } from "./ReactWorkTags";
import {processUpdateQueue} from './ReactUpdateQueue';
import {reconcileChildFiber} from './ReactChildFiber';

export function beginWork(workInProgress:Fiber){
    console.log(workInProgress,'begin work');
    const current = workInProgress.alternate;
    switch(workInProgress.tag){
        case HostRoot:{
            return updateHostRoot(current,workInProgress);
        }
    }
}

function updateHostRoot(current,workInProgress){
    // host root 需要处理update
    processUpdateQueue(workInProgress);

    const nextState = workInProgress.memoizedState;
    const nextChildren = nextState.element;
    const currentFirstChild = current === null ? null : current.child;

    reconcileChildFiber(workInProgress,currentFirstChild,nextChildren)
}