import React, {useEffect, useState} from "react";
import {fetchPreset, onSavePreset, reset, usePresetForm} from "./usePresetForm.jsx";
import {ScheduleAccordion} from "./ScheduleAccordion.jsx";
import {DescInput, LabelInput} from "./InputComponent.jsx";
import {Button} from "flowbite-react";
import {DeleteButton} from "./DeleteButton/index";
import {useNavigate, useParams} from "react-router-dom";
import {useRoute} from "../../../service/useRoute.jsx";
import {TogglePresetButton} from "./TogglePresetButton.jsx";

export const PresetForm = () => {
    const {id} = useParams();
    useEffect(() => reset, []);

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        fetchPreset(id).then(() => {
        }).finally(() => {
            setIsLoading(false);
        });
    }, [id]);
    const state = usePresetForm();

    if (isLoading) {
        return (<Loading />);
    }

    return (
        <>
            <div className="flex flex-col gap-2 bg-white p-2">
                <LabelInput/>
                <DescInput/>
                <ScheduleAccordion device={DEVICES.pump} label={"Расписание работы насоса"}/>
                <ScheduleAccordion device={DEVICES.light} label={"Расписание работы освещения"}/>
                <ScheduleAccordion device={DEVICES.air} label={"Расписание работы аэратора"}/>
                <ScheduleAccordion device={DEVICES.fan} label={"Расписание работы вентиляции"}/>
            </div>
            <Buttons/>
        </>
    );
};

const Buttons = () => {
    const {id} = useParams();
    const isDeleteButton = id !== "new";
    const isTogglePresetButton = id !== "new";

    return (
        <div className="flex p-4 px-2">
            <div className="flex gap-2">
                {isTogglePresetButton && <TogglePresetButton/>}
                {isDeleteButton && <DeleteButton/>}
            </div>
            <div className="flex ml-auto">
                <PresetButton />
            </div>
        </div>
    );
};

const PresetButton = () => {
    const {back} = useRoute();
    const navigate = useNavigate();
    const onClick = async () => {
        try {
            await onSavePreset();
            navigate(back);
        } finally {

        }
    }
    return (
        <Button onClick={onClick} type="submit" className="bg-green-500 text-white px-4 py-2 rounded-sm">
            Сохранить
        </Button>
    );
};

const DEVICES = {
    pump: 'pump',
    light: 'light',
    air: 'air',
    fan: 'fan'
}

const Loading = () => (
    <div className="flex flex-col gap-2 bg-white p-2">
        <div role="status" className="max-w-sm animate-pulse">
            <div className="h-5 bg-gray-200 rounded-sm w-48 mb-4"></div>
            <div className="h-8 bg-gray-200 rounded-sm mb-2.5"></div>
            <div className="h-3 bg-gray-200 rounded-sm mb-7"></div>
            <div className="h-5 bg-gray-200 rounded-sm mb-2.5"></div>
            <div className="h-32 bg-gray-200 rounded-sm mb-2.5"></div>
            <div className="h-5 bg-gray-200 rounded-sm mb-7"></div>

            <div className="h-7 bg-gray-300 rounded-sm mb-2"></div>
            <div className="flex w-full gap-3 mb-2.5">
                <div className="h-8 bg-gray-200 w-full rounded-sm "></div>
                <div className="h-8 bg-gray-200 w-full rounded-sm "></div>
                <div className="h-8 bg-gray-200 rounded-sm w-24"></div>
            </div>
            <div className="flex w-full gap-3 mb-2.5">
                <div className="h-8 bg-gray-200 w-full rounded-sm "></div>
                <div className="h-8 bg-gray-200 w-full rounded-sm "></div>
                <div className="h-8 bg-gray-200 rounded-sm w-24"></div>
            </div>
            <div className="flex w-full gap-3 mb-12">
                <div className="h-8 bg-gray-200 w-full rounded-sm "></div>
                <div className="h-8 bg-gray-200 w-full rounded-sm "></div>
                <div className="h-8 bg-gray-200 rounded-sm w-24"></div>
            </div>

            <div className="h-7 bg-gray-300 rounded-sm mb-2"></div>
            <div className="flex w-full gap-3 mb-2.5">
                <div className="h-8 bg-gray-200 w-full rounded-sm "></div>
                <div className="h-8 bg-gray-200 w-full rounded-sm "></div>
                <div className="h-8 bg-gray-200 rounded-sm w-24"></div>
            </div>
            <div className="flex w-full gap-3 mb-2.5">
                <div className="h-8 bg-gray-200 w-full rounded-sm "></div>
                <div className="h-8 bg-gray-200 w-full rounded-sm "></div>
                <div className="h-8 bg-gray-200 rounded-sm w-24"></div>
            </div>
            <div className="flex w-full gap-3 mb-2.5">
                <div className="h-8 bg-gray-200 w-full rounded-sm "></div>
                <div className="h-8 bg-gray-200 w-full rounded-sm "></div>
                <div className="h-8 bg-gray-200 rounded-sm w-24"></div>
            </div>
        </div>
    </div>
);