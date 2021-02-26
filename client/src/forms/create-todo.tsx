import { ChangeEvent, FormEvent, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { getUserCookie } from '../helperFunctions/getCookie';
import { formPath } from '../helperFunctions/requestsHandlers';
import { foodTypeValidation, workTypeValidation, emptyFields } from '../helperFunctions/formsValidation';

interface TodoProps {
    name: string,
    description: string,
    type: string,
    specialInput: {
        fooCarbs?: number,
        foodFat?: number,
        foodProtein?: number,
        workDeadline?: string
    },
    price: string | null,
    done: boolean,
    tempIdentifier: string 
}

const CreateToDo = () => {
    const cookieVal = getUserCookie();
    
    const [toDo, setToDo] = useState<Partial<TodoProps>>({
        name: '',
        description: '',
        type: 'Other',
        specialInput: {},
        price: null,
        done: false,
        tempIdentifier: `${cookieVal}${new Date().getTime()}`
    });

    const history = useHistory();
    const backToDashboard = () =>{
        history.push('/');
    };

    const handleChange = (userInput: ChangeEvent) => {
        const inputInfo = userInput.target as HTMLInputElement;
        
        switch(inputInfo.name) {
            case 'toDoName':
                setToDo({ ...toDo, name: inputInfo.value });
                break;
            case 'toDoDesc':
                setToDo({ ...toDo, description: inputInfo.value });
                break;
            case 'toDoType':
                const clearSpecialInput = { ...toDo, specialInput: {} };
                setToDo({ ...clearSpecialInput, type: inputInfo.value });
                break;
            case 'toDoPrice':
                setToDo({ ...toDo, price: inputInfo.value });
                break;
            case 'foodCarbs':
                setToDo({ ...toDo, specialInput: { ...toDo.specialInput, fooCarbs: +inputInfo.value } });
                break;
            case 'foodFat':
                setToDo({ ...toDo, specialInput: { ...toDo.specialInput, foodFat: +inputInfo.value } });
                break;
            case 'foodProtein':
                setToDo({ ...toDo, specialInput: { ...toDo.specialInput, foodProtein: +inputInfo.value } });
                break;
            case 'workDeadline':
                setToDo({ ...toDo, specialInput: { ...toDo.specialInput, workDeadline: inputInfo.value } });
                break;
            default:
                return;
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if(!emptyFields(toDo.name!.toString())){
            return false;
        };

        switch(toDo.type) {
            case 'Food':
                const validFoodTypes = foodTypeValidation(toDo.specialInput!);
                if(validFoodTypes) {
                    await formPath(toDo, backToDashboard);
                }
                break;
            case 'Work':
                const validDeadline = workTypeValidation(toDo.specialInput!);
                if(validDeadline) {
                    await formPath(toDo, backToDashboard);
                }
                break;
            default:
                await formPath(toDo, backToDashboard);
        }
    };

    return (
        <form className="create-add" onSubmit={handleSubmit}>
            <span className="exit" onClick={backToDashboard}>{'\u2716'}</span>
            <h1>Create a Task</h1>
            <label>
                Name
                <input type="text" name="toDoName" onChange={handleChange} />
            </label>

            <label>
                Description (optional)
                <input type="text" name="toDoDesc" onChange={handleChange} />
            </label>

            <label>
                Type
                <select name="toDoType" defaultValue="Other" onChange={handleChange}>
                    <option value="Other">Other</option>
                    <option value="Food">Food</option>
                    <option value="Work">Work</option>
                </select>
            </label>

            {
                toDo.type === 'Food' && 
                    <fieldset>
                        <label>Carbohydrates
                            <input type="number" className="foodCarbs" name="foodCarbs" placeholder="Grams" onChange={handleChange} />
                        </label>

                        <label>Fat
                            <input type="number" className="foodFat" name="foodFat" placeholder="Grams" onChange={handleChange} />
                        </label>

                        <label>Protein
                            <input type="number" className="foodProtein" name="foodProtein" placeholder="Grams" onChange={handleChange} />
                        </label>
                    </fieldset>
            }

            {
                toDo.type === 'Work' && 
                    <fieldset>
                        <label>Deadline
                            <input type="date" className="workDeadline" name="workDeadline" placeholder="yyyy-mm-dd" onChange={handleChange} />
                        </label>
                    </fieldset>
            }

            <label>
                Price (optional)
                <input type="number" name="toDoPrice" placeholder="Value in SEK" onChange={handleChange} />
            </label>

            <button className="btn" type="submit">Create</button>
        </form>
    )
};

export default CreateToDo;