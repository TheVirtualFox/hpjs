import {Textarea} from "flowbite-react";
import {LabelComponent} from "./LabelComponent.jsx";
import {useId} from "react";

export const TextareaComponent = ({value, onChange}) => {
    const id = useId();
    return (
        <div className="max-w-md">
            <LabelComponent id={id} label={"Описание"} />
            <Textarea
                className="rounded-sm bg-white"
                value={value}
                onChange={onChange}
                id={id} placeholder="Leave a comment..." rows={4} />
        </div>
    );
};