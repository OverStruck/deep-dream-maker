import React from 'react'
import { withStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress'
import { getProgress } from "../../utils/Api";

const StyledProgressBar = withStyles({
    root: {
        height: 30
    }
})(LinearProgress);

class ProgressBar extends React.Component {
    constructor(props) {
        super(props);
        this.running = false;
        this.state = {
            progress: 0
        }
    }

    componentDidUpdate() {
        if (!this.running && this.props.run) {
            this.running = true
            this.interval = setInterval(() => this.getProgress(), 200);
        } else if (this.running && !this.props.run) {
            clearInterval(this.interval);
            this.running = false;
        }
    }

    stop(msg = '') {
        clearInterval(this.interval);
        this.running = false;
        this.props.onFinish();
        if (msg !== '') {
            console.error(msg);
            alert(msg);
        }
    }

    log(msg, timeStamp = true) {
        if (this.props.console)
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