import React from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';

import FileDialogue from '../FileSelector/FileSelector';
import Console from '../Console/Console';
import ParameterFields from '../ParameterFields/ParameterFields';
import ProgressBar from '../ProgressBar/ProgressBar';


class Inputs extends React.Component {
    constructor(props) {
        super(props);
        this.consoleRef = React.createRef();
        this.progressBarRef = React.createRef();
    }

    log(text) {
        this.consoleRef.current.add(text)
    }

    render() {
        return (
            <Grid item container direction="column" spacing={1} xs={6} style={{ maxHeight: 512 }}>
                <FileDialogue handleUpload={this.props.onFileSelect} />
                <ParameterFields data={this.props.parameters} />

                {/* Main control buttons */}
                <Grid item container>
                    <ButtonGroup variant="contained" color="primary" size="large" fullWidth>
                        <Button disabled={this.props.dreaming} onClick={this.props.onMakeItDream}>Make it Dream</Button>
                        <Button disabled={!this.props.dreaming} onClick={this.props.onStopDream}>Stop Dream</Button>
                        <Button disabled={!this.props.canDownload} >Download Dream</Button>
                    </ButtonGroup>
                </Grid>

                {/* Progress bar */}
                <Grid item>
                    {/* <LinearProgress variant="determinate" color="secondary" value={50} /> */}
                    <ProgressBar ref={this.progressBarRef} console={this.consoleRef} />
                </Grid>

                {/* Console */}
                <Console ref={this.consoleRef} />
            </Grid>
        )
    }

}

export default Inputs
