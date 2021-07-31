import { REACT_ELEMENT_TYPE } from "../shared/ReactSymbols";
import { Fiber } from "../shared/ReactType";
import {Deletion} from './ReactFiberFlags';
import {useFiber,createFiberFromElement} from './ReactFiber';

export function reconcileChildFiber(returnFiber,currentFirstChild,element){
    const isObject = typeof element === 'object' && element !== null;
    if(isObject){
        switch(element.$$typeof){
            case REACT_ELEMENT_TYPE:{
                return reconcileSingleElement(returnFiber,currentFirstChild,element);
            }
        }
    }
}

function reconcileSingleElement(returnFiber,currentFirstChild,element){
    // 先判断能不能复用
    // 按照目前的逻辑，进入这里的element不会是纯文本
    let child = currentFirstChild;
    while(child !== null){
        let key = child.key;
        if(element.key === key){
            deleteRemainingChild(returnFiber,child.silbing);
            if(child.elementType === element.type){
                // 可以复用
                const existing = useFiber(child,element.props);
                existing.return = returnFiber;
                return existing;
            }else{
                deleteChild(returnFiber,child);
                const created = createFiberFromElement(element);
                created.return = returnFiber;
                return created;
            }
        }else{
            deleteChild(returnFiber,child);
        }
        child = child.silbing
    }
    const created = createFiberFromElement(element);
    created.return = returnFiber;
    
    return created;
}

function deleteRemainingChild(returnFiber:Fiber,currentFirstChild){ 
    let child = currentFirstChild;
    while(child !== null){
        deleteChild(returnFiber,child);
        child = child.silbing;
    }
}

function deleteChild(returnFiber:Fiber,childToDelete){
    // 删除子元素的逻辑
    /**
     * 1、给父元素的effect表上加上这个元素
     * 2、在这个元素上加上Deletion的标志
     */
    let last = returnFiber.lastEffect;
    if(last === null){
        returnFiber.firstEffect = childToDelete;
    }else{
        returnFiber.lastEffect.nextEffect = childToDelete;
    }
    returnFiber.lastEffect = childToDelete;
    // *****
    childToDelete.nextEffect = null;
    childToDelete.flags = Deletion;
}