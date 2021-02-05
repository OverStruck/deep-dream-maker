import React from 'react'
import Paper from '@material-ui/core/Paper';
import withStyles from '@material-ui/core/styles/withStyles';

const ContainerStyled = withStyles({
  root: {
    backgroundColor: "#1f4068",
    fontFamily: "monospace",
    flexBasis: "50%",
    overflow: "auto",
    padding: 5
  }
})(Paper);

class Console extends React.Component {
  constructor(props) {
    super(props);
    this.ref = React.createRef();
  }

  add(msg, timeStamp = true) {
    let newMsg = document.createElement('div');
    newMsg.innerText = (timeStamp ? new Date().toLocaleTimeString() + "|" + msg : msg);
    this.ref.current.appendChild(newMsg);
    newMsg.scrollIntoView();
  }

  render() {
    return (
      // <Grid item className={classes.root} ref={this.ref} >
      <ContainerStyled variant="outlined" ref={this.ref}>
        <div>DeepDream Maker ready... </div>
      </ContainerStyled>
      // </Grid>
    );
  }
}

// Console.propTypes = {
//   classes: PropTypes.object.isRequired,
// };

//export default withStyles(styles)(Console);
export default Console;