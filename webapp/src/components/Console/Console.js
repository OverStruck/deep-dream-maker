import React from 'react'
import Grid from '@material-ui/core/Grid';
import { lightBlue } from "@material-ui/core/colors";

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  root: {
    backgroundColor: lightBlue[900],
    fontFamily: "monospace",
    color: "white",
    flexGrow: 0,
    flexBasis: "50%",
    overflow: "auto"
  },
});

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
    const { classes } = this.props;
    return (
      <Grid item className={classes.root} ref={this.ref} >
        <div>DeepDream Maker ready... </div>
      </Grid>
    );
  }
}

Console.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Console);