import Grid from '@mui/material/Grid';
import FieldTree from './FieldTree';
import Box from '@mui/material/Box';

const InfoPanel = (props) => {
    return (
        <Box>
            <Grid container spacing={3}>
                <Grid item>
                    Key:
            </Grid>
                <Grid item>
                    {props.protoKey?.wire}
                </Grid>
                <Grid item>
                    {props.protoKey?.field}
                </Grid>
                <Grid item>
                    {props.protoKey?.length}
                </Grid>
            </Grid>
            <Box>
                <FieldTree 
                    fields={props.fields} 
                    onTypeChange={props.onTypeChange} 
                />
            </Box>
        </Box>
    )
}

export default InfoPanel;