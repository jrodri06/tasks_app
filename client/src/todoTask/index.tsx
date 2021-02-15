import { FunctionComponent, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import swal from 'sweetalert';

import Subtask from '../subTask';
import SpecialInput from '../specialInput';
import { eraseTask, updateDoneStatus, getPricesTotal } from '../helperFunctions/formsRequests';

type ToDoProps = { 
    id: string,
    name: String,
    done: boolean,
    description: String,
    type: String,
    specialInput: Object,
    price: Number,
    childUpdate: React.Dispatch<React.SetStateAction<object>>
    subtask: []
}

const ToDo: FunctionComponent<ToDoProps> = ({ 
    id,
    name,
    done,
    description,
    type,
    specialInput,
    price,
    childUpdate,
    subtask
}) => {

    const [subTaskTotalPrice, setSubTaskTotalPrice] = useState(0)

    useEffect(() => {
        fetchPrices();
    })

    const fetchPrices = async () => {
        try {
            const response = await getPricesTotal(id);
            const result = +response;
            setSubTaskTotalPrice(result);
        } catch(err) {
            console.error('Could not fetch subtasks total price');
        }
    }
    
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        swal({
            title: `Are you sure you want to erase "${name}"?`,
            text: 'Once deleted, you will not be able to recover this task!',
            icon: 'warning',
            buttons: ['Cancel', true],
            dangerMode: true,
        }).then(async (willDelete) => {
            if (willDelete) {
                await eraseTask(id);

                childUpdate({
                    updateType: 'Erasure',
                    id
                });

                swal('Your task has been deleted!', {
                    icon: 'success',
                });
            } else {
                swal('Your imaginary file is safe!');
            }
        });
    }

    const updateTask = async (e: React.ChangeEvent<HTMLInputElement>) => {
        await updateDoneStatus({ 
            id,
            done: e.target.checked
        });

        childUpdate({
            updateType: 'Done_Status',
            done: e.target.checked, 
            id
        })
    }

    const history = useHistory();
    const handleRedirect = () => {
        history.push(`/add-subtask/${id}`);
    }

    return (
        <div className={"todo-task" }>
            <div className="todo-name">
                <div>
                    <input type="checkbox" onChange={updateTask} checked={done} />
                    { name }
                </div>
                { price !== null && <span className="todo-price">{ price }kr</span> }
            </div>

            <div className="todo-description">
                { description }
            </div>

            <div className={`todo-type ${type}`}>
                <span>Category</span> 

                <span>{ type }</span>
            </div>

            {
                Object.keys(specialInput).length > 0 &&
                    <SpecialInput inputs={specialInput} />
            }

            <div className="todo-subtasks">
                { subtask.length > 0 && <Subtask 
                    subtasks={subtask} 
                    subTaskTotalPrice={subTaskTotalPrice}
                /> }
                <span onClick={handleRedirect}>{'\u002B'} Add a subtask</span> 
            </div>

            <form name="task-erasure" onSubmit={handleSubmit}>
                <input type="submit" value="Delete" />
            </form>
        </div>
    )
}

export default ToDo;