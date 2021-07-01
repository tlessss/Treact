import {createFiberRootOnContainer} from '../Reconciler/ReactFiberRoot';
import {updateContainer} from '../Reconciler/ReactFiberReconciler';
const ROOT_PARAMER = '__reactRoot'


export const render = (element,container)=>{
    // 创建Fiber root
    let root = container[ROOT_PARAMER];
    if(!root){
        root = container[ROOT_PARAMER] = createFiberRootOnContainer(container);
    }
    updateContainer(element,root);
}