import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import swal from 'sweetalert';

import ToDo from '../todoTask';
import { collectToDos, convertSubToMain } from '../helperFunctions/requestsHandlers';

const Dashboard = () => {
    const [data, setData] = useState([]);
    const [childUpdate, setChildUpdate] = useState({});
    const [showFilterOptions, setShowFilterOptions] = useState(false);
    const [displayDoneTasks, setDisplayDoneTasks] = useState(false);

    useEffect(() => {
        collectToDos((allTodos: any) => setData(allTodos));
    }, [childUpdate]);

    const history = useHistory();
    const changeRoute = () => {
        const path = '/new-todo';
        history.push(path);
    }

    // Drop subtask in Dashboard
    const drop = async (e: React.DragEvent<HTMLElement>) => {
        e.preventDefault();
        const subtaskBody = JSON.parse(e.dataTransfer.getData('subtask_body'));

        if (subtaskBody.subtaskTempId === '') {
            swal('Something went wrong', 'You might be offline, please try again', 'error');
        } else {
            const response = await convertSubToMain(subtaskBody);

            setChildUpdate({
                updateType: 'Subtask_To_Maintask',
                response
            })
        }
    }

    const dragOver = (e: React.DragEvent<HTMLElement>) => {
        e.preventDefault();
    }

    // Filter functions
    const filterDahsboard = (displayDone: boolean) => {
        setDisplayDoneTasks(displayDone)
    }

    const tasksDone = () => {
        const done = data.filter(
            (todo: { 
                _id: string,
                name: String,
                done: boolean,
                description: String,
                type: String,
                specialInput: Object,
                price: Number, 
                userCookie: String,
                lastUpdatedBy: string,
                tempIdentifier: string,
                subtask: []
            }) => todo.done
        );

        if(done.length === 0) {
            return <div className="no-done-tasks">Nothing to see here {'😳'}</div>
        } else {
            return done.map(
                (todo: { 
                    _id: string,
                    name: String,
                    done: boolean,
                    description: String,
                    type: String,
                    specialInput: Object,
                    price: Number, 
                    userCookie: String,
                    lastUpdatedBy: string,
                    tempIdentifier: string,
                    subtask: []
                }) => (<ToDo 
                        key={todo._id || `${Math.random()}`}
                        id={todo._id}
                        name={todo.name} 
                        description={todo.description}
                        price={todo.price}
                        specialInput={todo.specialInput}
                        type={todo.type}
                        done={todo.done}
                        childUpdate={setChildUpdate}
                        userCookie={todo.userCookie}
                        lastUpdatedBy={todo.lastUpdatedBy}
                        tempIdentifier={todo.tempIdentifier}
                        subtask={todo.subtask}
                        displayDone="filtered-display"
                    />)
                )
        }
    }

    return (
        <main className="dashboard" 
            onDrop={drop} 
            onDragOver={dragOver}>

            <header>
                <div className="filter-display">
                    <button 
                        onClick={ () => setShowFilterOptions(!showFilterOptions) } 
                        className="filterDropbtn">
                            <img src="https://img.icons8.com/ios/50/000000/settings--v1.png" alt="filter icon" width="24px" height="24px" />
                    </button>

                    <div className={showFilterOptions ? "dropdown-content show-filter-options" : "dropdown-content"}>
                        <span onClick={ () => {
                                filterDahsboard(true);
                                setShowFilterOptions(!showFilterOptions);
                            }
                        }>
                            Done {displayDoneTasks && '\u2713'}
                        </span>

                        <span onClick={ () => {
                                filterDahsboard(false);
                                setShowFilterOptions(!showFilterOptions);
                            }
                        }>
                            To Do {!displayDoneTasks && '\u2713'}
                        </span>
                    </div>
                </div>

                <h1>Dashboard</h1>

                <button className="addTaskbtn" onClick={changeRoute}>
                    <img src="https://img.icons8.com/android/24/000000/plus.png" alt="add icon" />
                </button>
            </header>

            <div className="all-tasks">
                { data.length > 0 && !displayDoneTasks &&
                    data.map(
                    (todo: { 
                        _id: string,
                        name: String,
                        done: boolean,
                        description: String,
                        type: String,
                        specialInput: Object,
                        price: Number, 
                        userCookie: String,
                        tempIdentifier: string,
                        lastUpdatedBy: string,
                        subtask: []
                    }) => (<ToDo 
                            key={todo._id || `${Math.random()}`}
                            id={todo._id}
                            name={todo.name} 
                            description={todo.description}
                            price={todo.price}
                            specialInput={todo.specialInput}
                            type={todo.type}
                            done={todo.done}
                            childUpdate={setChildUpdate}
                            userCookie={todo.userCookie}
                            lastUpdatedBy={todo.lastUpdatedBy}
                            tempIdentifier={todo.tempIdentifier}
                            subtask={todo.subtask}
                        />)
                    )  
                }

                { data.length > 0 && displayDoneTasks && tasksDone() }
            </div>
        </main>
    )
}

export default Dashboard;