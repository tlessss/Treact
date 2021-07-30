import {Fiber} from '../shared/ReactType';
import {createWorkInProgress} from './ReactFiber';
import { beginWork } from "./ReactFiberBeginWork";

let workInProgress = null;
let workInProgressRoot = null;

export function scheduleUpdateOnFiber(fiber:Fiber){
    // 找到 root 
    const root = findRoot(fiber);
    console.log(root,'root');
    performSyncWorkOnRoot(root)
}

function findRoot(fiber:Fiber){
    let child = fiber;
    let parent = fiber.return;
    while(parent !== null){
        child = parent;
        parent = parent.return
    }
    return child;
}

function performSyncWorkOnRoot(root){
    // render 阶段
    renderSyncRoot(root);
    // commit 阶段
    commitRoot(root);
}

function renderSyncRoot(root){
    parpareParams(root);
}

function parpareParams(root){
    workInProgressRoot = root.stateNode;
    workInProgress = createWorkInProgress(root);
    console.log(workInProgress,'work in progress');

    renderSyncLoop();
    
}

function renderSyncLoop(){
    while(workInProgress !== null){
        performUnitOfWork(workInProgress)
    }
}

function performUnitOfWork(unitOfWork:Fiber){
    let next = beginWork(unitOfWork);
    workInProgress = null
}

function commitRoot(root){

}