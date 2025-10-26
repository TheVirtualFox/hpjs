import {Label} from "flowbite-react";
import {memo} from "react";

export const LabelComponent = memo(({id, label}) => {
    return (
        <div className="mb-2 block">
            <Label htmlFor={id}>
                {label}
            </Label>
        </div>
    );
});
