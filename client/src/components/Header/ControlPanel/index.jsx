import {Drawer, DrawerHeader, DrawerItems} from "flowbite-react";
import {KeyboardIcon} from "./KeyboardIcon.jsx";
import {useEffect, useState} from "react";
import {Panel} from "./Panel.jsx";
import {useRoute} from "../../../service/useRoute.jsx";
import {useNavigate} from "react-router-dom";
import {useLottie} from "lottie-react";
import controlPanelIcon from './Animation1748955971164.json';
import backIcon from "../system-solid-161-trending-flat-hover-ternd-flat-4.json";

const controlPanelIconOptions = {
    animationData: controlPanelIcon,
    loop: false,
    autoplay: false,
};

const ControlPanelButton = ({isOpen, onClick}) => {
    // const onControlPanelClick = () => {
    //     setSpeed(8);
    //     playSegments([0, controlPanelIconOptions.animationData.op], true);
    // }
    const {View, playSegments, setSpeed} = useLottie({...controlPanelIconOptions});

    useEffect(() => {
        if (!isOpen) {
            setSpeed(8);
            playSegments([0, controlPanelIconOptions.animationData.op], true);
        }
    }, [isOpen]);

    return (
        <button className="  -mr-3" onClick={onClick}>
            <div className="w-12 h-12 flex items-center border-l border-gray-900">{View}</div>
        </button>
    );
}


export const ControlPanel = () => {
    const [isOpen, setIsOpen] = useState(false);
    const handleClose = () => setIsOpen(false);
    return (
        <>
            {/*<button*/}
            {/*    onClick={() => setIsOpen(true)}*/}
            {/*    className="text-white"*/}
            {/*>*/}
            {/*    <ControlPanelButton />*/}
            {/*</button>*/}
            <ControlPanelButton isOpen={isOpen} onClick={() => setIsOpen(true)} />
            <Drawer open={isOpen} onClose={handleClose} position={"right"} edge className="duration-300 ease-in-out">
                <DrawerHeader title="Панель управления" titleIcon={ () => null } />
                {/*<div className={"mb-2 -mt-2 p-1 text-md  text-gray-700 font-medium "}>Панель управления</div>*/}
                <DrawerItems>
                    <Panel/>
                </DrawerItems>
            </Drawer>
        </>);
};
