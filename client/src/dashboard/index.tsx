import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import ToDo from '../todoTask';
import { collectToDos } from '../helperFunctions/formsRequests';

const Dashboard = () => {
    const [data, setData] = useState([]);
    const [childUpdate, setChildUpdate] = useState({});

    useEffect(() => {
        collectToDos((allTodos: any) => setData(allTodos));
    }, [childUpdate]);

    const history = useHistory();

    const changeRoute = () => {
        const path = '/new-todo';
        history.push(path);
    }

    return (
        <main className="dashboard">
            <header>
                <h1>Dashboard</h1>

                <button onClick={changeRoute}>Add Task</button>
            </header>

            <div className="all-tasks">
                { data.length > 0 &&
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
            </div>
        </main>
    )
}

export default Dashboard;