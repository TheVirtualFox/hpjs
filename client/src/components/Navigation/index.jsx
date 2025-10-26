import presetIcon from './system-regular-44-folder-hover-folder.json';
import monitorIcon from './system-regular-15-ratio-hover-ratio.json';
import configIcon from './system-regular-63-settings-cog-hover-cog-1.json';
import debugIcon from './system-regular-34-code-hover-code.json';
import {NavigationItem} from "./NavigationItem.jsx";
import {useRoute} from "../../service/useRoute.jsx";


const presetIconOptions = {
    animationData: presetIcon,
    loop: false,
    autoplay: false,
};
const monitorIconOptions = {
    animationData: monitorIcon,
    loop: false,
    autoplay: false,
};
const configIconOptions = {
    animationData: configIcon,
    loop: false,
    autoplay: false,
};
const debugIconOptions = {
    animationData: debugIcon,
    loop: false,
    autoplay: false,
};


export const Navigation = () => {
    const {key} = useRoute();
    return <>
        <nav
            className="fixed bottom-0 left-0 z-20 w-full h-16 bg-white border-t border-gray-200 dark:bg-gray-700 dark:border-gray-600">
            <div className="grid h-full max-w-lg grid-cols-4 mx-auto font-medium">
                <NavigationItem to="/" label={'Монитор'} icon={monitorIconOptions} isActive={key === "monitor"} />
                <NavigationItem to="/presets" label={'Пресеты'} icon={presetIconOptions}  isActive={key === "presets" || key === "preset"} />
                <NavigationItem to="/config" label={'Настройки'} icon={configIconOptions}  isActive={key === "config"} />
                <NavigationItem to="/debug" label={'Отладка'} icon={debugIconOptions}  isActive={key === "debug"} />
            </div>
        </nav>
    </>;
};