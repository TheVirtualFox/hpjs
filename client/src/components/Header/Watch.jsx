import {secondsOfDayStringSelector, useGlobalStore} from "../../store/useGlobalStore.js";

export const Watch = () => {
    const secondsOfDayString = useGlobalStore(secondsOfDayStringSelector);

    return <div className="text-sm text-white">{secondsOfDayString}</div>;
}