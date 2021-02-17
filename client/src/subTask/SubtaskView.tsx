import { FunctionComponent, useState } from 'react';

type SubtaskViewProps = {
    done: boolean
    id:  string
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
    };

    const dragStart = (e: any) => {
        const target = e.target!;
        e.dataTransfer.setData('subtask_id', target.id );
    };

    const dragOver = (e: any) => {
        e.stopPropagation();
    };

    return (
        <div id={id}
            className="subTasks"
            draggable
            onDragStart={dragStart} 
            onDragOver={dragOver}
        >
            <input type="checkbox" defaultChecked={done} onChange={handleChange} />
            <div className={concluded ? "subTasks-name concluded" : "subTasks-name"}>{name}</div>
            { price !== null && <span className={concluded ? "subTasks-price concluded" : "subTasks-price"}>{price}kr</span> }
        </div>
    );
};

export default SubtaskView;