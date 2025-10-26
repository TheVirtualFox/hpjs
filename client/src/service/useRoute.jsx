import {matchPath, useLocation} from "react-router-dom";

const routeMap = [
    { path: "/", key: "monitor", label: "Монитор" },
    { path: "/presets", key: "presets", label: "Пресеты" },
    { path: "/presets/:id", key: "preset", back: "/presets", label: "Пресет" },
    { path: "/config", key: "config", label: "Настройки" },
    { path: "/debug", key: "debug", label: "Отладка" },
    { path: "/config/time", key: "configTime", label: "Настройки времени", back: "/config" },
];
export const useRoute = () => {
    const location = useLocation();
    for (const route of routeMap) {
        if (matchPath(route.path, location.pathname)) {
            return route;
        }
    }
    return null;
};