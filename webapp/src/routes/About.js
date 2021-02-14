import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import makeStyles from "@material-ui/core/styles/makeStyles";

const useStyles = makeStyles({
    container: {
        padding: 10,
        maxWidth: 700,
        margin: "0 auto",
        backgroundColor: "#212121"
    },
    bold: {
        fontWeight: "bold"
    }
});

function About() {
    const classes = useStyles();
    return (
        <Paper elevation={3} square className={classes.container} >
            <Typography color="textPrimary" variant="h4" align="center" display="block">About</Typography>
            <Divider />
            <Typography paragraph display="block">
                DeepDream Maker is a single page web application that wraps around Google's Deep Dream and related python scripts.
                It allows you to easily dreamify images without needing to use a terminal and provides a flexible and intuitive way to customize your dreams by specifying different parameters.
            </Typography>
            <Typography variant="h6" align="left" display="block">Recommendations:</Typography>
            <Typography component={"div"} display="block">
                The resolution of the image affects the output result.
                <ul>
                    <li>Use small images whenever possible, depending on your system's resources the program may fail.</li>
                    <li>Try out different parameters</li>
                    <li>Be mindful of your parameters: the higher the numbers the longer the render</li>
                </ul>
            </Typography>

            <Typography variant="h6" align="left" display="block">TODO:</Typography>
            <Typography component={"div"} align="left" display="block">
                <ul>
                    <li><span className={classes.bold}>Add support to create animations</span>
                        <ul>
                            <li>Create videos</li>
                            <li>Create gifts</li>
                            <li>Options for zoom and rotation</li>
                        </ul>
                    </li>
                    <li className={classes.bold}>Multi-processing support</li>
                    <li><span className={classes.bold}>Error checking</span>
                        <ul>
                            <li>End-user message for edge cases:</li>
                            <ul>
                                <li>Ran out of memory</li>
                                <li>Image may be too large</li>
                                <li>Server errors</li>
                            </ul>
                            <li>Other miscellaneous errors when program fails for unknown reasons</li>
                        </ul>
                    </li>
                    <li><span className={classes.bold}>Add galley of dreamified images</span></li>
                </ul>

            </Typography>
        </Paper>
    );
}
export default About;
