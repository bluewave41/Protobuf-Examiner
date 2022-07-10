import Box from '@mui/material/Box';
import { memo } from 'react';
import { FixedSizeGrid as Grid, areEqual } from 'react-window';

const HexByte = (props) => {
    const onMouseEnter = () => {
        props.onHover(props.index);
    }
    const onMouseLeave = () => {
        props.onHover(null);
    }
    const onClick = () => {
        props.onClick(props.index);
    }

    return (
        <span
            style={{
                display: 'inline-block',
                padding: '5px',
                backgroundColor: props.clicked == props.index ? '#555' : props.hoverIndex == props.index ? '#777' : 'transparent',
                color: 'darkblue'
            }}
            onClick={onClick}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            {props.byte}
        </span>
    )
}

const Cell = memo(function ({ data, columnIndex, rowIndex, style }) {
    return (
        <div style={style}>
            <HexByte
                byte={data.hex[rowIndex][columnIndex]}
                onHover={data.onHover}
                hoverIndex={data.hoverIndex}
                index={columnIndex + rowIndex * 16}
                onClick={data.onClick}
                clicked={data.clicked}
            />
        </div>
    )
}, areEqual);

const HexPanel = (props) => {
    return (
        <Box
            sx={{
                fontFamily: 'Source Code Pro',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <Grid
                columnCount={16}
                columnWidth={30}
                height={900}
                itemData={props}
                rowCount={props.hex.length}
                rowHeight={35}
                width={500}
            >
                {Cell}
            </Grid>
        </Box>
    )
}

export default HexPanel;