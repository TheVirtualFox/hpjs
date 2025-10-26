import React, {memo, useCallback, useEffect, useRef, useState} from "react";
import {HMSToSecondsOfDay, secondsOfDayToHMS, secondsOfDayToString} from "../../store/useGlobalStore.js";
import {Button, Drawer, DrawerHeader, DrawerItems, TextInput} from "flowbite-react";
import {Swiper, SwiperSlide} from "swiper/react";
const HOURS = new Array(24)
    .fill(0)
    .map((_, index) => index.toString().padStart(2, "0"));

const MINUTES = new Array(60)
    .fill(0)
    .map((_, index) => index.toString().padStart(2, "0"));
const SECONDS = MINUTES;


export const TimePicker = memo(({placeholder, onChange, value = 0, error, label = "Время"}) => {
    // const [h, setH] = useState(0);
    // const [m, setM] = useState(0);
    // const [s, setS] = useState(0);
    console.log("TimePicker 77777777777777777777777777777777777777777777777");
    const [isOpen, setIsOpen] = useState(false);
    const [inputValue, setInputValue] = useState(secondsOfDayToString(value));

    const swiperHRef = useRef(null);
    useEffect(() => {
        const val = Number(value ?? 0);
        setInputValue(secondsOfDayToString(val));

        // setTimeout(() => {
        //     swiperHRef.current?.update?.();
        //     swiperHRef.current?.updateSlides?.();
        // },100);

        const {h,m,s} = secondsOfDayToHMS(val);
        setSlideH(h);
        setSlideM(m);
        setSlideS(s);



    }, [value, isOpen]);

    const onHourChange = ({activeIndex: hour}) => {
        console.log(hour);
        //setH(hour);
    };
    const onMinuteChange = ({activeIndex: minute}) => {
        console.log(minute);
        //setM(minute);
    };
    const onSecondChange = ({activeIndex: second}) => {
        console.log(second);
        //setS(second);
    };

    const onChangeClick = () => {
        const h = swiperHRef.current.realIndex;
        const m = swiperMRef.current.realIndex;
        const s = swiperSRef.current.realIndex;
        const value = HMSToSecondsOfDay({h,m,s});
        onChange(value, {h,m,s});
        setInputValue(secondsOfDayToString(value));
        onClose();
    }

    const onClose = () => {
        setIsOpen(false);
    };

    const setSlideH = (h) => {
        if (swiperHRef.current) {
            swiperHRef.current.slideToLoop(h); // Используй slideToLoop для корректной работы с loop
        }
    }

    const swiperMRef = useRef(null);
    const setSlideM = (m) => {
        if (swiperMRef.current) {
            swiperMRef.current.slideToLoop(m); // Используй slideToLoop для корректной работы с loop
        }
    }

    const swiperSRef = useRef(null);
    const setSlideS = (s) => {
        if (swiperSRef.current) {
            swiperSRef.current.slideToLoop(s); // Используй slideToLoop для корректной работы с loop
        }
    }

    const {h, m, s} = secondsOfDayToHMS(value);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (swiperHRef.current && swiperHRef.current.slideToLoop) {
                swiperHRef.current.slideToLoop(h, 0); // моментальный переход без анимации
            }
            if (swiperMRef.current && swiperMRef.current.slideToLoop) {
                swiperMRef.current.slideToLoop(m, 0); // моментальный переход без анимации
            }
            if (swiperSRef.current && swiperSRef.current.slideToLoop) {
                swiperSRef.current.slideToLoop(s, 0); // моментальный переход без анимации
            }
        }, 50); // задержка позволяет инициализировать loop

        return () => clearTimeout(timer);
    }, [isOpen]);

    const  onClick = useCallback(() => {
        setIsOpen(true);
    }, [setIsOpen]);

    return (
        <>
            <TextInput size={"sm"} onClick={onClick}
                       color={error ? 'failure' : '' }
                       value={inputValue} />
            <Drawer open={isOpen} onClose={onClose} position="bottom">
                <DrawerHeader title={label} titleIcon={() => null} />
                <DrawerItems>
                    {isOpen && (
                        <div className="flex flex-col gap-2">
                            <div className="relative h-72 max-h-72 border overflow-hidden flex gap-1">
                                <div
                                    className="h-14 border border-green-500 w-full absolute top-1/2 -translate-y-1/2"></div>

                                <Swiper
                                    direction="vertical"
                                    centeredSlides={true}
                                    slidesPerView={5}
                                    spaceBetween={10}
                                    // initialSlide={h}

                                    className="h-full"
                                    onSlideChange={onHourChange}


                                    loop={true}
                                    onSwiper={(swiper) => {
                                        swiperHRef.current = swiper;
                                    }}

                                >
                                    {HOURS.map((h) => (
                                        <SwiperSlide key={h}>
                                            <div className="flex items-center justify-center h-12 text-md font-medium">
                                                {h}
                                            </div>
                                        </SwiperSlide>
                                    ))}
                                </Swiper>

                                <div className="flex items-center justify-center items-center text-xl font-medium">:</div>

                                <Swiper
                                    direction="vertical"
                                    centeredSlides={true}
                                    slidesPerView={5}
                                    spaceBetween={10}
                                    initialSlide={m}
                                    loop={true}
                                    className="h-full"
                                    onSlideChange={onMinuteChange}
                                    onSwiper={(swiper) => (swiperMRef.current = swiper)}
                                >
                                    {MINUTES.map((h) => (
                                        <SwiperSlide key={h}>
                                            <div className="flex items-center justify-center h-12 text-md font-medium">
                                                {h}
                                            </div>
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                                <div className="flex items-center justify-center items-center text-xl font-medium">:</div>
                                <Swiper
                                    direction="vertical"
                                    centeredSlides={true}
                                    slidesPerView={5}
                                    spaceBetween={10}
                                    initialSlide={s}
                                    loop={true}
                                    className="h-full"
                                    onSlideChange={onSecondChange}
                                    onSwiper={(swiper) => (swiperSRef.current = swiper)}
                                >
                                    {SECONDS.map((h) => (
                                        <SwiperSlide key={h}>
                                            <div className="flex items-center justify-center h-12 text-md font-medium">
                                                {h}
                                            </div>
                                        </SwiperSlide>
                                    ))}
                                </Swiper>


                            </div>

                            <div className="flex gap-1 justify-end">
                                <Button size="sm" onClick={onClose}>Отмена</Button>
                                <Button size="sm" onClick={onChangeClick}>Ок</Button>
                            </div>

                        </div>

                    )}



                </DrawerItems>
            </Drawer>
        </>
    );
});
