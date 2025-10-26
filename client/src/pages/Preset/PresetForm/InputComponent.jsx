import {
    descSelector,
    labelErrorSelector,
    labelSelector,
    onDescChange,
    onLabelChange,
    usePresetForm
} from "./usePresetForm.jsx";
import {InputComponent} from "../../../components/Input/InputComponent.jsx";
import {TextareaComponent} from "../../../components/Input/TextareaComponent.jsx";

export const LabelInput = () => {
    const label = usePresetForm(labelSelector);
    const error = usePresetForm(labelErrorSelector);
    return <InputComponent value={label} label={"Название"} onChange={onLabelChange} error={error} />;
};

export const DescInput = () => {
    const desc = usePresetForm(descSelector);
    return <TextareaComponent value={desc} onChange={onDescChange} />;
}