import React from 'react';
import Button from '@material-ui/core/Button';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import Grid from '@material-ui/core/Grid';

function buildFileSelector(handleUpload) {
  const fileSelector = document.createElement('input');
  fileSelector.setAttribute('type', 'file');
  fileSelector.onchange = handleUpload;
  return fileSelector;
}

class FileDialogue extends React.Component {

  componentDidMount() {
    this.fileSelector = buildFileSelector(this.props.handleUpload);
  }

  handleFileSelect = (e) => {
    e.preventDefault();
    this.fileSelector.click();
  }

  render() {
    return (
      <Grid item>
        <Button
          color="primary"
          size="large"
          variant="contained"
          startIcon={<CloudUploadIcon />}
          onClick={this.handleFileSelect} fullWidth>
          Select input image
        </Button>
      </Grid>
    );
  }
}

export default FileDialogue;


