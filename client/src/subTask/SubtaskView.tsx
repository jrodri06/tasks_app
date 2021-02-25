import { FunctionComponent, useState } from 'react';

type SubtaskViewProps = {
    done: boolean
    id:  string
    name: String
    price: Number
    parentId: String
    update: React.Dispatch<React.SetStateAction<{}>>
}

const SubtaskView: FunctionComponent<SubtaskViewProps> = ({
    done,
    id,
    name,
    price,
    parentId,
    update
}) => {
    const [concluded, setConcluded] = useState(done);

    const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        await update({
            taskId: id,
            done: e.target.checked,
            parentId
        });

        setConcluded(e.target.checked);
    };

    const dragStart = (e: any) => {
        const target = e.target!;
        const name = target.querySelector('.subTasks-name').textContent;

        let price;
        if(target.querySelector('.subTasks-price') !== null) {
            const priceString = target.querySelector('.subTasks-price').textContent;
            price = +priceString.substring(0, priceString.length - 2);
        } else {
            price = null;
        }

        const subtaskBody = { 
            id: target.id, 
            name, 
            price,
            parentId
        };
            
        e.dataTransfer.setData('subtask_body', JSON.stringify(subtaskBody));
    };

    const blockPropagation = (e: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
        e.stopPropagation();
    }

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
            <div>
                <input type="checkbox" 
                    defaultChecked={done} 
                    onClick={blockPropagation}
                    onChange={handleChange} 
                />
                <span className={concluded ? "subTasks-name concluded" : "subTasks-name"}>{name}</span>
            </div>
            { price !== null && <span className={concluded ? "subTasks-price concluded" : "subTasks-price"}>{price}kr</span> }
        </div>
    );
};

export default SubtaskView;