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
    userCookie: String
    lastUpdatedBy: string
    tempIdentifier: string
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
    userCookie,
    lastUpdatedBy,
    price,
    tempIdentifier,
    childUpdate,
    displayDone,
    subtask
}) => {

    const history = useHistory();
    const handleRedirect = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.stopPropagation();
        history.push(`/add-subtask/${tempIdentifier}`);
    };

    const editPage = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.stopPropagation();

        const task = JSON.stringify({
            _id: id,
            name,
            done,
            description,
            type,
            specialInput,
            userCookie,
            lastUpdatedBy,
            price,
            tempIdentifier,
            subtask
        });

        history.push({
            pathname: `/edit-task/${tempIdentifier}/${userCookie}`,
            state: task
        })
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
                done: checked,
                tempIdentifier
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
                    await eraseTask(id, tempIdentifier);

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
        const task = JSON.stringify({
            _id: id,
            name,
            done,
            description,
            type,
            specialInput,
            userCookie,
            lastUpdatedBy,
            price,
            tempIdentifier,
            subtask,
            childUpdate
        });

        history.push({
            pathname: `/task/${tempIdentifier}/${userCookie}`,
            state: task
        });
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

            {
                Object.keys(specialInput) !== undefined && 
                Object.keys(specialInput).length > 0 && 

                <SpecialInput inputs={specialInput} /> 
            }

            <div className="todo-subtasks">
                <span 
                    onClick={handleRedirect} 
                    className="add-subtask"
                >
                    {'\u002B'} Add a subtask
                </span> 
                { subtask !== undefined && subtask.length > 0 && <Subtask 
                    subtasks={subtask} 
                    subTaskTotalPrice={getPricesTotal(tempIdentifier)}
                /> }
            </div>

            <button className="edit-btn" onClick={editPage}>Edit</button>

            <button name="task-erasure" className="taskErasure" onClick={handleDeleteSubmit} type="submit">Delete</button>
        </div>
    )
}

export default ToDo;