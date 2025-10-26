import {Link, useNavigate} from "react-router-dom";
import presetIcon from "./system-regular-24-view-1-hover-view-1.json";
import {useLottie} from "lottie-react";
import {getLocalTimestamp, UTCTimestampToDateString} from "../../store/useGlobalStore.js";

const presetIconOptions = {
    animationData: presetIcon,
    loop: false,
    autoplay: false,
};

export const PresetItem = ({preset}) => {
    const {label, timestamp, id, isActive} = preset;



    const navigate = useNavigate()
    const onComplete = () => {
        navigate(`/presets/${id}`);
    }
    const {View, playSegments} = useLottie({...presetIconOptions, onComplete});


    return (

    //     <Link to={`/presets/${id}`} className={`flex flex-col border ${isActive ? 'border-green-500' : ''} bg-white p-2 rounded-sm shadow-sm w-full gap-1`}>
    //     <div className="flex gap-1 justify-between border-b">
    //         <div className="text-sm text-gray-500">Название:</div>
    //         <div className="text-sm font-semibold">{label}</div>
    //     </div>
    //     <div className="flex gap-1 justify-between border-b">
    //         <div className="text-sm text-gray-500">Дата создание:</div>
    //         <div className="text-sm font-semibold">{timestamp}</div>
    //     </div>
    // </Link>



    <div onClick={() => playSegments([0, presetIconOptions.animationData.op], true)} className={`${isActive ? 'border-green-500' : ''} border flex items-center p-4 bg-white rounded-sm`}>
        <div className="p-1 text-gray-300 flex flex-shrink-0 items-center justify-center border h-12 w-12">
            {View}
        </div>
        <div className="flex-grow flex flex-col ml-4">
            <div className="flex items-center justify-between"><span className="text-md font-bold">{label}</span>
                {/*<button className="border text-xs p-1 px-2 rounded-sm font-semibold transition-300 ">Подробнее</button>*/}
            </div>
            <div className="flex items-center justify-between">
                {timestamp && (<div
                    className="text-xs text-gray-500">{UTCTimestampToDateString(getLocalTimestamp(timestamp))}</div>)}
            </div>
        </div>
    </div>


    );
};
