import {REACT_ELEMENT_TYPE} from '../shared/ReactSymbols';

export function createElement(type,props,children){ 
    const configs = props || {};
    const key = configs.key;
    let childLength = arguments.length - 2;
    let childList = new Array(childLength);
    if(childLength > 1){
        for(let i = 0;i<childLength;i++){
            childList[i] = arguments[i+2]
        }
    }else{
        childList = children;
    }

    configs.children = childList;

    return {
        $$typeof:REACT_ELEMENT_TYPE,
        key,
        props:configs,
        type:type
    }
    
}