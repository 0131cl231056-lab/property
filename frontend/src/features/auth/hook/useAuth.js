import { useDispatch } from "react-redux";

import {
    setError,
    setLoading,
    setUser,
    logout,
    setFavorites,
    addFavorite,
    removeFavorite
} from "../state/authSlice";

import {
    registerAPI,
    loginAPI,
    getMeAPI,
    logoutAPI,
    addFavoriteApi,
    removeFavoriteApi,
    getFavoritesApi
} from "../service/auth.api";

export function useAuth() {

    const dispatch = useDispatch();

    async function handleRegister(data) {

        dispatch(setLoading(true));

        try {

            const res = await registerAPI(data);

            dispatch(setUser(res.data.user));

            return res.data;

        } catch (err) {

            dispatch(
                setError(
                    err.response?.data?.message ||
                    "Registration failed"
                )
            );

            throw err;

        } finally {

            dispatch(setLoading(false));
        }
    }

    async function handleLogin(data) {

        dispatch(setLoading(true));

        try {

            const res = await loginAPI(data);

            dispatch(setUser(res.data.user));

            await handleGetFavorites();

            return res.data;

        } catch (err) {

            dispatch(
                setError(
                    err.response?.data?.message ||
                    "Login failed"
                )
            );

            throw err;

        } finally {

            dispatch(setLoading(false));
        }
    }

       const handleGetMe = async () => {
    console.log("handleGetMe started");
    dispatch(setLoading(true));

    try {
        const { data } = await getMeAPI();
dispatch(setUser(data.user));
await handleGetFavorites();
        console.log("GET ME SUCCESS", data);
        dispatch(setUser(data.user));
    } catch (err) {
        console.log("GET ME FAILED", err.message, err.response?.status, err.response?.data);
        dispatch(setUser(null));
    } finally {
        console.log("handleGetMe finished");
        dispatch(setLoading(false));
    }
};
    async function handleLogout() {

        try {

            await logoutAPI();

            dispatch(logout());

        } catch (err) {

            console.log(err);
        }
    }

    async function handleGetFavorites() {

    try {

        const res = await getFavoritesApi();

        dispatch(setFavorites(res.data.favorites));

        return res.data.favorites;

    } catch (err) {

        console.log(err);

    }

}

async function handleAddFavorite(id) {

    try {

        await addFavoriteApi(id);

        const res = await getFavoritesApi();

        dispatch(setFavorites(res.data.favorites));

    } catch(err) {
        console.log(err);
    }
}

async function handleRemoveFavorite(id){

    try{

        await removeFavoriteApi(id);

        const res = await getFavoritesApi();

        dispatch(setFavorites(res.data.favorites));

    }catch(err){
        console.log(err);
    }
}

    return {

    handleRegister,
    handleLogin,
    handleGetMe,
    handleLogout,

    handleGetFavorites,
    handleAddFavorite,
    handleRemoveFavorite,

};
}