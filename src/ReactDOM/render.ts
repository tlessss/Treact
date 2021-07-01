import {createFiberRootOnContainer} from '../Reconciler/ReactFiberRoot';
const ROOT_PARAMER = '__reactRoot'


export const render = (element,container)=>{
    // 创建Fiber root
    let root = container[ROOT_PARAMER];
    if(!root){
        root = container[ROOT_PARAMER] = createFiberRootOnContainer(container);
    }
    console.log(root,'fiber root');
}