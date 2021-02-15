import React from 'react';
import Button from '@material-ui/core/Button';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import Grid from '@material-ui/core/Grid';

class FileDialogue extends React.Component {

  constructor(props) {
    super(props);
    this.inputElem = React.createRef();
  }

  handleFileSelect = (e) => {
    e.preventDefault();
    this.inputElem.current.click();
  }

  render() {
    const {handleUpload, disabled} = this.props;
    return (
      <Grid item>
        <Button
          disabled={disabled}
          color="primary"
          size="large"
          variant="contained"
          startIcon={<CloudUploadIcon />}
          onClick={this.handleFileSelect} fullWidth>
          Select input image
        </Button>
        <input ref={this.inputElem}
          data-testid="fileHandler"
          onChange={handleUpload}
          type="file"
          style={{ display: "none" }} />
      </Grid>
    );
  }
}

export default FileDialogue;


