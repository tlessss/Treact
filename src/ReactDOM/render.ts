import {createRoot} from '../ReactReconciler/ReactFiber';
import {UpdateState,enqueueUpdate} from '../ReactReconciler/ReactUpdateQueue';
import {scheduleUpdateOnFiber} from '../ReactReconciler/ReactFiberWorkLoop';

export function render(element,container){
    console.log(element,container);
    // 创建 FiberRoot
    const root = createRoot(container);
    const rootFiber = root.current;
    const update = {
        tag:UpdateState,
        payload:{element},
        next:null
    }
    enqueueUpdate(rootFiber,update);  
    
    scheduleUpdateOnFiber(rootFiber);
}