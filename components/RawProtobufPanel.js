import Box from '@mui/material/Box';
import TextareaAutosize from '@mui/material/TextareaAutosize';

const RawProtobufPanel = (props) => {
    return (
        <TextareaAutosize
            style={{ width: 600}}
        >
            {props.display}
        </TextareaAutosize>
    )
}

export default RawProtobufPanel;