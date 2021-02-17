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
        const subtaskId = e.dataTransfer.getData('subtask_id');

        if (subtaskId === '') {
            return;
        } else {
            const response = await convertSubToMain(subtaskId);

            setChildUpdate({
                updateType: 'Subtask_To_Maintask',
                response
            });
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
                subtask: []
            }) => todo.done
        );

        if(done.length === 0) {
            return swal('Nothing to show', 'It seems you have not marked any tasks as done yet', 'error');
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
                    subtask: []
                }) => (<ToDo 
                        key={todo._id}
                        id={todo._id}
                        name={todo.name} 
                        description={todo.description}
                        price={todo.price}
                        specialInput={todo.specialInput}
                        type={todo.type}
                        done={todo.done}
                        childUpdate={setChildUpdate}
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
                            Filter
                    </button>

                    <div className={showFilterOptions ? "dropdown-content show-filter-options" : "dropdown-content"}>
                        <span onClick={ () => filterDahsboard(true) }>Done {displayDoneTasks && '\u2713'}</span>
                        <span onClick={ () => filterDahsboard(false) }>To Do {!displayDoneTasks && '\u2713'}</span>
                    </div>
                </div>

                <h1>Dashboard</h1>

                <button onClick={changeRoute}>Add Task</button>
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
                        subtask: []
                    }) => (<ToDo 
                            key={todo._id}
                            id={todo._id}
                            name={todo.name} 
                            description={todo.description}
                            price={todo.price}
                            specialInput={todo.specialInput}
                            type={todo.type}
                            done={todo.done}
                            childUpdate={setChildUpdate}
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