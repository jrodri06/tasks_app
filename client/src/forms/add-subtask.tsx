import { ChangeEvent, FormEvent, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import { createSubTask } from '../helperFunctions/requestsHandlers';
import { localTasks } from '../helperFunctions/localStorageHandlers';

interface ParamTypes {
    parentTempId: string
}

const AddSubtask = () => {
    const { parentTempId } = useParams<ParamTypes>();

    const [subTask, setSubTask] = useState({
        parentTempId,
        name: '',
        price: '',
        done: false,
        subtaskTempId: `${parentTempId}${new Date().getTime()}`
    });

    const history = useHistory();

    const backToDashboard = () =>{
        history.goBack();
    };

    const handleChange = (userInput: ChangeEvent) => {
        const inputInfo = userInput.target as HTMLInputElement;
        switch(inputInfo.name) {
            case 'subTaskName':
                setSubTask({ ...subTask, name: inputInfo.value });
                break;
            case 'subTaskPrice':
                setSubTask({ ...subTask, price: inputInfo.value });
                break;
            default:
                return;
        }
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        createSubTask(subTask);

        const localStorage = localTasks.getTasks();
        if(localStorage.length > 0) {
            localTasks.createSubtaskToList(subTask);
        }

        backToDashboard();
    };

    return (
        <form className="create-add" onSubmit={handleSubmit}>
            <span className="exit" onClick={backToDashboard}>{'\u2716'}</span>
            <h1>Add a Subtask</h1>

            <label>
                Name
                <input type="text" name="subTaskName" onChange={handleChange} />
            </label>

            <label>
                Price (optional)
                <input type="number" name="subTaskPrice" placeholder="Value in SEK" onChange={handleChange} />
            </label>

            <button className="btn" type="submit">Add</button>
        </form>
    )
}

export default AddSubtask;