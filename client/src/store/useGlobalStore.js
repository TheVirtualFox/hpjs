import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

const getInitState = () => ({
    isConnected: false,
    controlPanel: { isManualControl: false, pump: false, light: false, air: false, fan: false},
    relaysState: { pump: false, light: false, air: false, fan: false },
    serverTimestamp: null,
    presetsList: [],
    currentPreset: null,
    secondsOfDay: 0,
});

export const useGlobalStore = create(devtools(getInitState));

const get = useGlobalStore.getState;
const set = useGlobalStore.setState;

export const setIsConnected = (isConnected) => {
    set({isConnected});
};

export const setControlPanel = (controlPanel) => {
    set({controlPanel});
}

export const setPresetsList = (presetsList) => {
    console.log(presetsList);
    set({presetsList: presetsList?.sort((a, b) => {
            // Сначала сортируем по isActive
            if (a?.isActive && !b?.isActive) return -1;
            if (!a?.isActive && b?.isActive) return 1;

            // Если оба равны по isActive, сортируем по label
            const aStr = a?.label?.toLowerCase() || '';
            const bStr = b?.label?.toLowerCase() || '';
            return aStr.localeCompare(bStr);
        })   });
};

let secondsOfDayInterval = null;
const setSecondsOfDay = (secondsOfDay) => {
    set({secondsOfDay});
    if (secondsOfDayInterval) {
        clearInterval(secondsOfDayInterval);
        secondsOfDayInterval = null;
    }
    secondsOfDayInterval = setInterval(() => {
        set({secondsOfDay: get().secondsOfDay % 86400 + 1 });
    }, 1000);
}

export const setServerTimestamp = (serverTimestamp) => {
    const d = new Date(serverTimestamp * 1000);
    const timestamp = HMSToSecondsOfDay(dateToHMS(new Date(d.getTime() + d.getTimezoneOffset() * 60_000)));
    set({serverTimestamp: timestamp });
    setSecondsOfDay(timestamp % 86400 + 1);
};

export const setRelaysState = (relaysState) => {
    set({relaysState});
};

export const setCurrentPreset = (currentPreset) => {
    set({currentPreset});
};

export const isConnectedSelector = (state) => state.isConnected;

export const controlPanelSelector = (state) => state.controlPanel;

export const serverTimestampSelector = (state) => state.serverTimestamp;

export const relaysStateSelector = (state) => state.relaysState;

export const currentPresetSelector = (state) => state.currentPreset;

export const secondsOfDaySelector = (state) => state.secondsOfDay;

export const activeTimestampSelector = (state) => {
    const id = state.currentPreset?.id;
    return getLocalTimestamp(state.presetsList?.find((p) => p?.id === id)?.activeTimestamp);
};


export const getLocalTimestamp = (utcTimestamp) => {
    const newDate = new Date();
    return utcTimestamp + (newDate.getTimezoneOffset() * 60);
};

export const secondsOfDayToHMS = (secondsOfDay) => {
    const h = Math.floor(secondsOfDay / 3600);
    const m = Math.floor((secondsOfDay % 3600) / 60);
    const s = secondsOfDay % 60;
    return {h,m,s};
}

export const secondsOfDayToString = (secondsOfDay) => {
    const {h,m,s} = secondsOfDayToHMS(secondsOfDay);
    const hStr = h.toString().padStart(2, '0');
    const mStr = m.toString().padStart(2, '0');
    const sStr = s.toString().padStart(2, '0');
    return `${hStr}:${mStr}:${sStr}`;
}
export const secondsOfDayToDate = (secondsOfDay) => {
    const {h,m,s} = secondsOfDayToHMS(secondsOfDay);
    const date = new Date();
    date.setUTCFullYear(0,0,0);
    date.setHours(h,m,s, 0);
    return date;
}
export const dateToHMS = (date = new Date()) => {
    const h = date.getHours();
    const m = date.getMinutes();
    const s = date.getSeconds();
    return {h,m,s};
};
export const dateToSecondsOfDay = (date = new Date()) => {
    const h = date.getHours();
    const m = date.getMinutes();
    const s = date.getSeconds();
    return HMSToSecondsOfDay({h,m,s});
};
export const HMSToSecondsOfDay = ({h,m,s}) => {
    return h * 3600 + m * 60 + s;
};
export const secondsOfDayStringSelector = (state) => secondsOfDayToString(state.secondsOfDay);
export const presetsListSelector = (state) => state.presetsList;


export const UTCTimestampToDateString = (utcTimestamp) => {
    const d = new Date(utcTimestamp * 1000);
    const formatter = new Intl.DateTimeFormat('ru-RU', {
        // weekday: 'long',   // день недели
        year: 'numeric',
        month: 'long',     // название месяца
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        // timeZoneName: 'short'
    });
    return formatter.format(d);
};
export const diffDays = ( utcTimestamp, now = (new Date()).getTime()) => {
    const diffMs = now - utcTimestamp * 1000;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    return diffDays;
};