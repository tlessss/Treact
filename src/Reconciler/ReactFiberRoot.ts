import {createHostRootFiber} from './ReactFiber';
import {initializeUpdateQueue} from './ReactUpdateQueue';

export function createFiberRootOnContainer(container){
    const root = new FiberNodeRoot(container)
    // 创建hostRoot
    const hostRoot = createHostRootFiber();
    root.current = hostRoot;
    hostRoot.stateNode = root;
    initializeUpdateQueue(hostRoot);
    return root;
}

// Fiber root 需要的参数：containerInfo，因为只支持legacy模式，暂时不需要tag参数
function FiberNodeRoot(container){
    this.containerInfo = container;
    this.current = null;
    this.finshedWork = null;
}

// 创建host root
// 1、就是创建一个tag为HostRoot的FiberNode
// 2、FiberNode需要的参数：tag、
