import { Fiber } from "../shared/ReactType";
import { HostComponent, HostRoot } from "./ReactWorkTags";
import {processUpdateQueue} from './ReactUpdateQueue';
import {reconcileChildFiber} from './ReactChildFiber';
import { REACT_ELEMENT_TYPE } from "../shared/ReactSymbols";

export function beginWork(workInProgress:Fiber){
    console.log(workInProgress,'begin work');
    const current = workInProgress.alternate;
    switch(workInProgress.tag){
        case HostRoot:{
            return updateHostRoot(current,workInProgress);
        };
        case HostComponent:{
            return updateHostComponent(current,workInProgress)
        }
    }
}

function updateHostRoot(current,workInProgress){
    // host root 需要处理update
    processUpdateQueue(workInProgress);

    const nextState = workInProgress.memoizedState;
    const nextChildren = nextState.element;
    const currentFirstChild = current === null ? null : current.child;

    const child = reconcileChildFiber(workInProgress,currentFirstChild,nextChildren)
    
    return child;
}

function updateHostComponent(current,workInProgress){
    // ******
    // 
    console.log(workInProgress,'update host component');
    
    const props = workInProgress.pendingProps;
    const {element} = props;
    if(typeof element=== 'string' || typeof element === 'number'){

    }
    

}