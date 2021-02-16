import { FunctionComponent, useState } from 'react';

import SubtaskView from './SubtaskView';
import { updateSubTaskDone } from '../helperFunctions/formsRequests';

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
        setDone({});
    }

    if(Object.keys(done).length > 0) {
        updateSubtask();
    }

    return (
        <div className="subtasks-area">
            { subTaskTotalPrice > 0 && 
                <div className="subtask-total-price">
                    <span>Total: {subTaskTotalPrice}kr</span>
                </div> 
            }
            
            {
                subtasks.map((elements: {
                    done: boolean
                    name: String
                    parentId: String 
                    _id: string
                    price: Number
                }) => {
                    return <SubtaskView 
                        key={elements._id} 
                        id={elements._id}
                        done={elements.done} 
                        name={elements.name} 
                        price={elements.price}
                        update={setDone}
                    />
                })
            }
        </div>
    )
}

export default Subtask;