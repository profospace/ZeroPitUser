import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    formId: "potholeForm",   // Fixed ID
    address: "",
    description: "",
    severity: "mild",
    position: "middle",
    reportedBy: "",
    location: null,
    images: [],            // base64 preview
    imageMeta: []          // { name, idFromDB }
};

const slice = createSlice({
    name: "potholeForm",
    initialState,
    reducers: {
        setField: (state, action) => {
            const { field, value } = action.payload;
            state[field] = value;
        },
        addImageMeta: (state, action) => {
            state.images.push(action.payload.preview);
            state.imageMeta.push({
                id: action.payload.dbId,
                name: action.payload.file.name
            });
        },
        removeImageMeta: (state, action) => {
            state.images.splice(action.payload, 1);
            state.imageMeta.splice(action.payload, 1);
        },
        restoreImages: (state, action) => {
            state.images = action.payload.previews;
            state.imageMeta = action.payload.meta;
        },
        resetForm: () => initialState
    }
});

export const {
    setField,
    addImageMeta,
    removeImageMeta,
    restoreImages,
    resetForm
} = slice.actions;

export default slice.reducer;
