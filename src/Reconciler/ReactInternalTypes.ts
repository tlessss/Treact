import {WorkTag} from './ReactWorkTags';
import {Flags} from './ReactFiberFlags';


export type Fiber = {
    tag:WorkTag,
    elementType:any,
    type:any,
    stateNode:any,
    child:Fiber | null,
    return:Fiber|null,
    slibing:Fiber|null,
    key:string | null,
    index:number,

    pendingProps:any,
    memoizedProps:any,
    updateQueue:any,
    memoizedState:any,

    flags:Flags,
    deletions:Array<Fiber> | null,
    nextEffect:Fiber | null,
    firstEffect : Fiber | null,
    lastEffect : Fiber | null,
    alternate:Fiber | null
}

export type FiberRoot = {
    current:Fiber|null,
    containerInfo:any,
    finishedWork:Fiber|null
}