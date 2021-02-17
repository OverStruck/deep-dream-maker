//import { useState, useEffect } from "react";

const baseUrl = "http://127.0.0.1:6001/api/v1";

const handleErrors = async (response) => {
    if (!response.ok) {
        if (response.status === 400) {
            const {message} = await response.json();
            throw new Error(message);
        } else {
            console.error(response);
            throw new Error("Something happened, not sure what");
        }
    }
    return response.json()
}

const sendImage = async (_data = null) => {
    const response = await fetch(`${baseUrl}/processImage`, {
        method: "POST",
        body: _data
    }).then(handleErrors);
    const message = response.message;
    const newFileName = response.fileName;
    return { message, newFileName };
}

const getProgress = async () => {
    const response = await fetch(`${baseUrl}/getProgress`).then(handleErrors);
    const progress = parseFloat(response.progress);
    return progress;
}

const getPreviewImage = async () => {
    const response = await fetch(`${baseUrl}/getPreviewImage`).then(handleErrors);
    const done = response.done;
    const image = response.image;
    const progress = response.progress;
    //let done = true, image = "", progress = 100;
    return { done, image, progress };
}

export {
    sendImage, getProgress, getPreviewImage
}

