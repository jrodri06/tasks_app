import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import swal from 'sweetalert';

import { getUserCookie } from '../helperFunctions/getCookie';
import { editTask, getTask } from '../helperFunctions/requestsHandlers';
import { foodTypeValidation, workTypeValidation, emptyFields } from '../helperFunctions/formsValidation';

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
    price: Number | null,
    done: boolean,
    tempIdentifier: string,
    _id: string
}

const EditTask = () => {
    const history = useHistory();

    const location: any = useLocation();

    const [task, setTask] = useState<Partial<TodoProps>>({
        userCookie: '',
        lastUpdatedBy: '',
        name: '',
        description: '',
        type: 'Other',
        specialInput: {},
        price: null,
        tempIdentifier: '',
        done: false,
        _id: ''
    });

    const backToTask = () => {
        const t = JSON.stringify(task);

        history.push({
            pathname: `/task/${task.tempIdentifier}/${task.userCookie}`,
            state: t
        });
    };

    const [userCookie, setUserCookie] = useState('');

    useEffect(() => {
        // Get current user cookie
        const cookieVal = getUserCookie();
        setUserCookie(cookieVal);

        const renderTask = async () => {
            const path = window.location.pathname;
            const pathDivided = path.split('/');
            const userOrigin = pathDivided[pathDivided.length - 1];
    
            // User from external link needs to fetch task details
            if(location.state === undefined) {
                const tempId = pathDivided[pathDivided.length - 2];
                try {
                    const response = await getTask(tempId, userOrigin);
                    setTask(response);
                } catch(err) {
                    return swal('You are offline', `${err}` , 'error');
                }   
            } else {
                const t = JSON.parse(location.state);
                setTask(t);
            }
        };

        renderTask();
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    const handleChange = (userInput: ChangeEvent) => {
        const inputInfo = userInput.target as HTMLInputElement;

        switch(inputInfo.name) {
            case 'toDoName':
                setTask({ ...task, name: inputInfo.value });
                break;
            case 'toDoDesc':
                setTask({ ...task, description: inputInfo.value });
                break;
            case 'toDoType':
                const clearSpecialInput = { ...task, specialInput: {} };
                setTask({ ...clearSpecialInput, type: inputInfo.value });
                break;
            case 'toDoPrice':
                setTask({ ...task, price: +inputInfo.value });
                break;
            case 'foodCarbs':
                setTask({ ...task, specialInput: { ...task.specialInput, fooCarbs: +inputInfo.value } });
                break;
            case 'foodFat':
                setTask({ ...task, specialInput: { ...task.specialInput, foodFat: +inputInfo.value } });
                break;
            case 'foodProtein':
                setTask({ ...task, specialInput: { ...task.specialInput, foodProtein: +inputInfo.value } });
                break;
            case 'workDeadline':
                setTask({ ...task, specialInput: { ...task.specialInput, workDeadline: inputInfo.value } });
                break;
            default:
                return;
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if(!emptyFields(task.name!.toString())){
            return false;
        };

        task.lastUpdatedBy = userCookie;

        switch(task.type) {
            case 'Food':
                const validFoodTypes = foodTypeValidation(task.specialInput!);
                if(validFoodTypes) {
                    await editTask(task, backToTask);
                }
                break;
            case 'Work':
                const validDeadline = workTypeValidation(task.specialInput!);
                if(validDeadline) {
                    await editTask(task, backToTask);
                }
                break;
            default:
                await editTask(task, backToTask);
        }
    };

    const renderTypeOptions = () => {
        let options = '';

        switch(task.type) {
            case 'Other':
                options = ` <option value="Other">Other</option>
                            <option value="Food">Food</option>
                            <option value="Work">Work</option>
                            `;
                break;
            case 'Food':
                options = ` <option value="Food">Food</option>
                            <option value="Work">Work</option>
                            <option value="Other">Other</option>
                            `;
                break;
            default: 
                options = ` <option value="Work">Work</option>
                            <option value="Food">Food</option>
                            <option value="Other">Other</option>
                            `;
        }

        return options;
    }

    return (
        <form className="create-add" onSubmit={handleSubmit}>
            <span className="exit" onClick={backToTask}>{'\u2716'}</span>
            <h1>Edit Task</h1>
            <label>
                Name

                <input type="text" name="toDoName" onChange={handleChange} value={ String(task.name) } />
            </label>

            <label>
                Description (optional)
                <input type="text" name="toDoDesc" onChange={handleChange} value={ String(task.description) } />
            </label>

            <label>
                Type
                <select name="toDoType" onChange={handleChange} dangerouslySetInnerHTML={{__html: renderTypeOptions() }}>
                </select>
            </label>

            {
                task.type === 'Food' && 
                    <fieldset>
                        <label>Carbohydrates
                            <input type="number" className="foodCarbs" name="foodCarbs" placeholder="Grams" value={ String(task.specialInput?.fooCarbs) } onChange={handleChange} />
                        </label>

                        <label>Fat
                            <input type="number" className="foodFat" name="foodFat" placeholder="Grams" value={ String(task.specialInput?.foodFat) } onChange={handleChange} />
                        </label>

                        <label>Protein
                            <input type="number" className="foodProtein" name="foodProtein" placeholder="Grams" value={ String(task.specialInput?.foodProtein) } onChange={handleChange} />
                        </label>
                    </fieldset>
            }

            {
                task.type === 'Work' && 
                    <fieldset>
                        <label>Deadline
                            <input 
                                type="date" 
                                className="workDeadline" 
                                name="workDeadline" 
                                placeholder="yyyy-mm-dd" 
                                value={ task.specialInput?.workDeadline !== undefined ? String(task.specialInput?.workDeadline) : ''} 
                                onChange={handleChange} />
                        </label>
                    </fieldset>
            }

            <label>
                Price (optional)
                <input type="number" name="toDoPrice" placeholder="Value in SEK" value={ String(task.price) } onChange={handleChange} />
            </label>

            <button className="btn" type="submit">Submit</button>
        </form>
    )
};

export default EditTask;