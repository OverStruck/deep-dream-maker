import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import withStyles from '@material-ui/core/styles/withStyles';

import Inputs from "./Inputs";
import MessageDialog from "./MessageDialog"
import PreviewImage from './PreviewImage/PreviewImage';

const styles = theme => ({
  root: {
    backgroundColor: "#212121",
    boxShadow: "0px 5px 11px 0px rgba(0,0,0,0.75);"
  },
});

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: false,
      errorMsg: null,

      dreaming: false,
      canDownload: false,
      running: false,
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

    if (this.userFile === null || !this.userFile) {
      this.setState({ error: true, errorMsg: "You need to select a file first" });
      return 0;
    }

    //create form data request
    let formData = new FormData();
    const parameters = Object.entries(this.state.parameters);
    for (const [name, value] of parameters) {
      formData.append(name, value)
    }
    formData.append("file", this.userFile);
    this.sendToServer(formData);
    this.setState({ dreaming: true });
  }

  stopDream(e) {
    e.preventDefault();
    this.log("Stopping Dream...")
    this.setState({running: false, dreaming: false, canDownload: false})
    fetch('http://localhost:3002/api/v1/stopDream')
        .then(res => res.json())
        .then(data => this.log(data.message))
  }

  downloadDream() {
    if (this.dreamifiedFile !== null) {
      let url = "http://localhost:3002/api/v1/downloadImage/";
      fetch(url + this.dreamifiedFile)
      .then(response => response.blob())
      .then(blob => {
        let a = document.createElement("a");
        a.href = window.URL.createObjectURL(blob);
        a.setAttribute("download", this.dreamifiedFile);
        a.click();
      })
    }
   else {
      alert("Error... don't know what happened :/")
    }
  }

  handleErrors(res) {
    if (res.errors) {
        if (res.message === "Input payload validation failed") {
            throw Error(res.errors.file);
        }
    } else {
        throw Error(res.message);
    }
    return res;
}

  //send image to server
  sendToServer(data) {
    fetch('http://localhost:3002/api/v1/processImage', {
      method: 'POST',
      body: data
    })
      .then(response => {
        if (!response.ok) {
          response.json()
            .then(this.handleErrors)
            .catch((error) => alert(error));
        } else {
          response.json()
            .then(data => {
              this.log(data.message);
              this.dreamifiedFile = data.fileName;
              this.setState({running: true});
              //start preview image fetch update
              //this.PreviewImageRef.current.start();
            })
            .catch((error) => alert(error));
        }
      })
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

  onFinish() {
    this.setState({running: false, dreaming: false, canDownload: true})
  }

  render() {
    const { classes } = this.props;

    const ajix = {
      onFileSelect: this.handleFile.bind(this),
      onMakeItDream: this.makeItDream.bind(this),
      onStopDream: this.stopDream.bind(this),
      onDownload: this.downloadDream.bind(this),
      onFinish: this.onFinish.bind(this),
      dreaming: this.state.dreaming,
      running: this.state.running,
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
            <Grid container item spacing={1} justify="space-evenly">
              <Inputs {...ajix} ref={this.inputsRef} />
              <PreviewImage  run={this.state.running} ref={this.prevImgRef} onLog={this.log.bind(this)} />
            </Grid>
          </Grid>
        </Container>
        <MessageDialog title="Error" open={this.state.error} onClose={this.handleCloseDialog.bind(this)} msg={this.state.errorMsg} />
      </>
    );
  }
}

Home.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Home);
