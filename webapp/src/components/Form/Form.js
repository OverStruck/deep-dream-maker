import React from 'react';
import ParameterFields from '../ParameterFields/ParameterFields';
import FileDialogue from '../FileSelector/FileSelector';
import ProgressBar from '../ProgressBar/ProgressBar';
import Buttons from '../Buttons/Buttons';
import Console from '../Console/Console';
import PreviewImage from '../PreviewImage/PreviewImage';
import styles from './Form.module.css';

class DeepForm extends React.Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.state = {
            selectedFile: null,
            running: false
        }
        this.consoleRef = React.createRef();
        this.progressBarRef = React.createRef();
        this.PreviewImageRef = React.createRef();
        this.dreamifiedFile = null;
    }

    log(text) {
        this.consoleRef.current.add(text)
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

    handleSubmit(e) {
        e.preventDefault();
        const form = e.target;
        const data = new FormData(form);
        data.append("file", this.state.selectedFile);
        // send image to server
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
                            //start progress bar fetch update
                            this.progressBarRef.current.start();
                            //start preview image fetch update
                            this.PreviewImageRef.current.start();
                        })
                        .catch((error) => alert(error));
                }
            })
    }

    handleFile(e) {
        e.preventDefault();
        const file = e.target.files[0];
        this.setState({ selectedFile: file })
        //log to ui console
        this.log(`Input image set: ${file.name}`)
        //set image preview
        const previewImage = URL.createObjectURL(file);
        this.PreviewImageRef.current.setImage(previewImage)
    }

    stopDream(e) {
        e.preventDefault();
        this.log("Stopping Dream...")
        this.progressBarRef.current.stop();
        fetch('http://localhost:3002/api/v1/stopDream')
            .then(res => res.json())
            .then(data => this.log(data.message))
    }

    downloadDream(e) {
        e.preventDefault();
        if (this.state.selectedFile === null) {
            alert("You haven't selected a file")
        }
        else if (this.dreamifiedFile !== null) {
            let url = "http://localhost:3002/api/v1/downloadImage/";
            window.location.href = url + this.dreamifiedFile;
        }
        else {
            alert("Error... don't know what happened :/")
        }
    }

    render() {
        return (
            <div className={styles.interface}>
                <div className={styles.controls}>
                    <form onSubmit={this.handleSubmit} className={styles.form} >
                        <FileDialogue handleUpload={this.handleFile.bind(this)} />
                        <ParameterFields />
                        <Buttons
                            stopDream={this.stopDream.bind(this)}
                            downloadDream={this.downloadDream.bind(this)}
                        />
                    </form>
                    <ProgressBar ref={this.progressBarRef} console={this.consoleRef} />
                    <Console ref={this.consoleRef} />
                </div>
                <PreviewImage ref={this.PreviewImageRef} console={this.consoleRef} />
            </div>
        );
    }
}

export default DeepForm;