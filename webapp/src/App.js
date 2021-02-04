import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import withStyles from '@material-ui/core/styles/withStyles';

import Header from "./components/Header/Header";
import Inputs from "./components/Inputs/Inputs";
import MessageDialog from "./components/MessageDialog"
import PreviewImage from './components/PreviewImage/PreviewImage';

const styles = theme => ({
  root: {
    backgroundColor: "#212121",
    boxShadow: "0px 5px 11px 0px rgba(0,0,0,0.75);"
  },
});

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: false,
      errorMsg: null,
      dreaming: false,
      canDownload: false,
      parameters: {
        iterations: 10,
        octaves: 4,
        octavescale: 1.4,
        jitter: 32,
        stepsize: 1.5
      }
    };
    this.userFile = null;
    this.inputsRef = React.createRef();
    this.prevImgRef = React.createRef();
  }

  log(msg) {
    this.inputsRef.current.log(msg);
  }

  makeItDream() {

    if (this.state.userFile === null || !this.state.userFile) {
      this.setState({ error: true, errorMsg: "You need to select a file first" });
      return 0;
    }

    //create form data request
    let formData = new FormData();
    const parameters = Object.entries(this.state.parameters);
    for (const [name, value] of parameters) {
      formData.append(name, value)
    }
    formData.append("file", this.state.userFile);
    this.setState({ dreaming: true });
  }

  stopDream() {
    this.log("Stopping Dream...");
    this.setState({ dreaming: false });
  }



  handleSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const data = new FormData(form);
    data.append("file", this.userFile);
    console.log(data)
    // send image to server
    // fetch('http://localhost:3002/api/v1/processImage', {
    //   method: 'POST',
    //   body: data
    // })
    //   .then(response => {
    //     if (!response.ok) {
    //       response.json()
    //         .then(this.handleErrors)
    //         .catch((error) => alert(error));
    //     } else {
    //       response.json()
    //         .then(data => {
    //           this.log(data.message);
    //           this.dreamifiedFile = data.fileName;
    //           //start progress bar fetch update
    //           this.progressBarRef.current.start();
    //           //start preview image fetch update
    //           this.PreviewImageRef.current.start();
    //         })
    //         .catch((error) => alert(error));
    //     }
    //   })
  }

  //handle user file section
  handleFile(e) {
    e.preventDefault();
    const file = e.target.files[0];
    this.userFile = file;
    //log to ui console
    this.log(`Input image set: ${file.name}`)
    //set image preview
    const previewImage = URL.createObjectURL(file);
    this.prevImgRef.current.setImage(previewImage);
  }

  //parameter fields onChange functions
  handleChange(e) {
    e.preventDefault();
    const { name, value } = e.target;
    let newValue = Math.round(value * 10) / 10;
    this.updateParameterState(name, newValue);
  }

  updateParameterState(name, value) {
    let parameters = { ...this.state.parameters }
    parameters[name] = value;
    this.setState({ parameters })
  }

  handleCloseDialog(e) {
    this.setState({ error: false });
  }

  render() {
    const { classes } = this.props;

    const ajix = {
      onFileSelect: this.handleFile.bind(this),
      onMakeItDream: this.makeItDream.bind(this),
      onStopDream: this.stopDream.bind(this),
      dreaming: this.state.dreaming,
      canDownload: this.state.canDownload,
      parameters: {
        callBacks: {
          onButtonChange: this.updateParameterState.bind(this),
          onInputChange: this.handleChange.bind(this),
        },
        state: this.state.parameters
      }
    }

    return (
      <>
        <Container fixed>
          <Grid container direction="column" spacing={1} className={classes.root} >
            <Header />
            <Grid container item spacing={1} justify="space-evenly" direction="row" align="stretch">
              <Inputs ref={this.inputsRef}  {...ajix} />
              <PreviewImage ref={this.prevImgRef} />
            </Grid>
          </Grid>
        </Container>
        <MessageDialog open={this.state.error} onClose={this.handleCloseDialog.bind(this)} msg={this.state.errorMsg} />
      </>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(App);
