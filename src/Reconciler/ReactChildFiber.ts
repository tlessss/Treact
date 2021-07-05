import { Fiber } from "./ReactInternalTypes";
import {REACT_ELEMENT_TYPE, REACT_FRAGMENT_TYPE} from '../shared/ReactSymbols';
import {ReactElement} from '../shared/ReactElementType';
import { Deletion, Placement } from "./ReactFiberFlags";
import { createWorkInProgress,createFiberFromFragment,createFiberFromElement,createFiberFromText } from "./ReactFiber";
import { Fragment, HostText } from "./ReactWorkTags";

const isArray = Array.isArray;

function ChildReconciler(shouldTrackSideEffects){
  // 上面这个参数首次为false
  function placeSingleChild(newFiber:Fiber){
    if(shouldTrackSideEffects && newFiber.alternate === null){
      newFiber.flags = Placement;
    }
    return newFiber;
  }
  function updateSlot(
    returnFiber:Fiber,
    oldFiber:Fiber|null,
    newChild:any
  ){
    // Update the fiber if the keys match,otherwise return null;
    const key = oldFiber !== null ? oldFiber.key : null;
    if(typeof newChild === 'string' || typeof newChild === 'number'){
      if(key !== null){
        return null
      }
      return updateTextNode(returnFiber,oldFiber,""+newChild);
    }
    if(typeof newChild === 'object' && newChild !== null){
      switch(newChild.$$typeof){
        case REACT_ELEMENT_TYPE:{
          if(newChild.key === key){
            if(newChild.type === REACT_FRAGMENT_TYPE){
              return updateFragment(
                returnFiber,
                oldFiber,
                newChild.props.children,
                key
              )
            }
            return updateElement(returnFiber,oldFiber,newChild)
          }else{
            return null;
          }
        }
      }
    }
    return null;
  }
  function updateTextNode(returnFiber:Fiber,current:Fiber | null,textContent:string){
    if(current === null || current.tag !== HostText){
      const created = createFiberFromText(textContent)
      created.return = returnFiber;
      return created
    }else{
      const existing = useFiber(current,textContent);
      existing.return = returnFiber;
      return existing;
    }
  }
  function updateFragment(returnFiber:Fiber,current:Fiber | null,fragment,key){
    if(current === null || current.tag !== Fragment){
      const created = createFiberFromFragment(
        fragment,
        key
      )
      created.return = returnFiber;
      return created;
    }else{
      const existing = useFiber(current,fragment);
      existing.return = returnFiber;
      return existing;
    }
  }
  function updateElement(returnFiber:Fiber,current:Fiber | null,element:ReactElement){
    if(current !== null){
      // Update
      if(current.elementType === element.type){
        const existing = useFiber(current,element.props);
        existing.return = returnFiber;
        return existing;
      }
    }
    // Insert 
    const created = createFiberFromElement(element);
    created.return = returnFiber;
    return created
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
    // 这里是多节点的diff，diff算法的整体逻辑会经历两轮遍历：
    // 第一轮遍历：处理更新的节点
    // 第二轮遍历：处理剩下的不属于更新的节点
    /**
     * 第一轮遍历
     * 1、遍历newChildren，将newChildren[i]与oldFiber比较，判断DOM节点是否可复用。
     * 2、如果可复用，继续遍历
     * 3、如果不可复用，分两种情况：
     *    * key不同导致不可复用，立即跳出遍历，第一轮遍历结束。
     *    * key相同type不同导致不可复用，会将oldFiber标记为DELETION，并继续遍历。
     * 4、如果newChildren遍历完，或者oldFiber遍历完，跳出遍历，第一轮遍历结束。
     * 
     */

     /**
      * 当遍历结束后，会有两种结果：
      * 步骤3跳出的遍历：
      *  此时newChildren没有遍历完，oldFiber也没有遍历完。
      * 步骤4跳出的遍历：
      *  可能newChildren遍历完，或oldFiber遍历完，或同时遍历完。带着第一轮的遍历结果，开始第二轮的遍历结果。
      */

      /**
       * 第二轮遍历
       * 1、newChildren与oldFiber同时遍历完，只需在第一轮遍历进行组件更新。此时diff结束
       * 2、newChildren没遍历完，oldFIber遍历完。
       *  已有的DOM节点都复用了，此时还有新加入的节点，意味着本次更新有新节点的加入，只需要遍历剩下的newChildren为生成的Fiber标记Placement。
       * 3、newChildren遍历完，oldFiber没遍历完。删除剩下的节点。
       * 4、newChildren和oldFiber都没遍历完。
       *  下面重点讲
       */

       /**
        * newChildren和oldFiber都没有遍历完。说明有节点更改了位置。
        * 
        * 1、处理移动的节点：
        *   要用key来找对应的DOM节点。为了快速找到key对应的DOM节点，将所有未处理的oldFiber存入以key为key，oldFiber为value的Map中。
        *   接下来遍历newChildren，通过key就能在上面那个Map中找到key相同的oldFiber。
        * 2、标记节点是否移动。
        *   节点是否移动是以什么为参照物？
        *   我们的参照物是：最后一个可复用的节点在oldFiber中的位置索引。
        *   由于本次更新中节点是按newChildren的顺序排列。在遍历newChildren的过程中，
        * 每个遍历到的可复用节点一定是当前遍历到的所有可复用节点中最靠右的那个。
        *   那么我们只需要比较遍历到的可复用节点在上次更新时是否也在后面，就能知道两次更新中这两个节点的相对位置是否改变。
        *   我们用oldIndex表示遍历到的可复用节点在oldFiber中的位置索引。如果oldIndex < lastPlaceIndex，代表本次更新该节点需要向右移动。
        */
    let resultingFirstChild = null;
    let previousNewFiber = null;

    let oldFiber = currentFirstChild;
    let lastPlaceIndex = 0;
    let newIdx = 0;
    let nextOldFiber = null;
    for(;oldFiber !== null && newIdx < newChildren.length;newIdx++){
      if(oldFiber.index > newIdx){
        // 为啥会有这种情况？
        nextOldFiber = oldFiber;
        oldFiber = null;
      }else{
        nextOldFiber = oldFiber.slibing;
      }
      const newFiber = updateSlot(
        returnFiber,
        oldFiber,
        newChildren[newIdx]
      )
      if(newFiber === null){
        if(oldFiber === null){
          oldFiber = nextOldFiber;
        }
        break;
      }
      if(shouldTrackSideEffects){
        if(oldFiber && newFiber.alternate === null){
          deleteChild(returnFiber,oldFiber);
        }
      }
      lastPlaceIndex = placeChild(newFiber,lastPlaceIndex,newIdx);

    }
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