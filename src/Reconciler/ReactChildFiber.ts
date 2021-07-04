import { Fiber } from "./ReactInternalTypes";
import {REACT_ELEMENT_TYPE, REACT_FRAGMENT_TYPE} from '../shared/ReactSymbols';
import {ReactElement} from '../shared/ReactElementType';
import { Deletion, Placement } from "./ReactFiberFlags";
import { createWorkInProgress,createFiberFromFragment,createFiberFromElement,createFiberFromText } from "./ReactFiber";
import { HostText } from "./ReactWorkTags";

const isArray = Array.isArray;

function ChildReconciler(shouldTrackSideEffects){
  // 上面这个参数首次为false
  function placeSingleChild(newFiber:Fiber){
    if(shouldTrackSideEffects && newFiber.alternate === null){
      newFiber.flags = Placement;
    }
    return newFiber;
  }
  function reconcileSingleElement(returnFiber:Fiber,currentFirstChild:Fiber,element:ReactElement){
    const key = element.key;
    let child = currentFirstChild;
    while(child !== null){
      if(child.key === key && child.elementType === element.type){
        // 可复用
        deleteRemainingChildren(returnFiber,child.slibing);
        const existing = useFiber(child,element.type)
        existing.return = returnFiber;
        return existing;
      }else{
        deleteChild(returnFiber,child)
      }
      child = child.slibing;
    }
    if(element.type === REACT_FRAGMENT_TYPE){
      const created = createFiberFromFragment(
        element.props.children,
        key
      )
      created.return = returnFiber;
      return created;
    }else{
      const created = createFiberFromElement(
        element
      )
      created.return = returnFiber;
      return created;
    }
  }

  function deleteRemainingChildren(returnFiber:Fiber,currentFirstChild:Fiber){
    if(!shouldTrackSideEffects){
      return null;
    }
    let childToDelete = currentFirstChild;
    while(childToDelete !== null){
      deleteChild(returnFiber,childToDelete);
      childToDelete = childToDelete.slibing;
    }
    return null;
  }

  function deleteChild(returnFiber:Fiber,childToDelete:Fiber){
    if(shouldTrackSideEffects){
      return;
    }
    const last = childToDelete.lastEffect;
    if(last !== null){
      last.nextEffect = childToDelete;
      childToDelete.lastEffect = childToDelete;
    }else{
      returnFiber.firstEffect = returnFiber.lastEffect = childToDelete;
    }
    childToDelete.nextEffect = null;
    childToDelete.flags = Deletion;
  }

  function reconcileSingleTextNode(returnFiber:Fiber,currentFirstChild:Fiber|null,textContent:string):Fiber{
    if(currentFirstChild!==null && currentFirstChild.tag === HostText){
      deleteRemainingChildren(returnFiber,currentFirstChild.slibing);
      const existing = useFiber(currentFirstChild,textContent);
      existing.return = returnFiber;
      return existing;
    }
    deleteRemainingChildren(returnFiber,currentFirstChild);
    const created = createFiberFromText(textContent);
    created.return = returnFiber;
    return created;
  }

  function useFiber(fiber:Fiber,pendingProps:any){
    const clone = createWorkInProgress(fiber,pendingProps);
    clone.index = 0;
    clone.slibing = null;
    return clone;
  }
  function reconcileChildrenArray(returnFiber:Fiber,currentFirstChild:Fiber | null,newChildren:any[]):Fiber | null{
    let resultingFirstChild = null;
    let previousNewFiber = null;

    let oldFiber = currentFirstChild;
    let lastPlaceIndex = 0;
    let newIdx = 0;
    let nextOldFiber = null;
    // for(;oldFiber !== null && newIdx < newChildren.length;newIdx++){
    //   if(oldFiber.index > newIdx){
    //     nextOldFiber = oldFiber;
    //     oldFiber = null;
    //   }else{
    //     nextOldFiber = oldFiber.slibing;
    //   }
    //   const newFiber = updateSlot(
    //     returnFiber,
    //     oldFiber,
    //     newChildren[newIdx]
    //   )

    // }
  }
    function reconcileChildFibers(returnFiber:Fiber,currentFirstChild:Fiber | null,newChild:any){
        // 把element里的子element生成Fiber放到fiber里的child属性上
      const isUnkeyedTopLevelFragment =
        typeof newChild === 'object' &&
        newChild !== null &&

        newChild.type === REACT_FRAGMENT_TYPE &&
        newChild.key === null;
      if (isUnkeyedTopLevelFragment) {
        newChild = newChild.props.children;
      }
      const isObject = typeof newChild === 'object' && newChild !== null;
      if(isObject){
        switch(newChild.$$typeof){
          case REACT_ELEMENT_TYPE:{
            return placeSingleChild(
              reconcileSingleElement(
                returnFiber,
                currentFirstChild,
                newChild
              )
            )
          }
        }
      }

      if(typeof newChild === 'string' || typeof newChild === 'number'){
        return placeSingleChild(
          reconcileSingleTextNode(
            returnFiber,
            currentFirstChild,
            ''+newChild
          )
        )
      }
      if(isArray(newChild)){
        return reconcileChildrenArray(
          returnFiber,
          currentFirstChild,
          newChild
        )
      }
      return deleteRemainingChildren(returnFiber, currentFirstChild);
    }
    return reconcileChildFibers;
}


export const reconcileChildFibers = ChildReconciler(true);
export const mountChildFibers = ChildReconciler(false);