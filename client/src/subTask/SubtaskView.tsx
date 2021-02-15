import { FunctionComponent, useState } from 'react';

type SubtaskViewProps = {
    done: boolean
    id:  String
    name: String
    price: Number
    update: React.Dispatch<React.SetStateAction<{}>>
}

const SubtaskView: FunctionComponent<SubtaskViewProps> = ({
    done,
    id,
    name,
    price,
    update
}) => {
    const [concluded, setConcluded] = useState(done);

    const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        await update({
            taskId: id,
            done: e.target.checked
        });

        setConcluded(e.target.checked);
    }

    return (
        <div className="subTasks">
            <input type="checkbox" defaultChecked={done} onChange={handleChange} />
            <div className={concluded ? "subTasks-name concluded" : "subTasks-name"}>{name}</div>
            { price !== null && <span className={concluded ? "subTasks-name concluded" : "subTasks-name"}>{price}kr</span> }
        </div>
    )
}

export default SubtaskView;