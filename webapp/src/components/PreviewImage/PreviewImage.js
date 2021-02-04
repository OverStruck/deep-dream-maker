import React from 'react';
import styles from './PreviewImage.module.css';
import Grid from '@material-ui/core/Grid';

class PreviewImage extends React.Component {
    constructor(props) {
        super(props);
        this.ref = React.createRef();
        this.state = {
            running: false
        }
    }

    start() {
        if (!this.state.running) {
            this.setState({ running: true })
            this.interval = setInterval(() => this.getProgress(), 1000);
        }
    }

    stop(msg = '') {
        clearInterval(this.interval);
        this.setState({ running: false });
        if (msg !== '') {
            console.error(msg);
            alert(msg);
        }
    }

    decodeImage(data) {
        const byteCharacters = atob(data);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        let image = new Blob([byteArray], { type: 'image/jpeg' });
        //image Url
        return URL.createObjectURL(image);
    }

    getProgress() {
        fetch(`http://localhost:3002/api/v1/getPreviewImage`)
            .then(response => response.json())
            .then(data => {
                if (data.done) {
                    this.stop();
                }
                else if (data.image !== "") {
                    this.setImage(this.decodeImage(data.image));
                    let msg = `Updated preview image [${data.progress.toFixed(2)}% done...]`
                    this.props.console.current.add(msg)
                }
            })
            .catch((error) => this.stop(error));
    }

    setImage(url) {
        this.ref.current.style.backgroundImage = `url(${url})`;
    }

    render() {
        return (
            <Grid item xs={6} >
                <div className={styles.previewImage} ref={this.ref}></div>
            </Grid>
        );
    }
}

export default PreviewImage;