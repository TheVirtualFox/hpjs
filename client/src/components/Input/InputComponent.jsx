import {TextInput} from "flowbite-react";
import {LabelComponent} from "./LabelComponent.jsx";
import {useId} from "react";
import {HelperTextComponent} from "./HelperTextComponent.jsx";

export const InputComponent = ({label, value, onChange, error}) => {
    const id = useId();
    return (
        <div>
            <LabelComponent id={id} label={label} />
            <TextInput
                id={id} placeholder="Bonnie Green"
                value={value} onChange={onChange} color={error ? 'failure' : ''} />
            <HelperTextComponent error={error}>Название пресета</HelperTextComponent>
        </div>
    );
};