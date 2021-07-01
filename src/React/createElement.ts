import {REACT_ELEMENT_TYPE} from '../shared/ReactSymbols';

export function createElement(type,props,children){
    // react 要的是 key props type]
    if(props === null) props = {};
    const {key} = props;
    const childLength = arguments.length - 2;
    const childArray = Array(childLength);
    for(let i = 0;i<childLength;i++){
        childArray[i] = arguments[i + 2];
    }
    props.children = childArray;

    return ReactElement(type,key,props);
}

function ReactElement(type,key,config){
    const element = {
        $$typeof:REACT_ELEMENT_TYPE,
        type:type,
        key:key,
        props:config
    }
    return element;
}