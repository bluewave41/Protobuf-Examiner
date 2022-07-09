import Box from '@mui/material/Box';
import { memo } from 'react';
import { FixedSizeGrid as Grid, areEqual } from 'react-window';

const TextByte = (props) => {
    const onMouseEnter = () => {
        props.onHover(props.index);
    }

    return (
        <span
            style={{
                display: 'inline-block',
                paddingTop: '5px',
                paddingBottom: '5px',
                backgroundColor: props.hoverIndex == props.index ? '#333' : 'transparent'
            }}
            onMouseEnter={onMouseEnter}
        >
            {props.byte}
        </span>
    )
}

const Cell = memo(function({ data, columnIndex, rowIndex, style }) {
    const val = parseInt(data.hex[rowIndex][columnIndex], 16);
    const char = val < 31 ? '.' : String.fromCharCode(val);

    return (
        <div style={style}>
            <TextByte byte={char} onHover={data.onHover} hoverIndex={data.hoverIndex} index={`${rowIndex} ${columnIndex}`} />
        </div>
    )
}, areEqual);

const TextPanel = (props) => {
    return (
        <Box
            sx={{
                fontFamily: 'Source Code Pro',
                display: 'flex',
                flexDirection: 'column',
                whiteSpace: 'pre'
            }}
        >
            <Grid
                columnCount={16}
                columnWidth={10}
                height={900}
                itemData={props}
                rowCount={props.hex.length}
                rowHeight={35}
                width={300}
            >
                {Cell}
            </Grid>
        </Box>
    )
}

export default TextPanel;