import TreeView from '@mui/lab/TreeView';
import TreeItem from '@mui/lab/TreeItem';
import Box from '@mui/material/Box';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { useState } from 'react';
import { getSubField } from '../lib/Utilities';

const FieldEntry = (props) => {
    console.log('FIELD ENTRY PROPS', props);
    const onTypeChange = (e) => {
        props.onTypeChange(props.field, e.target.value);
    }
    return (
        <Box>
            {props.type &&
                <Box>
                    <Select value={props.type} onChange={onTypeChange}>
                        <MenuItem value='varint'>Varint</MenuItem>
                        <MenuItem value='string'>String</MenuItem>
                        <MenuItem value='length-encoded'>Length-Encoded</MenuItem>
                        <MenuItem value='32bit'>32 Bit</MenuItem>
                        <MenuItem value='64bit'>64 Bit</MenuItem>
                        <MenuItem value='packed'>Packed</MenuItem>
                        <MenuItem value='group'>Group</MenuItem>
                    </Select>
                </Box>
            }
        </Box>
    )
}

const FieldTree = (props) => {
    console.log('FIELD TREE PROPS', props);
    const [selected, setSelected] = useState(null);
    const onClick = (e) => {
        setSelected(e);
    }
    return (
        <Box>
            <Box>
                <TreeView>
                    {Object.keys(props.fields).map(topKey => (
                        <TreeItem nodeId={topKey} label={topKey} onClick={() => onClick(topKey)}>
                            {props.fields[topKey].fields && 
                                Object.keys(props.fields[topKey].fields).map(subKey => {
                                   return <TreeItem nodeId={`${topKey}_${subKey}`} label={`${topKey}_${subKey}`} onClick={() => onClick(`${topKey}_${subKey}`) }/>
                                })
                            }
                        </TreeItem>
                    ))}
                </TreeView>
            </Box>
            <Box>
                <FieldEntry 
                    field={selected}
                    type={getSubField(props.fields, selected)?.type} 
                    onTypeChange={props.onTypeChange}
                />
            </Box>
        </Box>
    )
}

export default FieldTree;

/*<TreeView
  aria-label="file system navigator"
  defaultCollapseIcon={<ExpandMoreIcon />}
  defaultExpandIcon={<ChevronRightIcon />}
  sx={{ height: 240, flexGrow: 1, maxWidth: 400, overflowY: 'auto' }}
>
  <TreeItem nodeId="1" label="Applications">
    <TreeItem nodeId="2" label="Calendar" />
  </TreeItem>
  <TreeItem nodeId="5" label="Documents">
    <TreeItem nodeId="10" label="OSS" />
    <TreeItem nodeId="6" label="MUI">
      <TreeItem nodeId="8" label="index.js" />
    </TreeItem>
  </TreeItem>
</TreeView>*/