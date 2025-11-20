import Dexie from "dexie";

export const imageDB = new Dexie("PotholeImageDB");

imageDB.version(1).stores({
    images: "++id, key"
});

/**
 * Save Blob/File with a unique key
 */
export const saveImage = async (key, file) => {
    return imageDB.images.add({ key, file });
};

/**
 * Get all images for a specific key (form ID)
 */
export const getImages = async (key) => {
    return imageDB.images.where({ key }).toArray();
};

/**
 * Delete images for a form key
 */
export const deleteImages = async (key) => {
    return imageDB.images.where({ key }).delete();
};
export const deleteImage = async (key) => {
    return imageDB.images.where({ key }).delete();
};
