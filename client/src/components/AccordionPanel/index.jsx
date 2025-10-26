import {memo, useCallback, useEffect, useRef, useState} from "react";

export const AccordionPanel = ({open, title = "Подробнее", children }) => {
    const [height, setHeight] = useState("0px");
    const contentRef = useRef(null);

    useEffect(() => {
        if (open && contentRef.current) {
            setHeight(`${contentRef.current.scrollHeight}px`);
        } else {
            setHeight("0px");
        }
    }, [open, children]);

    return (
        <div className={``}>
            {/* Контейнер с анимацией по высоте */}
            <div
                style={{ height }}
                className={`${open ? '!border-green-500' : ''} border-transparent border overflow-hidden transition-all duration-300 ease-in-out`}
            >
                <div ref={contentRef} className=" text-gray-700 border-t1">
                    {children}
                </div>
            </div>
        </div>
    );
}

const Angle = memo(({isRotated}) => {
    return (
        // <svg className={`${isRotated ? 'rotate-180' : ''} items-center border origin-center transition-transform duration-300 w-4 h-4 text-gray-800`} aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
        //      width="24" height="24" fill="none" viewBox="0 0 24 24">
        //     <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
        //           d="m19 9-7 7-7-7"/>
        // </svg>

    <svg className={`${isRotated ? 'rotate-180' : ''} items-center border origin-center transition-transform duration-300 w-3 h-3 text-gray-800`} aria-hidden="true"
         xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 8">
        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
              d="m1 1 5.326 5.7a.909.909 0 0 0 1.348 0L13 1"/>
    </svg>
    );
});


export const AnimatedAccordion = memo(({label, children, defaultOpen = false}) => {
    console.log("Animated", label, children);
    const [isOpen, setIsOpen] = useState(defaultOpen);
    const onClick = useCallback(() => {
        setIsOpen((isOpen) => !isOpen);
    }, [setIsOpen]);
    return (
        <div>
            <div className={`bg-gray-200 ${isOpen ? 'bg-gray-300' : ''} items-center flex justify-between p-2 px-4 text-gray-700 font-semibold text-sm`}
                 onClick={onClick}>
                {label}

                <Angle isRotated={isOpen} />
            </div>
            <AccordionPanel open={isOpen}>
                <div className="p-4">
                    {children}
                </div>
            </AccordionPanel>
        </div>
    );
});