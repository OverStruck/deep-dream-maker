import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';

const layers = [
    "conv1/7x7_s2",
    "pool1/3x3_s2",
    "pool1/norm1",
    "conv2/3x3",
    "conv2/3x3_reduce",
    "conv2/norm2",
    "pool2/3x3_s2",
    "inception_3a/1x1",
    "inception_3a/3x3",
    "inception_3a/3x3_reduce",
    "inception_3a/5x5",
    "inception_3a/5x5_reduce",
    "inception_3a/output",
    "inception_3a/pool",
    "inception_3a/pool_proj",
    "pool3/3x3_s2",
    "inception_3b/1x1",
    "inception_3b/3x3",
    "inception_3b/3x3_reduce",
    "inception_3b/5x5",
    "inception_3b/5x5_reduce",
    "inception_3b/output",
    "inception_3b/pool",
    "inception_3b/pool_proj",
    "inception_4a/1x1",
    "inception_4a/3x3",
    "inception_4a/3x3_reduce",
    "inception_4a/5x5",
    "inception_4a/5x5_reduce",
    "inception_4a/output",
    "inception_4a/pool",
    "inception_4a/pool_proj",
    "inception_4b/1x1",
    "inception_4b/3x3",
    "inception_4b/3x3_reduce",
    "inception_4b/5x5",
    "inception_4b/5x5_reduce",
    "inception_4b/output",
    "inception_4b/pool",
    "inception_4b/pool_proj",
    "inception_4c/1x1",
    "inception_4c/3x3",
    "inception_4c/3x3_reduce",
    "inception_4c/5x5",
    "inception_4c/5x5_reduce",
    "inception_4c/output",
    "inception_4c/pool",
    "inception_4c/pool_proj",
    "inception_4d/1x1",
    "inception_4d/3x3",
    "inception_4d/3x3_reduce",
    "inception_4d/5x5",
    "inception_4d/5x5_reduce",
    "inception_4d/output",
    "inception_4d/pool",
    "inception_4d/pool_proj",
    "inception_4e/1x1",
    "inception_4e/3x3",
    "inception_4e/3x3_reduce",
    "inception_4e/5x5",
    "inception_4e/5x5_reduce",
    "inception_4e/output",
    "inception_4e/pool",
    "inception_4e/pool_proj",
    "pool4/3x3_s2",
    "inception_5a/1x1",
    "inception_5a/3x3",
    "inception_5a/3x3_reduce",
    "inception_5a/5x5",
    "inception_5a/5x5_reduce",
    "inception_5a/output",
    "inception_5a/pool",
    "inception_5a/pool_proj",
    "inception_5b/1x1",
    "inception_5b/3x3",
    "inception_5b/3x3_reduce",
    "inception_5b/5x5",
    "inception_5b/5x5_reduce",
    "inception_5b/output",
    "inception_5b/pool",
    "inception_5b/pool_proj",
    "pool5/7x7_s1"
]

function LayerSelector({ data, disabled }) {
    const { onChange, value } = data;
    return (
        <Grid item container spacing={3} >
            <Grid item style={{ alignSelf: "flex-end" }}>
                <label htmlFor="layer">Select layer (blob): </label>
            </Grid>
            <Grid item >
                <TextField select value={value} onChange={onChange} name="layer" disabled={disabled} >
                    {layers.map(layer => (
                        <MenuItem key={layer} value={layer}>
                            {layer}
                        </MenuItem>
                    ))}
                </TextField>
            </Grid>
        </Grid>
    );
}

export default LayerSelector