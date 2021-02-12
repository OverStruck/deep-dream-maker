import Resizer from "react-image-file-resizer";

//get image dimmensions
const getImageDimensions = file =>
    new Promise((resolve, reject) => {
        const img = new Image()
        img.onload = () => {
            const { naturalWidth: width, naturalHeight: height } = img
            resolve({ width, height })
        }

        // fire if there was an error with the image
        // if it's not an image or it's corrupted
        img.onerror = () => {
            reject('There was some problem with the image.')
        }

        img.src = URL.createObjectURL(file)
    })

//resize image using react-image-file-resizer 
const resizeFile = file => new Promise(resolve => {
    Resizer.imageFileResizer(file, 1000, 1000, "jpeg", 100, 0,
        blob => blob.arrayBuffer().then(buff => resolve(new File([buff], file.name, { type: file.type }))),
        'blob'
    );
});

// const resizeFile = file => new Promise(resolve => {
//     Resizer.imageFileResizer(file, 1000, 1000, "jpeg", 100, 0,
//         file =>  resolve(file),
//         "file"
//     );
// });

/*
    Resize image if needed
    Max allowed dimmensions: 1000x1000 pixels
*/
export const processImage = async (file) => {
    try {
        //get image with and height
        const imageDimensions = await getImageDimensions(file)
        const { width, height } = imageDimensions;
        // return resized image if needed
        if (width > 1000 || height > 1000) {
            return await resizeFile(file);
        } else {
            return file
        }
    } catch (error) {
        console.error(error)
    }
}



