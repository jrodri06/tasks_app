import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

import swal from 'sweetalert';

import Subtask from '../subTask';
import SpecialInput from './specialInput';
import { eraseTask, updateDoneStatus, getPricesTotal, getTask } from '../helperFunctions/requestsHandlers';

interface TodoProps {
    userCookie: String,
    lastUpdatedBy: String,
    name: String,
    description: String,
    type: String,
    specialInput: {
        fooCarbs?: Number,
        foodFat?: Number,
        foodProtein?: Number,
        workDeadline?: string
    },
    subtask: [],
    price: Number | null,
    done: boolean,
    _id: string
}

const TodoTaskPage = () => {

    const [task, setTask] = useState<Partial<TodoProps>>({
        userCookie: '',
        lastUpdatedBy: '',
        name: '',
        description: '',
        type: 'Other',
        specialInput: {},
        price: null,
        done: false,
        _id: ''
    });

    const [deleted, setDeleted] = useState(false);

    const [lastUpdateUser, setLastUpdateUser] = useState('');

    useEffect(() => {
        const checkLastEdit = () => {
            const existingCookies = document.cookie;
            const getVal = existingCookies.split('=');
    
            const name = getVal[getVal.length - 2];
            const cookieVal = name === 'tasksListUbi' ? getVal[getVal.length - 1] : '';
    
            if(cookieVal === '') {
                setLastUpdateUser('Last updated by someone else');
            } else if(cookieVal === task.lastUpdatedBy) {
                setLastUpdateUser('Last updated by you');
            } else {
                setLastUpdateUser('Last updated by someone else');
            }
        };

        renderTask();
        setDeleted(false);
        checkLastEdit();
    }, [task.lastUpdatedBy]);

    const renderTask = async () => {
        const path = window.location.pathname;
        const pathDivided = path.split('/');
        const taskId = pathDivided[pathDivided.length - 2];
        const userOrigin = pathDivided[pathDivided.length - 1];

        const selectedTask = await getTask(taskId, userOrigin);
        console.log(selectedTask);

        if(selectedTask === undefined) {
            setDeleted(true);
        } else {
            setTask(selectedTask);
        }
    };

    const history = useHistory();

    const backToDashboard = () =>{
        history.push('/');
    };

    const handleRedirect = () => {
        history.push(`/add-subtask/${task._id}`);
    };

    const editPage = () => {
        history.push(`/edit-task/${task._id}`);
    }

    const updateTask = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const checked = e.target.checked;

        setTask({ ...task, done: checked });

        await updateDoneStatus({ 
            id: task._id!,
            done: checked
        });
    };

    const handleDeleteSubmit = async () => {
        swal({
            title: `Are you sure you want to erase "${task.name}"?`,
            text: 'Once deleted, you will not be able to recover this task!',
            icon: 'warning',
            buttons: ['Cancel', true],
            dangerMode: true,
        })
            .then(async (willDelete) => {
                if (willDelete) {
                    await eraseTask(task._id!);


                    swal('Your task has been deleted!', {
                        icon: 'success',
                    });

                    setDeleted(true);
                } else {
                    swal('Your task is safe!');
                }
            })
            .catch(err => {
                swal('Something went wrong', `${err}`, 'error');
            })
    };

    if(deleted) {
        return (
            <div className="task-view">
                <button 
                    onClick={backToDashboard} 
                    className="dashboard-btn">
                        Dashboard
                </button>

                <div className="no-tasks">Nothing to see here {'😳'}</div>
            </div>
        )
    };

    return (
        <div className="task-view">
            <button 
                onClick={backToDashboard} 
                className="dashboard-btn">
                    Dashboard
            </button>

            <div className="todo-task">
                <span className="last-update-by">{ lastUpdateUser }</span>
                <div className="todo-header">
                    <div className="todo-name">
                        <input 
                            type="checkbox" 
                            onChange={ updateTask } 
                            checked={ task.done } 
                        />
                        { task.name }
                    </div>
                    { task.price !== null && <span className="todo-price">{ task.price }kr</span> }
                </div>

                <h3 className="todo-description">
                    { task.description }
                </h3>

                <div className={`todo-type ${ task.type }`}>
                    <span>Category</span> 
                    <span>{ task.type }</span>
                </div>

                { Object.keys(task.specialInput!).length > 0 && <SpecialInput inputs={task.specialInput!} /> }

                <div className="todo-subtasks">
                    <span 
                        onClick={handleRedirect} 
                        className="add-subtask"
                    >
                        {'\u002B'} Add a subtask
                    </span> 
                    { task.subtask !== undefined && task.subtask!.length > 0 && <Subtask 
                        subtasks={task.subtask!} 
                        subTaskTotalPrice={getPricesTotal(task._id!)}
                    /> }
                </div>

                <button className="edit-btn" onClick={editPage}>Edit</button>

                <button name="task-erasure" className="taskErasure" onClick={handleDeleteSubmit} type="submit">Delete</button>
            </div>
        </div>
    )
}

export default TodoTaskPage;