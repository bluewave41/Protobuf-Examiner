import { useState, useRef } from 'react';
import Box from '@mui/material/Box';
import { chunk, getSubField } from '../lib/Utilities';
import HexPanel from '../components/HexPanel';
import TextPanel from '../components/TextPanel';
import InfoPanel from '../components/InfoPanel';
import ProtobufReader from '../lib/ProtobufReader';
import ProtoBuilder from '../lib/ProtoBuilder';
import RawProtobufPanel from '../components/RawProtobufPanel';

const Column = (props) => {
    return (
        <Box
            sx={{
                flex: props.width
            }}
        >
            {props.children}
        </Box>
    )
}

const hexprotobuf = (props) => {
    const [hex, setHex] = useState([]);
    const [hoverIndex, setHoverIndex] = useState(null);
    const [clicked, setClicked] = useState(-1);
    const [schema, setSchema] = useState(null);
    const [showHex, setShowHex] = useState(true);
    const protobuf = useRef(null);

    const onChange = (e) => {
        const reader = new FileReader();
        reader.onload = function (event) {
            const buffer = new Buffer(event.target.result);
            const proto = new ProtobufReader(buffer);
            proto.process();

            protobuf.current = proto;

            const hex = chunk(chunk(Buffer.from(buffer).toString('hex').toUpperCase(), 2), 16);

            setHex(hex);
            setSchema(proto.getSchema());
        }
        reader.readAsArrayBuffer(event.target.files[0]);
    }

    const onHover = (id) => {
        setHoverIndex(id);
    }
    const onClick = (id) => {
        setClicked(id);
    }
    const onTypeChange = (field, newType) => {
        debugger;
        const tempSchema = protobuf.current.getSchema();
        field = getSubField(tempSchema, field);

        tempSchema[field] = {
            type: newType,
            fields: null,
            data: tempSchema[field].data
        }
        setSchema({
            ...schema,
            [field]: {
                type: newType,
                fields: null,
                data: tempSchema[field].data
            }
        })
        const parsed = protobuf.current.parseSchema(ProtoBuilder.build(tempSchema));

        //build schema from the response
        console.log('NEW TYPE', parsed);
    }

    if (!hex.length) {
        return (
            <input type="file" onChange={onChange} />
        )
    }
    else {
        return (
            <Box
                sx={{
                    display: 'flex'
                }}
            >
                <button onClick={() => setShowHex(!showHex)}>Change</button>
                <Column width='40%'>
                    <InfoPanel protoKey={protobuf.current.readVarintAt(clicked)} fields={protobuf.current.schema} onTypeChange={onTypeChange} />
                </Column>
                {showHex &&
                    <Column width='60%'>
                        <Box
                            sx={{
                                display: 'flex',
                                height: '90vh',
                                overflow: 'auto',
                            }}
                        >
                            <HexPanel hex={hex} onHover={onHover} hoverIndex={hoverIndex} clicked={clicked} onClick={onClick} />
                            <TextPanel hex={hex} onHover={onHover} hoverIndex={hoverIndex} clicked={clicked} onClick={onClick} />
                        </Box>
                    </Column>
                }
                {!showHex &&
                    <RawProtobufPanel display={JSON.stringify(protobuf.current.parsed, null, 2)} />
                }
            </Box>

        )
    }
}

export default hexprotobuf;