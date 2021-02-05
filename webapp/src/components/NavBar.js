import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup'
import makeStyles from "@material-ui/core/styles/makeStyles";

const useStyles = makeStyles({
    title: {
      flexGrow: .95
    },
    customHeight: {
      minHeight: 70
    }
  });

function NavBar() {
    const classes = useStyles();
    const gitHubRepository = "https://github.com/OverStruck/deep-dream-maker";
    const whatIsDeepDream = "https://ai.googleblog.com/2015/06/inceptionism-going-deeper-into-neural.html";
    return (
        <AppBar position="static" className={classes.customHeight}>
            <Container fixed>
            <Toolbar>
                <Typography variant="h4" className={classes.title}>
                    Deep Dream Maker
                </Typography>
                <ButtonGroup size="small" variant="text">
                        <Button  onClick={()=>{window.open(whatIsDeepDream, "_blank")}}>What is DeepDream?</Button>
                        <Button onClick={()=>{window.open(gitHubRepository, "_blank")}}>Fork me on Github</Button>
                        <Button>About</Button>
                </ButtonGroup>
            </Toolbar>
            </Container>
        </AppBar>
    );
}

export default NavBar;