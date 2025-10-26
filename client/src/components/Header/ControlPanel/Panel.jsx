import {Spinner, ToggleSwitch} from "flowbite-react";
import { Controller, useForm } from "react-hook-form";
import {controlPanelSelector, useGlobalStore} from "../../../store/useGlobalStore.js";
import {useEffect, useState} from "react";
import {WsService} from "../../../service/WsService.js";

const FormToggle = ({ name, control, label, disabled = false }) => {
    return (
        <Controller
            name={name}
            control={control}
            render={({ field }) => (
                <ToggleSwitch
                    label={label}
                    checked={field.value}
                    onChange={field.onChange}
                    disabled={disabled}
                />
            )}
        />
    );
};

const wsService = new WsService();

const ToggleItem = ({checked, label, desc, onChange, isLoading}) => (
    <div className={`border-t pt-4`}>
        <div className={`flex items-center ${isLoading ? 'animate-pulse' : ''}`}>
            <ToggleSwitch checked={checked} className="" label={label} onChange={onChange} />
        </div>
        <div className=" mt-2 text-xs text-gray-500 dark:text-gray-400">
            {desc}
        </div>
    </div>
);


const PANEL_ITEM = {
    pump: 'pump',
    light: 'light',
    air: 'air',
    fan: 'fan',
};

export const Panel = () => {

    const [isLoading, setIsLoading] = useState(null);
    const controlPanel = useGlobalStore(controlPanelSelector);

    const onIsManualControlChange = async (isManualControl) => {
        await updateControlPanel({...controlPanel, isManualControl});
    };
    const onPumpChange = (pump) => updateControlPanel({...controlPanel, pump}, PANEL_ITEM.pump);
    const onLightChange =  (light) => updateControlPanel({...controlPanel, light}, PANEL_ITEM.light);
    const onAirChange = (air) => updateControlPanel({...controlPanel, air}, PANEL_ITEM.air);
    const onFanChange = (fan) => updateControlPanel({...controlPanel, fan}, PANEL_ITEM.fan);

    const updateControlPanel = async (controlPanel, id) => {
        try {
            setIsLoading(id);
            await wsService.sendPromiseMessage({
                action: 'SET_CONTROL_PANEL_REQ',
                payload: controlPanel
            });
        } catch(err) {
        } finally {
            setIsLoading(null);
        }
    };

    return (
        <div className="flex flex-col gap-1">
            <div className={`${isLoading ? 'pointer-events-none' : ''} flex flex-col gap-3`}>
                <ToggleItem label="Ручное управление" checked={controlPanel?.isManualControl} onChange={onIsManualControlChange} desc="Все оборудование выключится и будет управляться
                    с панели управления" />

                    <ToggleItem
                        label="Насос"
                        checked={controlPanel?.pump}
                        onChange={onPumpChange}
                        desc="Подача питательного"
                        isLoading={isLoading === PANEL_ITEM.pump}
                    />
                    <ToggleItem
                        label="Лампы"
                        checked={controlPanel?.light}
                        onChange={onLightChange}
                        desc="Включение освещения"
                        isLoading={isLoading === PANEL_ITEM.light}
                    />
                    <ToggleItem
                        label="Аэратор"
                        checked={controlPanel?.air}
                        onChange={onAirChange}
                        desc="Включение освещения"
                        isLoading={isLoading === PANEL_ITEM.air}
                    />
                    <ToggleItem
                        label="Вентиляция"
                        checked={controlPanel?.fan}
                        onChange={onFanChange}
                        desc="Включение освещения"
                        isLoading={isLoading === PANEL_ITEM.fan}
                    />

            </div>
        </div>
    );
}
