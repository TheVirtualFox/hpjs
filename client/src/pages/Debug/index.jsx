import ReactJson from "react-json-view";
import {useGlobalStore} from "../../store/useGlobalStore.js";

export const DebugPage = () => {
    const store = useGlobalStore();
    return (
        <div className="">
            <ReactJson
                src={store}
                theme="ocean"
                iconStyle="triangle"
                displayDataTypes={false}

                displayObjectSize={false}
                quotesOnKeys={false}
                enableClipboard={false}
            />
        </div>
    );
};