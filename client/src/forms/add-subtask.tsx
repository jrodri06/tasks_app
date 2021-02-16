import { ChangeEvent, FormEvent, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import { createSubTask } from '../helperFunctions/formsRequests';

interface ParamTypes {
    parentId: string
}

const AddSubtask = () => {
    const { parentId } = useParams<ParamTypes>();

    const [subTask, setSubTask] = useState({
        parentId,
        name: '',
        required: false,
        price: '',
        done: false
    });

    const handleChange = (userInput: ChangeEvent) => {
        const inputInfo = userInput.target as HTMLInputElement;
        switch(inputInfo.name) {
            case 'subTaskName':
                setSubTask({ ...subTask, name: inputInfo.value });
                break;
            case 'subTaskRequired':
                setSubTask({ ...subTask, required: inputInfo.checked });
                break;
            case 'subTaskPrice':
                setSubTask({ ...subTask, price: inputInfo.value });
                break;
            default:
                return;
        }
    }

    const history = useHistory();

    const backToDashboard = () =>{
        history.push('/');
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        await createSubTask(subTask);
        backToDashboard();
    }

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

            <label className="required-subtask">
                Required
                <input type="checkbox" name="subTaskRequired" onChange={handleChange} />
            </label>

            <input className="btn" type="submit" value="Add" />
        </form>
    )
}

export default AddSubtask;