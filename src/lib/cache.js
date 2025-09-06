import { getDocuments, getImage } from "./model.js";

//@ts-nocheck

export async function loadAllImages() {
    let allImages = {};
    try {
        let imageIds = [];
        //@ts-ignore
        imageIds = await getDocuments("murals"); // get the ids for each image folder name.

        const imgIdLen = imageIds.length;
        let maxLoad = 5;
        // if (imgIdLen > 5) {

        // }

        for (let i = 0; i < imgIdLen; i++) { // loop through each name to store the img src in localStorage.
            const imgSrc = await getImage(imageIds[i].id);
            // @ts-ignore
            allImages[imageIds[i].id] = imgSrc;
        }

        const allImgsJSON = JSON.stringify(allImages);
        localStorage.setItem("allImages", allImgsJSON);

    } catch (error) {
        console.log("error caching: " + error);
        localStorage.setItem("allImages", "");
    }
}

export function getCachedImgs() {
    try {
        // @ts-ignore
        const allImgs = JSON.parse(localStorage.getItem("allImages"));
        console.log(allImgs);
        return allImgs;
    } catch (error) {
        return {};
    }
}