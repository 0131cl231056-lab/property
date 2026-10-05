import axios from "axios";

const API = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}/properties`,
    withCredentials: true,
});
// Public
export const getAllPropertiesApi = () => API.get("/");

export const getPropertyByIdApi = (id) =>
    API.get(`/${id}`);

// User
export const createPropertyApi = (formData) =>
    API.post("/create", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

export const getMyPropertiesApi = () =>
    API.get("/my/properties");

export const updatePropertyApi = (id, data) =>
    API.patch(`/${id}`, data);

export const deletePropertyApi = (id) =>
    API.delete(`/${id}`);

export const getLocationsApi = () =>
    API.get("/locations");