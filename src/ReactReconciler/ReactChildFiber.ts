import { REACT_ELEMENT_TYPE } from "../shared/ReactSymbols";

export function reconcileChildFiber(returnFiber,currentFirstChild,element){
    const isObject = typeof element === 'object' && element !== null;
    if(isObject){
        switch(element.$$typeof){
            case REACT_ELEMENT_TYPE:{
                reconcileSingleElement(returnFiber,currentFirstChild,element);
            }
        }
    }
}

function reconcileSingleElement(returnFiber,currentFirstChild,element){
    
}