import {Watch} from "./Watch.jsx";
import {ControlPanel} from "./ControlPanel/index.jsx";
import {Link, matchPath, useLocation, useNavigate} from "react-router-dom";
import {useRoute} from "../../service/useRoute.jsx";
import backIcon from "./system-solid-161-trending-flat-hover-ternd-flat-4.json";
import {useLottie} from "lottie-react";
import {Button} from "flowbite-react";

export const Header = () => {
    const {back, label} = useRoute();
    const width = label.length * 12 + 24 + 24 + (!!back ? (24 + 12) : 0) + 22;
    return (<div className="h-full bg-gray-700 flex justify-center items-center">
            <div className="max-w-lg px-3 w-full flex justify-between items-center">
                <div
                    style={{width: `${width}px`} }
                    className={`transition-all duration-500 ease-in-out animate-pulse1 w-52 bg-green-400 h-[50px] absolute top-0 -left-[50px] -skew-x-[25deg]`}
                ></div>

                <div className="flex gap-2 items-center z-1 relative items-center">
                    {back && <BackLink />}
                    <Label />
                </div>
                <div className="flex gap-2 items-center">
                    <Watch/>
                    <ControlPanel/>
                </div>

            </div>
        </div>)
};

const Label = () => {
    const {label} = useRoute();
    console.log(label);
    return (
        <span className="text-lg font-semibold text-white flex items-center">{label}</span>
    );
}


const backIconOptions = {
    animationData: backIcon,
    loop: false,
    autoplay: false,
};

const BackLink = () => {
    const {back} = useRoute();
    const navigate = useNavigate()
    const onComplete = () => {
        navigate(back);
    }
    const {View, playSegments, setSpeed} = useLottie({...backIconOptions, onComplete});

    return (
        <button onClick={() => {
            setSpeed(3);
            playSegments([0, backIconOptions.animationData.op], true)
        } }>
            <div className="w-6 h-6 rotate-180">
                {View}
            </div>
        </button>
    );
}