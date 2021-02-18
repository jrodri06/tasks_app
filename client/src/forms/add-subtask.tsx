import { ChangeEvent, FormEvent, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import { createSubTask } from '../helperFunctions/requestsHandlers';

interface ParamTypes {
    parentId: string
}

const AddSubtask = () => {
    const { parentId } = useParams<ParamTypes>();

    const [subTask, setSubTask] = useState({
        parentId,
        name: '',
        price: '',
        done: false
    });

    const history = useHistory();
    const backToDashboard = () =>{
        history.push('/');
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

            <input className="btn" type="submit" value="Add" />
        </form>
    )
}

export default AddSubtask;