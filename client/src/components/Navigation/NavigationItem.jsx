import {useLottie} from "lottie-react";
import {Link} from "react-router-dom";

export const NavigationItem = ({label, icon, to, isActive}) => {
    const {View, playSegments} = useLottie(icon);

    return (<Link
            to={to}
            type="button"
            onClick={() => playSegments([0, icon.animationData.op], true)}
            className={`inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 group ${isActive ? 'bg-gray-50' : ''}`}
        >
            <div className="h-7 w-7">
                {View}
            </div>
            <span className="text-sm text-gray-700 dark:text-gray-400 ">
        {label}
      </span>
        </Link>);
};
