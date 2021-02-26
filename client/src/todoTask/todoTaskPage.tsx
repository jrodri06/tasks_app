import { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import swal from 'sweetalert';

import Subtask from '../subTask';
import SpecialInput from './specialInput';
import { getUserCookie } from '../helperFunctions/getCookie';
import { eraseTask, updateDoneStatus, getPricesTotal, getTask } from '../helperFunctions/requestsHandlers';
import { localTasks } from '../helperFunctions/localStorageHandlers';

interface TodoProps {
    userCookie: string,
    lastUpdatedBy: string,
    name: string,
    description: string,
    type: string,
    specialInput: {
        fooCarbs?: number,
        foodFat?: number,
        foodProtein?: number,
        workDeadline?: string
    },
    subtask: [],
    price: number | null,
    tempIdentifier: string
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
        subtask: [],
        price: null,
        tempIdentifier: '',
        done: false,
        _id: ''
    });

    const [deleted, setDeleted] = useState(false);
    const [lastUpdateUser, setLastUpdateUser] = useState('');

    const location: any = useLocation();

    useEffect(() => {
        console.log('Use Effect');
        
        const renderTask = async () => {
            let selectedTask;
            const path = window.location.pathname;
            const pathDivided = path.split('/');
            const userOrigin = pathDivided[pathDivided.length - 1];
    
            // User from external link needs to fetch task details
            if(location.state === undefined) {
                const tempId = pathDivided[pathDivided.length - 2];
                try {
                    const response = await getTask(tempId, userOrigin);
                    selectedTask = response;
                } catch(err) {
                    return swal('You are offline', `${err}` , 'error');
                }   
            } else {
                const localStorage = localTasks.getTasks();
                
                selectedTask = JSON.parse(location.state);
            }
    
            if(selectedTask === undefined) {
                setDeleted(true);
            } else {
                setTask(selectedTask);
            }
        };

        const checkLastEdit = () => {
            const cookieVal = getUserCookie();
    
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
    }, [location.state, task.lastUpdatedBy]);

    const history = useHistory();

    const backToDashboard = () =>{
        history.push('/');
    };

    const handleRedirect = () => {
        history.push(`/add-subtask/${task.tempIdentifier}`);
    };

    const editPage = () => {
        const t = JSON.stringify(task);

        history.push({
            pathname: `/edit-task/${task.tempIdentifier}/${task.userCookie}`,
            state: t
        });
    }

    const updateTask = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const checked = e.target.checked;

        setTask({ ...task, done: checked });

        await updateDoneStatus({ 
            id: task._id!,
            done: checked,
            tempIdentifier: task.tempIdentifier!
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
                    await eraseTask(task._id!, task.tempIdentifier!);


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

    const copyLink = () => {
        if(!navigator.onLine) {
            return swal('Cannot copy', 'You seem to be offline', 'error');
        }

        if(navigator.clipboard === undefined) {
            swal('Cannot copy', 'To be able to copy please go to the https version of the website', 'error');
        }
        const link = window.location.href;
        navigator.clipboard.writeText(link)
            .then(() => swal('Copied!', 'You copied the link successfully', 'success'))
            .catch(() => swal('Opps', 'Could not copy the link', 'error'))
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

                <button onClick={ copyLink } className="copy-clipboard">
                    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M4 1.5H3a2 2 0 00-2 2V14a2 2 0 002 2h10a2 2 0 002-2V3.5a2 2 0 00-2-2h-1v1h1a1 1 0 011 1V14a1 1 0 01-1 1H3a1 1 0 01-1-1V3.5a1 1 0 011-1h1v-1z" clipRule="evenodd"></path>
                        <path fillRule="evenodd" d="M9.5 1h-3a.5.5 0 00-.5.5v1a.5.5 0 00.5.5h3a.5.5 0 00.5-.5v-1a.5.5 0 00-.5-.5zm-3-1A1.5 1.5 0 005 1.5v1A1.5 1.5 0 006.5 4h3A1.5 1.5 0 0011 2.5v-1A1.5 1.5 0 009.5 0h-3z" clipRule="evenodd"></path>
                    </svg>
                </button>

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
                        subTaskTotalPrice={getPricesTotal(task.tempIdentifier!)}
                    /> }
                </div>

                <button className="edit-btn" onClick={editPage}>Edit</button>

                <button name="task-erasure" className="taskErasure" onClick={handleDeleteSubmit} type="submit">Delete</button>
            </div>
        </div>
    )
}

export default TodoTaskPage;