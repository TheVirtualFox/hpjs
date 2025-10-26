import {HelperText} from "flowbite-react";
import {memo} from "react";

export const HelperTextComponent = memo(({error, children}) => (
    <HelperText color={error ? 'failure' : ''}>
        {error ? error : children}
    </HelperText>
));