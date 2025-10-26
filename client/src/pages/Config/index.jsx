import timeIcon from "./system-regular-67-clock-hover-clock.json";
import {Link, useNavigate} from "react-router-dom";
import {useLottie} from "lottie-react";

const timeIconOptions = {
    animationData: timeIcon,
    loop: false,
    autoplay: false,
};

export const ConfigPage = () => {
    return <>

        <div className="p-2">
            <Config label={"Настройка времени"} icon={timeIconOptions}  desc={""} to={"/"} />
        </div>
    </>;
};

const Config = ({label, icon, desc, to}) => {
    const navigate = useNavigate()
    const onComplete = () => {
        navigate("/config/time");
    }

    const {View, playSegments} = useLottie({...icon, onComplete});

    return (
        // <div
        //     onClick={() => playSegments([0, icon.animationData.op], true)}
        //     className={`border w-full p-2 rounded-sm inline-flex flex-col items-start justify-center hover:bg-gray-50 group`}
        // >
        //     <div className="flex gap-2 items-center">
        //         <div className="h-12 w-12 text-gray-500">
        //             {View}
        //         </div>
        //         <div className="text-sm text-gray-700 font-semibold ">
        //         {label}
        //       </div>
        //     </div>
        //
        // </div>

    <div onClick={() => playSegments([0, icon.animationData.op], true)} className="border flex items-center p-4 bg-white rounded-sm">
        <div className="p-1 text-gray-300 flex flex-shrink-0 items-center justify-center border h-12 w-12">
            {View}
        </div>
        <div className="flex-grow flex flex-col ml-4">
            <div className="flex items-center justify-between"><span className="text-md font-bold">{label}</span>
                {/*<button className="border text-xs p-1 px-2 rounded-sm font-semibold transition-300 ">Подробнее</button>*/}
            </div>
            <div className="flex items-center justify-between"><span
                className="text-xs text-gray-500"> Авто управление</span></div>
        </div>
    </div>
    );
};



