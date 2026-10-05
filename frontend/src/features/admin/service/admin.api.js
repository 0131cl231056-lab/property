import axios from "axios";

const adminAPI = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}/admin`,
    withCredentials: true,
});

// Dashboard
export const dashboardStatsAPI = async () => {
    const { data } = await adminAPI.get("/dashboard");
    return data;
};

// Properties
export const getAllPropertiesAPI = async () => {
    const { data } = await adminAPI.get("/properties");
    return data;
};

export const getPendingPropertiesAPI = async () => {
    const { data } = await adminAPI.get("/properties/pending");
    return data;
};

export const approvePropertyAPI = async (id) => {
    const { data } = await adminAPI.patch(`/properties/${id}/approve`);
    return data;
};

export const rejectPropertyAPI = async (id) => {
    const { data } = await adminAPI.patch(`/properties/${id}/reject`);
    return data;
};

export const markPropertyAsSoldAPI = async (id) => {
    const { data } = await adminAPI.patch(`/properties/${id}/sold`);
    return data;
};

export const deletePropertyAPI = async (id) => {
    const { data } = await adminAPI.delete(`/properties/${id}`);
    return data;
};
