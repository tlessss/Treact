import { FiberRoot } from "./ReactInternalTypes";
import {createUpdate,Update} from './ReactUpdateQueue';
import {enqueueUpdate} from './ReactUpdateQueue';
import {scheduleUpdateOnFiber} from './ReactFiberWorkLoop';


export function updateContainer(element,container:FiberRoot){
    // 将子节点加入到 updateQueue，并进入下一阶段
    const current = container.current;
    const update = createUpdate() as Update;
    update.payload = {element};

    enqueueUpdate(current,update);
    // 下面要进入 beginWork 阶段了
    scheduleUpdateOnFiber(current);

    // return lane;
}