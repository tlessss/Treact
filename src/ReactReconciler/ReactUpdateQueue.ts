import { worker } from "cluster";
import { Fiber } from "../shared/ReactType";

export const UpdateState = 0;
export const ReplaceState = 1;
export const ForceUpdate = 2;
export const CaptureUpdate = 3;

export function initUpdateQueue(fiber){
    const queue = {
        baseState:null,
        firstBaseUpdate:null,
        lastBaseUpdate:null,
        shared:{
            pending:null,
        },
        effects:null
    }
    fiber.updateQueue = queue;
}

export function enqueueUpdate(fiber,update){
    const queue = fiber.updateQueue;
    const shared = queue.shared;
    const pending = shared.pending;
    if(pending === null){
        update.next = update;
    }else{
        update.next = pending.next;
        pending.next = update;
    }
    shared.pending = update;
}

export function processUpdateQueue(fiber:Fiber){
    const queue = fiber.updateQueue;
    const shared = queue.shared;
    const pending = shared.pending;
    const lastBaseUpdate = queue.lastBaseUpdate;

    if(pending !== null){
        let lastPendingUpdate = pending;
        let firstPendingUpdate = pending.next;
        pending.next = null;
        if(lastBaseUpdate === null){
            queue.firstBaseUpdate = firstPendingUpdate;
        } else{
            queue.lastBaseUpdate.next = firstPendingUpdate;
        }
        queue.lastBaseUpdate = lastPendingUpdate;
        shared.pending = null;
    }
    
    // 处理 update 链表
    let update = queue.firstBaseUpdate;
    let newState = fiber.memoizedState;
    while(update !== null){
        newState = computeState(newState,update)
        update = update.next;
    }
    queue.firstBaseUpdate = null;
    queue.lastBaseUpdate = null;
    fiber.memoizedState = newState;
}

function computeState(oldState,update){
    switch(update.tag){
        case UpdateState:{
            const paylod =  update.payload;
            let newState = paylod;
            if(typeof paylod === 'function'){
                // 这个函数需要prevProps;
                newState = paylod()
            }
            return Object.assign({},oldState,newState)
        }
    }
}