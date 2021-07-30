
export type UpdateQueue = {
    baseState:any,
    firstBaseUpdate:Update,
    lastBaseUpdate:Update,
    shared:{
        pending:Update
    }
}

export type Update = {
    tag: 0 | 1 | 2 | 3,
    payload:any,
    next:Update
}

export type Fiber = {
    tag:any,

    type:string | null;
    elementType:string | null;
    updateQueue:UpdateQueue | null,
    key:string | null;
    pendingProps:any,
    memoizedProps:any,
    memoizedState:any,

    return:Fiber | null,
    child:Fiber | null,
    silbing:Fiber | null,
    stateNode:any, //dom 或者 FiberRoot
    alternate:Fiber | null,


    nextEffect:Fiber | null,
    firstEffect:Fiber | null,
    lastEffect:Fiber | null
}   

export type FiberRoot = {
    finshedWork:any,
    containerInfo:any
}