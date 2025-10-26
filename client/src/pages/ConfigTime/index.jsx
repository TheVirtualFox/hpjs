import 'swiper/css';
import {Button} from "flowbite-react";
import {TimePicker} from "../../components/Input/TimePicker.jsx";
import {LabelComponent} from "../../components/Input/LabelComponent.jsx";
import {HelperTextComponent} from "../../components/Input/HelperTextComponent.jsx";
import {useEffect, useState} from "react";
import {dateToHMS, secondsOfDayToHMS, useGlobalStore} from "../../store/useGlobalStore.js";
import {WsService} from "../../service/WsService.js";
import {useRoute} from "../../service/useRoute.jsx";
import {useNavigate} from "react-router-dom";


export const ConfigTimePage = () => {
    return <div className="p-2">
        <TimeForm/>


    </div>;
};

const ws = new WsService();
const TimeForm = () => {
    const [time,setTime] = useState(12*3600);
    const navigate = useNavigate();
    const {back} = useRoute();

    useEffect(() => {
        setTime(useGlobalStore.getState().secondsOfDay);
    }, []);

    // const onSave = () => {
    //     ws.sendPromiseMessage();
    // };

    const onSave = async ({h,m,s}) => {
        const d = new Date();

        //
        //
        // d.setHours(h);
        // d.setMinutes(m);
        // d.setSeconds(s);
        // d.setMilliseconds(0);

        const utcSeconds = Math.floor((new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate(), h,m,s,0 ))).getTime() / 1000);
        await ws.sendPromiseMessage({
            action: 'SET_TIMESTAMP_REQ',
            payload: {timestamp: utcSeconds }
        });
        setTime(useGlobalStore.getState().secondsOfDay);
        navigate(back);
    };

    const onSetSystemTime = async () => {
        // const d = new Date();
        // const h = d.getHours();
        // const m = d.getMinutes();
        // const s = d.getSeconds();
        await onSave(dateToHMS());
    }

    return (
        <div>
            <div className="flex flex-col bg-white p-4">
                <LabelComponent label="Время" />
                <TimePicker value={time} onChange={setTime} />
                <HelperTextComponent>Время</HelperTextComponent>
            </div>
            <Buttons onSave={() => {
                onSave(secondsOfDayToHMS(time));
            } } onSetSystemTime={onSetSystemTime}  />
        </div>
    );
};

const Buttons = ({onSave, onSetSystemTime}) => {
    return (
        <div className="flex p-4 px-2">
            <div className="flex gap-2">
                <Button onClick={onSetSystemTime} type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
                    Установить системное
                </Button>
            </div>
            <div className="flex ml-auto">
                <Button onClick={onSave} type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
                    Сохранить
                </Button>
            </div>
        </div>
    );
};
