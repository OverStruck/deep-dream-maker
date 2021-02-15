import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';

function createInceptionLayers(layerID) {
    const variants = ["1x1", "3x3", "5x5", "output", "pool", "pool_proj"];
    const simpleLayers = variants.map((variant) => layerID + "/" + variant);
    const reluL = variants.filter((v) => !["output", "pool"].includes(v))
        .map((variant) => layerID + "/relu_" + variant);
    const reduceL = variants.filter((v) => !["1x1", "output", "pool", "pool_proj"].includes(v))
        .map((variant) => layerID + "/" + variant + "_reduce");
    const reluReduceL = reluL.filter((v) => ![
        "inception_3a/relu_1x1",
        "inception_3a/relu_pool_proj"].includes(v))
        .map((variant) => variant + "_reduce");

    return [].concat(simpleLayers, reluL, reduceL, reluReduceL);
}

function createLayers() {
    const inceptionLayer = "inception_"
    let inceptionLayerIDs = [
        ["a", "b"],
        ["a", "b", "c", "d", "e"],
        ["a", "b"]
    ].map((set, i) => set.map(letter => (inceptionLayer + (i + 3) + letter)))

        .flat().map(name => createInceptionLayers(name)).flat();

    let layers = [
        "conv1/7x7_s2",
        "conv1/relu_7x7",
        "pool1/3x3_s2",
        "pool1/norm1",
        "conv2/3x3_reduce",
        "conv2/relu_3x3_reduce",
        "conv2/3x3",
        "conv2/relu_3x3",
        "conv2/norm2",
        "pool2/3x3_s2",
        "pool3/3x3_s2",
        "pool4/3x3_s2",
        "pool5/7x7_s1",
        "pool5/drop_7x7_s1"
    ].concat(inceptionLayerIDs);

    return layers;
}

function LayerSelector({ data, disabled }) {
    const { onChange, value } = data;
    return (
        <Grid item container spacing={3} >
            <Grid item style={{ alignSelf: "flex-end" }}>
                <label htmlFor="layer">Select layer (blob): </label>
            </Grid>
            <Grid item >
                <TextField select value={value} onChange={onChange} name="layer" disabled={disabled} >
                    {createLayers().map((layer) => (
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