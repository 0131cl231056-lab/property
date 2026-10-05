import axios from "axios";

const authAPI = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}/auth`,
    withCredentials: true,
});

export const registerAPI = (data) =>
    authAPI.post("/register", data);

export const loginAPI = (data) =>
    authAPI.post("/login", data);

export const getMeAPI = () =>
    authAPI.get("/get-me");

export const logoutAPI = () =>
    authAPI.post("/logout");

export const addFavoriteApi = (id) =>
    authAPI.post(`/favorites/${id}`);

export const removeFavoriteApi = (id) =>
    authAPI.delete(`/favorites/${id}`);

export const getFavoritesApi = () =>
    authAPI.get("/favorites");