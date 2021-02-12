import React from 'react'
import { withStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress'
import { getProgress } from "../Api/Api";

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
        console.log("pbar stopped")
        if (msg !== '') {
            console.error(msg);
            alert(msg);
        }
    }

    log(msg, timeStamp = true) {
        this.props.console.current.add(msg, timeStamp);
    }

    async getProgress() {
        try {
            const progress = await getProgress();
            this.setState({ progress: progress });
            if (progress === 100.0) {
                this.stop();
                this.log("", false);
                this.log("----------------------------------", false);
                this.log("Done processing image", false);
                this.log("You can now download your image :)", false);
                this.log("----------------------------------", false);
                this.log("", false);
            }
        } catch (e) {
            this.stop(e.toString());
        }
    }

    render() {
        return <StyledProgressBar variant="determinate" color="secondary" value={this.state.progress} max="100" />
    }
}

export default ProgressBar;