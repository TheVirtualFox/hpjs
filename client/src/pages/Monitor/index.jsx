import {
    activeTimestampSelector,
    controlPanelSelector,
    currentPresetSelector, diffDays,
    relaysStateSelector, secondsOfDaySelector, secondsOfDayToString,
    useGlobalStore, UTCTimestampToDateString
} from "../../store/useGlobalStore.js";

import {useState, useRef, useEffect} from "react";
import {Card} from "flowbite-react";
import {AccordionPanel} from "../../components/AccordionPanel/index.jsx";


const MoreInfoIcon = () => (
    <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
         width="24" height="24" fill="none" viewBox="0 0 24 24">
        <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M12 6h.01M12 12h.01M12 18h.01"/>
    </svg>
);

const MoreInfoButton = ({open, onClick}) => (
    <button onClick={onClick}
            className={`border text-xs p-1 px-2 rounded-sm font-semibold transition-300 ${open ? 'border-green-500 bg-green-500 text-white' : ''}`}>
        Подробнее
    </button>
);


const RelayMonitor = ({label, icon, isOn, isManualControl, preset}) => {
    const [isOpen, setIsOpen] = useState(false);
    const secondsOfDay = useGlobalStore(secondsOfDaySelector);
    return (
        <div className="flex flex-col border">

            <div className="flex items-center p-4 bg-white rounded">
                <div
                    className={`${isOn ? 'text-green-500' : 'text-gray-300'} flex flex-shrink-0 items-center justify-center border h-12 w-12`}>
                    {icon}
                </div>
                <div className="flex-grow flex flex-col ml-4">
                    <div className="flex items-center justify-between">
                        <span className="text-md font-bold">{label}</span>
                        {!!preset?.length && <MoreInfoButton open={isOpen} onClick={() => setIsOpen((prev) => !prev)}/>}
                    </div>

                    <div className="flex items-center justify-between">
                    <span
                        className="text-sm text-gray-500"> {isManualControl ? 'Ручное управление' : 'Авто управление'}</span>
                        {/*<span className="text-green-500 text-sm font-semibold ml-2">{isOn ? 'Вкл' : 'Выкл'}</span>*/}
                    </div>
                </div>


            </div>


            <AccordionPanel open={isOpen}>
                <div className="text-xs border-b py-2 px-4 bg-gray-500 font-semibold text-gray-200">Расписание:</div>
                <div className={"text-gray-500 py-2 px-4 bg-gray-200"}>
                    {preset?.map(({on, off}) => (
                        <div
                            className={`text-sm ${isInRange(secondsOfDay, on, off) ? "text-gray-700" : "text-gray-500"}`}>{secondsOfDayToString(on)} - {secondsOfDayToString(off)}</div>
                    ))}
                </div>
            </AccordionPanel>
        </div>

    );
};

const isInRange = (secondsOfDay, on, off) => {
    return secondsOfDay >= on && secondsOfDay <= off;
}

const PumpIcon = () => (<svg
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        fill="currentColor"
        version="1.1"
        id="Capa_1"
        width="32px"
        height="32px"
        viewBox="0 0 592.875 592.875"
        xml:space="preserve"
    >
    <g>
        <g>
            <rect x="277.312" y="196.031" width="28.688" height="47.812"></rect>
            <polygon
                points="258.188,253.406 258.188,272.531 325.125,272.531 325.125,253.406 315.562,253.406 306,253.406 267.75,253.406       "
            ></polygon>
            <polygon
                points="420.75,377.719 344.25,377.719 344.25,349.031 344.25,339.469 353.812,339.469 353.812,320.344 334.688,320.344     334.688,282.094 325.125,282.094 248.625,282.094 248.625,320.344 239.062,320.344 229.5,320.344 229.5,339.469 239.062,339.469     239.062,377.719 229.5,377.719 162.562,377.719 162.562,387.281 153,387.281 153,444.656 162.562,444.656 162.562,454.219     239.062,454.219 239.062,463.781 344.25,463.781 344.25,454.219 420.75,454.219 420.75,444.656 439.875,444.656 439.875,396.844     439.875,387.281 420.75,387.281   "
            ></polygon>
            <polygon
                points="124.312,396.844 0,396.844 0,435.094 124.312,435.094 133.875,435.094 143.438,435.094 143.438,396.844     133.875,396.844   "
            ></polygon>
            <polygon
                points="449.438,396.844 449.438,435.094 459,435.094 592.875,435.094 592.875,396.844 459,396.844   "
            ></polygon>
            <path
                d="M267.75,165.431v21.038h47.812v-16.734v-4.781h4.781c31.557-0.956,62.156-3.347,91.8-7.172c0,0,11.476-1.435,18.647-2.391    v-10.519v-1.435v-0.956c0-7.172-5.738-13.388-13.388-13.388h-31.078c-7.172,0-13.388,9.562-13.388,9.562h-9.562    c0,0-5.737-9.562-13.388-9.562h-31.078c-7.172,0-13.388,9.562-13.388,9.562h-9.562c0,0-5.738-9.562-13.388-9.562h-31.078    c-7.172,0-13.388,9.562-13.388,9.562h-9.562c0,0-5.737-9.562-13.387-9.562h-31.078c-7.172,0-13.388,5.737-13.388,13.388v16.734    c10.997,1.434,44.944,5.259,90.844,6.215H267.75z"
            ></path>
            <path d="M162.562,142.481L162.562,142.481L162.562,142.481z"></path>
        </g>
    </g>
</svg>
);

const LightIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        fill="currentColor"
        version="1.1"
        id="Capa_1"
        width="24px"
        height="24px"
        viewBox="0 0 474.3 474.3"
        xml:space="preserve"
        className="rotate-180"
    >
    <g>
        <g>
            <polygon
                points="266.076,0 213.961,0 202.008,31.557 278.03,31.557   "
            ></polygon>
            <polygon
                points="239.779,330.385 255.559,316.041 255.559,123.834 224.48,123.834 224.48,316.041   "
            ></polygon>
            <path
                d="M297.155,201.769v-77.935h-31.079v187.903l24.385,21.994c1.913,1.912,1.913,5.26,0.479,7.172    c-1.913,1.912-5.26,1.912-7.172,0.479l-18.646-16.734c-0.957,0.956-24.863,19.125-24.863,19.125s-23.906-18.169-24.862-19.125    l-18.647,16.734c-1.913,1.912-5.259,1.434-7.172-0.479s-1.434-5.26,0.478-7.172l24.384-21.516V123.834h-31.078V198.9    c-52.115,21.516-88.931,72.196-88.931,132.44c0,78.891,64.069,142.959,142.959,142.959c78.891,0,142.481-64.068,142.481-142.959    C379.87,273.487,345.924,224.719,297.155,201.769z"
            ></path>
            <path
                d="M172.842,113.794h128.137c7.65,0.478,13.866-5.737,13.866-13.388v-3.825c0-7.65-6.216-13.866-13.866-13.866H172.842    c-7.65-0.478-13.866,5.737-13.866,13.388v3.825C158.977,107.578,165.192,113.794,172.842,113.794z"
            ></path>
            <path
                d="M172.842,72.197h128.137c7.65,0.478,13.866-5.738,13.866-13.388v-3.825c0-7.65-6.216-13.865-13.866-13.865H172.842    c-7.65-0.479-13.866,5.737-13.866,13.387v3.825C158.977,65.981,165.192,72.197,172.842,72.197z"
            ></path>
        </g>
    </g>
</svg>

);

const AirIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        fill="currentColor"
        version="1.1"
        id="Capa_1"
        width="24px"
        height="24px"
        viewBox="0 0 455.987 455.987"
        xml:space="preserve"
    >
    <g>
        <path
            d="M95.9,118.674l-6.637-2.917l1.16-2.649l6.638,2.903L95.9,118.674z M78.923,108.072l-11.505-5.042l-1.165,2.66l11.51,5.031   L78.923,108.072z M55.916,97.99l-6.64-2.914l-1.166,2.662l6.64,2.914L55.916,97.99z M91.788,125.525l1.277,2.619l6.506-3.196   l-1.277-2.605L91.788,125.525z M69.229,136.581l1.277,2.605l11.287-5.524l-1.284-2.605L69.229,136.581z M51.44,145.29l1.278,2.604   l6.51-3.196l-1.284-2.604L51.44,145.29z M95.022,119.473l-7.24,0.309l0.119,2.903l7.245-0.32L95.022,119.473z M75.229,120.327   l-12.544,0.536l0.118,2.892l12.545-0.539L75.229,120.327z M42.898,121.691l0.119,2.903l7.239-0.306l-0.124-2.903L42.898,121.691z    M413.089,140.179v269.592c0,25.527-20.689,46.217-46.211,46.217h-81.645c-25.529,0-46.219-20.689-46.219-46.217V170.505   c-8.443,2.101-12.404,5.064-14.214,7.144c-2.223,2.561-2.045,4.739-2.013,4.979l0.191,0.887l-0.068,0.561v206.292   c0,31.176-25.367,56.548-56.548,56.548c-31.183,0-56.548-25.363-56.548-56.548V193.299h-1.442v-67.405l-6.78-5.501l6.78-8.337   v-6.121h19.517v87.369h-1.27v197.068c0,21.912,17.822,39.738,39.737,39.738c21.91,0,39.738-17.826,39.738-39.738V184.658   c-0.329-2.848-0.418-9.924,5.162-17.007c5.502-6.971,14.859-11.71,27.751-14.271v-13.196c0-25.514,20.689-46.206,46.216-46.206   h20.03V82.934c-14.157-7.3-23.888-22.044-23.888-39.026C281.367,19.702,301.072,0,325.275,0c24.21,0,43.909,19.702,43.909,43.908   c0,10.875-4.007,20.829-10.595,28.498h28.411v-9.677c0-3.204,2.592-5.798,5.795-5.798c3.199,0,5.795,2.594,5.795,5.798v26.528   c0,3.204-2.596,5.797-5.795,5.797c-3.203,0-5.795-2.593-5.795-5.797v-8.153h-38.529c-0.542,0.342-1.079,0.689-1.63,1.007v11.863   h20.026C392.399,93.973,413.089,114.666,413.089,140.179z M344.971,72.4c9.034-6.258,14.975-16.692,14.975-28.498   c0-19.12-15.549-34.663-34.659-34.663c-19.112,0-34.67,15.538-34.67,34.663c0,11.806,5.943,22.24,14.993,28.498h38.599   c0.024,0,0.038,0,0.057,0H344.971z M384.111,143.815h-5.8v245.594h5.8V143.815z M326.052,39.855c-0.602,0-1.188,0.118-1.738,0.31   l-19.055-4.731l15.223,11.645c0.64,2.496,2.89,4.331,5.57,4.331c3.197,0,5.779-2.583,5.779-5.765   C331.831,42.452,329.249,39.855,326.052,39.855z"
        ></path>
    </g>
</svg>

);

const FanIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        fill="currentColor"
        version="1.1"
        id="Capa_1"
        width="23px"
        height="23px"
        viewBox="0 0 482.906 482.906"
        xml:space="preserve"
    >
    <g>
        <path
            d="M241.453,0C144.566,0,65.742,78.824,65.742,175.711c0,84.169,59.517,154.635,138.656,171.704   c3.146,0.679,6.359,1.138,9.562,1.645v47.784h57.375v-48.156c3.213-0.555,6.407-1.167,9.562-1.894   c77.925-17.969,136.266-87.774,136.266-171.083C417.164,78.824,338.341,0,241.453,0z M280.898,336.935   c-3.165,0.774-6.33,1.501-9.562,2.095c-9.716,1.769-19.67,2.84-29.883,2.84c-9.381,0-18.532-0.966-27.492-2.467   c-3.213-0.536-6.407-1.119-9.562-1.846c-73.813-16.907-129.094-82.975-129.094-161.836c0-91.628,74.53-166.158,166.148-166.158   s166.148,74.53,166.148,166.148C407.602,253.712,353.507,319.148,280.898,336.935z"
        ></path>
        <path
            d="M227.023,152.445c4.207-2.62,9.122-4.198,14.43-4.198c2.209,0,4.332,0.334,6.388,0.822l54.688-116.108   c-8.884-3.596-17.768-5.317-26.899-5.317c-27.77,0-53.35,16.218-65.169,41.32c-8.186,17.394-9.113,36.93-2.61,55.022   C211.848,135.118,218.551,144.671,227.023,152.445z"
        ></path>
        <path
            d="M282.725,172.986c-4.733,0-9.381,0.497-13.933,1.396c0.02,0.449,0.134,0.87,0.134,1.329c0,7.201-2.84,13.703-7.392,18.599   l57.413,112.885c15.377-8.912,26.747-22.95,32.273-39.933c5.958-18.284,4.438-37.782-4.274-54.918   C334.592,188.065,309.987,172.986,282.725,172.986z"
        ></path>
        <path
            d="M216.973,187.913l-128.31,13.541c5.919,35.065,35.591,60.436,70.877,60.444c0.01,0,0.01,0,0.01,0   c2.534,0,5.068-0.134,7.641-0.401c33.115-3.5,58.637-29.061,63.542-60.502C224.719,198.441,219.89,193.736,216.973,187.913z"
        ></path>
        <path
            d="M257.365,167.659c-1.186-2.333-2.859-4.36-4.896-5.967c-1.262-0.995-2.61-1.875-4.102-2.505   c-1.482-0.622-3.089-0.966-4.733-1.176c-0.718-0.086-1.425-0.22-2.171-0.22c-2.171,0-4.217,0.449-6.14,1.147   c-1.778,0.65-3.404,1.578-4.867,2.735c-1.291,1.014-2.448,2.17-3.413,3.5c-2.171,2.965-3.491,6.579-3.491,10.528   c0,0.641,0.124,1.253,0.191,1.884c0.172,1.635,0.517,3.213,1.1,4.686c0.66,1.654,1.578,3.155,2.678,4.523   c1.157,1.454,2.477,2.764,4.026,3.796c1.434,0.956,3.04,1.645,4.724,2.151c1.473,0.45,3.012,0.746,4.628,0.803   c0.191,0.01,0.373,0.058,0.574,0.058c2.888,0,5.584-0.756,8.004-1.97c1.453-0.736,2.792-1.635,3.978-2.715   c1.291-1.176,2.4-2.525,3.309-4.036c1.405-2.333,2.276-5.011,2.486-7.879c0.028-0.44,0.134-0.861,0.134-1.31   c0-1.243-0.124-2.448-0.373-3.615C258.675,170.519,258.072,169.056,257.365,167.659z"
        ></path>
        <path
            d="M381.305,406.406H280.898h-9.562h-66.938H103.992c-7.908,0-14.344,6.436-14.344,14.344v62.156h306V420.75   C395.648,412.842,389.213,406.406,381.305,406.406z M376.523,444.656h-9.562h-19.125h-9.562h-19.125h-9.562h-19.125h-9.562h-28.688   v-19.125v-9.562h124.312V444.656z"
        ></path>
        <rect x="347.836" y="425.531" width="19.125" height="9.562"></rect>
        <rect x="261.773" y="425.531" width="19.125" height="9.562"></rect>
        <rect x="319.148" y="425.531" width="19.125" height="9.562"></rect>
        <rect x="290.461" y="425.531" width="19.125" height="9.562"></rect>
    </g>
</svg>

);

const RelaysMonitor = () => {
    const relaysState = useGlobalStore(relaysStateSelector);
    const controlPanel = useGlobalStore(controlPanelSelector);
    const currentPreset = useGlobalStore(currentPresetSelector);
    const {isManualControl} = controlPanel;
    return <>
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-2 w-full max-w-6xl">
            <RelayMonitor
                label={'Насос'}
                icon={<PumpIcon/>}
                isManualControl={isManualControl}
                isOn={relaysState?.pump}
                preset={currentPreset?.pump}
            />
            <RelayMonitor
                label={'Лампы'}
                icon={<LightIcon/>}
                isManualControl={isManualControl}
                isOn={relaysState?.light}
                preset={currentPreset?.light}
            />
            <RelayMonitor label={'Аэратор'} icon={<AirIcon/>} isManualControl={isManualControl}
                          isOn={relaysState?.air} preset={currentPreset?.air}/>
            <RelayMonitor label={'Обдув'} icon={<FanIcon/>} isManualControl={isManualControl}
                          isOn={relaysState?.fan} preset={currentPreset?.fan}/>
        </div>
    </>;
}

const CurrentPresetMonitor = () => {
    const currentPreset = useGlobalStore(currentPresetSelector);
    const activeTimestamp = useGlobalStore(activeTimestampSelector);
    if (!currentPreset) {
        return null;
    }
    return (
        <div
            className="rounded-sm border relative border-gray-300 bg-white  p-3 px-4 min-w-full  border"
        >
            <div>
                <p className="text-sm text-gray-500 font-semibold">Пресет</p>
                <div className="text-2xl font-medium text-gray-900">
                    {currentPreset.label}
                </div>

                <div className="flex gap-2 text-xs text-green-600 mb-2 items-end">
                    <span className="text-gray-500">Дата включения пресета: </span>
                    <span className="font-medium">
                        {activeTimestamp && `${UTCTimestampToDateString(activeTimestamp)} дней`}
                        {activeTimestamp && diffDays(activeTimestamp)}
                    </span>
                </div>


            </div>
        </div>
    );
};

export const MonitorPage = () => {
    return <>

        <div className="flex flex-col items-center justify-center text-gray-800 p-2 gap-2">

            <CurrentPresetMonitor/>
            <RelaysMonitor/>


        </div>

    </>;
};