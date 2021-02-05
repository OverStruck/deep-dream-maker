import React from 'react'
import { withStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress'

const StyledProgressBar = withStyles({
    root: {
        height: 30
    }
})(LinearProgress);

class ProgressBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            progress: 0,
            running: false
        }
    }

    componentDidUpdate() {
        if (!this.state.running && this.props.run) {
            this.setState({ running: true })
            this.interval = setInterval(() => this.getProgress(), 200);
        } else if (this.state.running && !this.props.run) {
            clearInterval(this.interval);
            this.setState({ running: false });
        }
    }

    stop(msg = '') {
        clearInterval(this.interval);
        this.props.onFinish();
        this.setState({ running: false });
        if (msg !== '') {
            console.error(msg);
            alert(msg);
        }
    }

    log(msg, timeStamp = true) {
        this.props.console.current.add(msg, timeStamp);
    }

    getProgress() {
        fetch(`http://localhost:3002/api/v1/getProgress`)
            .then(response => {
                if (!response.ok) {
                    response.json()
                        .then(error => this.stop(error.message))
                } else {
                    response.json()
                        .then(data => {
                            let progress = parseFloat(data.progress);
                            this.setState({ progress: progress })
                            if (progress === 100.0) {
                                this.stop();
                                this.log("", false);
                                this.log("----------------------------------", false);
                                this.log("Done processing image", false);
                                this.log("You can now downlaod your image :)", false);
                                this.log("----------------------------------", false);
                                this.log("", false);
                            }
                        })
                        .catch((error) => this.stop(error));
                }
            })
    }

    render() {
        return <StyledProgressBar variant="determinate" color="secondary" value={this.state.progress} max="100" />
    }
}

export default ProgressBar;