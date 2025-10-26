import {Button} from "flowbite-react";
import {Link, useNavigate} from "react-router-dom";
import {presetsListSelector, useGlobalStore} from "../../store/useGlobalStore.js";
import {PresetItem} from "./PresetItem.jsx";

export const PresetsPage = () => {
    const navigate = useNavigate();
    const onCreatePresetClick = () => {
        navigate(`/presets/new`);
    };
    const presetsList = useGlobalStore(presetsListSelector);
    return <>
        <div className="p-2">
            <Button size="sm" className="bg-green-500 rounded-sm px-3 py-1 h-8" onClick={onCreatePresetClick}>Создать пресет</Button>
        </div>

        <div className="p-2 flex flex-col gap-2">
            {presetsList.map((preset) => (<PresetItem key={preset.id} preset={preset} />))}
        </div>
    </>;
};