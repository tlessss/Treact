import { Fiber } from "./ReactInternalTypes";

export const UpdateState = 0;
export const ReplaceState = 1;
export const ForceUpdate = 2;
export const CaptureUpdate = 3;

export type Update= {
    tag:0 | 1 | 2 | 3,
    payload:any | null,
    next:Update | null
}

type SharedQueue = {
    pending:Update
}

export type UpdateQueue = {
    baseState:any,
    shared:SharedQueue,
    firstBaseUpdate:Update | null,
    laseBaseUpdate:Update | null,
    effects:Array<Update> | null

}

export function initializeUpdateQueue(fiber:Fiber){
    // 初始化updateQueue
    const queue = {
        baseState:fiber.memoizedState,
        firstBaseUpdate:null,
        lastBaseUpdate:null,
        shared:{
            pending:null
        },
        effects:null
    }
    fiber.updateQueue = queue;
}

export function createUpdate(){
    const update = {
        tag:UpdateState,
        payload:null,
        next:null
    }
    return update;
}

export function enqueueUpdate(current:Fiber,update:Update){
    // 这一步的作用应该是把update 放到pending上
    const updateQueue = current.updateQueue;
    const pending = updateQueue.shared.pending;//这里有，说明在这次进入之前已经有未处理的update了
    updateQueue.shared.pending = null;
    if(pending !== null){
        update.next = pending.next;
        pending.next = update;
    }else{
        update.next = update
    }
    updateQueue.shared.pending = update;
}

export function processUpdateQueue(workInProgress:Fiber,props,instance){
    // 执行 update，得到最终的state
    const queue = workInProgress.updateQueue;
    let firstBaseUpdate = queue.firstBaseUpdate;
    let lastBaseUpdate = queue.lastBaseUpdate;
    
    let pending = queue.shared.pending;
    if(pending!==null){
        queue.shared.pending = null;
        
    }
}