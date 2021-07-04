export type Source = {
    fileName:string,
    lineNumber:string
}

export type ReactElement = {
    $$typeof:any,
    type:any,
    key:any,
    ref:any,
    props:any,
    // ReactFiber
    _owner:any
}