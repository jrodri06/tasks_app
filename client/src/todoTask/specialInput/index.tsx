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
    let toRender = ''

    const renderInputs = () => {
        for(let element in inputs) {
            switch(element) {
                case 'workDeadline':
                    toRender = toRender + `
                        <div className="special-input">
                            <span className="special-input-title">Dead Line: </span>
                            ${inputs[element]}
                        </div>
                    `;
                    break;
                case 'fooCarbs':
                    toRender = toRender + `
                        <div className="special-input">
                            <span className="special-input-title">Carbohydrates: </span>
                            ${inputs[element]}
                        </div> 
                    `;
                    break;
                case 'foodFat':
                    toRender = toRender + `
                        <div className="special-input">
                            <span className="special-input-title">Fat: </span>
                            ${inputs[element]}
                        </div>
                    `;
                    break;
                case 'foodProtein':
                    toRender = toRender + `
                        <div className="special-input">
                            <span className="special-input-title">Protein: </span>
                            ${inputs[element]}
                        </div>
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