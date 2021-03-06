import { FunctionComponent, useState } from 'react';

import SubtaskView from './SubtaskView';
import { updateSubTaskDone } from '../helperFunctions/requestsHandlers';
import { localTasks } from '../helperFunctions/localStorageHandlers';

type SubtaskProps = {
    subtasks: []
    subTaskTotalPrice: Number
}

const Subtask: FunctionComponent<SubtaskProps> = ({ 
    subtasks,
    subTaskTotalPrice
}) => {
    const [done, setDone] = useState({});

    const updateSubtask = async () => {
        await updateSubTaskDone(done);

        const localStorage = localTasks.getTasks();
        if(localStorage.length > 0) {
            const d: any = done;
            const currentTask = localStorage.find((task: { tempIdentifier: string }) => task.tempIdentifier === d.parentTempId);
            if(currentTask !== undefined){
                localTasks.updateSubtaskFromList(done);
            }
        }

        setDone({});
    };

    const dragOver = (e: any) => {
        e.preventDefault();
    };

    if(Object.keys(done).length > 0) {
        updateSubtask();
    };

    return (
        <div className="subtasks-area" onDragOver={dragOver}>
            { subTaskTotalPrice > 0 && 
                <div className="subtask-total-price">
                    <span>Total: {subTaskTotalPrice}kr</span>
                </div> 
            }
            
            {
                subtasks.map((elements: {
                    done: boolean
                    name: string
                    parentTempId: string 
                    _id: string
                    subtaskTempId: string
                    price: number
                }, i) => {
                    return <SubtaskView 
                        key={elements._id ? elements._id : i} 
                        id={elements._id}
                        done={elements.done} 
                        name={elements.name} 
                        subtaskTempId={elements.subtaskTempId}
                        price={elements.price}
                        parentTempId={elements.parentTempId} 
                        update={setDone}
                    />
                })
            }
        </div>
    )
}

export default Subtask;