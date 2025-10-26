import {useNavigate, useParams} from "react-router-dom";
import React, {useId} from "react";
import {currentPresetSelector, useGlobalStore} from "../../../store/useGlobalStore.js";
import {togglePreset} from "./usePresetForm.jsx";
import "./togglePresetButton.css";
import {useRoute} from "../../../service/useRoute.jsx";

export const TogglePresetButton = () => {
    const inputId = useId();
    const {id} = useParams();
    const currentPreset = useGlobalStore(currentPresetSelector);
    const {back} = useRoute();
    const navigate = useNavigate();
    const onClick = async () => {
        await togglePreset();
        setTimeout(() => {
            navigate(back);
        }, 500);
    };
    const isActive = id === currentPreset?.id;
    return (
        <>
            <input checked={isActive} onChange={onClick} className="tgl tgl-skewed" id={inputId} type="checkbox"/>
            <label className="tgl-btn" data-tg-off="Не активирован" data-tg-on="Активирован" htmlFor={inputId} />
        </>
    );
};