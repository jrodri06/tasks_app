import { FunctionComponent } from 'react';
import { useHistory } from 'react-router-dom';

import swal from 'sweetalert';

import Subtask from '../subTask';
import SpecialInput from './specialInput';
import { eraseTask, updateDoneStatus, getPricesTotal } from '../helperFunctions/requestsHandlers';

type ToDoProps = { 
    id: string
    name: String
    done: boolean
    description: String
    type: String
    specialInput: Object
    displayDone?: string 
    price: Number
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
    displayDone,
    subtask
}) => {

    const history = useHistory();
    const handleRedirect = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.stopPropagation();
        history.push(`/add-subtask/${id}`);
    };

    const editPage = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.stopPropagation();
        history.push(`/edit-task/${id}`);
    }

    const blockPropagation = (e: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
        e.stopPropagation();
    }

    const updateTask = (e: React.ChangeEvent<HTMLInputElement>) => {
        const checked = e.target.checked;

        // opacity animation 
        if(e.target.parentElement?.parentElement?.parentElement?.classList.contains('todo-task')){
            e.target.parentElement?.parentElement?.parentElement?.classList.add('hide-todo');
        }

        // Update when animation is concluded
        setTimeout(async () => {
            await updateDoneStatus({ 
                id,
                done: checked
            });
    
            childUpdate({
                updateType: 'Done_Status',
                done: checked, 
                id
            })

        }, 250)

    };

    const handleDeleteSubmit = async (e: React.MouseEvent) => {
        e.stopPropagation();

        swal({
            title: `Are you sure you want to erase "${name}"?`,
            text: 'Once deleted, you will not be able to recover this task!',
            icon: 'warning',
            buttons: ['Cancel', true],
            dangerMode: true,
        })
            .then(async (willDelete) => {
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
                    swal('Your task is safe!');
                }
            })
            .catch(err => {
                swal('Something went wrong', `${err}`, 'error');
            })
    };

    const taskPage = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        history.push(`/task/${id}`);
    };

    return (
        <div className={ done ? `todo-task task-concluded ${displayDone}` : "todo-task" } onClick={ taskPage }>
            <div className="todo-header">
                <div className="todo-name">
                    <input 
                        type="checkbox" 
                        onChange={updateTask} 
                        onClick={blockPropagation}
                        checked={done} 
                    />
                    { name }
                </div>
                { price !== null && <span className="todo-price">{ price }kr</span> }
            </div>

            <h3 className="todo-description">
                { description }
            </h3>

            <div className={`todo-type ${type}`}>
                <span>Category</span> 
                <span>{ type }</span>
            </div>

            { Object.keys(specialInput).length > 0 && <SpecialInput inputs={specialInput} /> }

            <div className="todo-subtasks">
                <span 
                    onClick={handleRedirect} 
                    className="add-subtask"
                >
                    {'\u002B'} Add a subtask
                </span> 
                { subtask.length > 0 && <Subtask 
                    subtasks={subtask} 
                    subTaskTotalPrice={getPricesTotal(id)}
                /> }
            </div>

            <button className="edit-btn" onClick={editPage}>Edit</button>

            <button name="task-erasure" className="taskErasure" onClick={handleDeleteSubmit} type="submit">Delete</button>
        </div>
    )
}

export default ToDo;