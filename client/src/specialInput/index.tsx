import { FunctionComponent } from "react";

type SpecialInputProp = {
    inputs: {
        fooCarbs?: Number,
        foodFat?: Number,
        foodProtein?: Number,
        workDeadline?: string
    }
}

const SpecialInput: FunctionComponent<SpecialInputProp> = ({ inputs }) => {
    console.log('Special Elements');

    let toRender = ''
    
    const renderInputs = () => {
        for(let element in inputs) {
            switch(element) {
                case 'workDeadline':
                    toRender = toRender + `
                        <span className="special-input-title">Dead Line: </span>
                        <span className="special-input-title">${inputs[element]}</span>
                    `;
                    break;
                case 'fooCarbs':
                    toRender = toRender + `
                        <span className="special-input-title">Carbohydrates: </span>
                        <span className="special-input-title">${inputs[element]}</span>
                    `;
                    break;
                case 'foodFat':
                    toRender = toRender + `
                        <span className="special-input-title">Fat: </span>
                        <span className="special-input-title">${inputs[element]}</span>
                    `;
                    break;
                case 'foodProtein':
                    toRender = toRender + `
                        <span className="special-input-title">Protein: </span>
                        <span className="special-input-title">${inputs[element]}</span>
                    `;
                    break;
                default:
                    return toRender;
            }
        }
    }
    renderInputs();

    return (
        <div className="todo-special" dangerouslySetInnerHTML={{__html: toRender }}>
        </div>
    )
}

export default SpecialInput;