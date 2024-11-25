import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { BookDashed, User } from "lucide-react";

const userSlice = createSlice({
    name: "user",
    initialState: {
        user: {},
        loading: false,
        error: null,
        isAuthenticated: false,
        message: null
    },
    reducers: {
        loginRequest: (state, action) => {
            state.loading = true;
            state.isAuthenticated = false;
            state.error = null;
            state.user = {};
            state.message = null;
        },
        loginSuccess: (state, action) => {
            state.loading = false;
            state.isAuthenticated = true;
            state.error = null;
            state.user = action.payload;
            state.message = null;
        },
        loginFailure: (state, action) => {
            state.loading = false;
            state.isAuthenticated = false;
            state.error = action.payload;
            state.user = {};
            state.message = null;
        },
        logout: (state, action) => {
            state.loading = false;
            state.isAuthenticated = false;
            state.error = null;
            state.user = {};
            state.message = state.message;
        },
        logoutFailed: (state, action) => {
            state.loading = false;
            state.isAuthenticated = state.isAuthenticated;
            state.error = action.payload;
            state.user = state.user;
            state.message = null;
        },
        clearError: (state, action) => {
            state.error = null;
            state.user = state.user;
        },
        loadUserRequest: (state, action) => {
            state.loading = true;
            state.isAuthenticated = false;
            state.error = null;
            state.user = {};
            state.message = null;
        },
        loadUserSuccess: (state, action) => {
            state.loading = false;
            state.isAuthenticated = true;
            state.error = null;
            state.user = action.payload;
            state.message = null;
        },
        loadUserFailure: (state, action) => {
            state.loading = false;
            state.isAuthenticated = false;
            state.error = action.payload;
            state.user = {};
            state.message = null;
        },
        updatePasswordRequest: (state, action) => {
            state.loading = true;
            state.isUpdated = false;
            state.error = null;
            state.message = null;
        },
        updatePasswordSuccess: (state, action) => {
            state.loading = false;
            state.isUpdated = true;
            state.error = null;
            state.message = action.payload;
        },
        updatePasswordFailure: (state, action) => {
            state.loading = false;
            state.isUpdated = state.isUpdated;
            state.error = action.payload;
            state.message = null;
        },
        updateProfileRequest: (state, action) => {
            state.loading = true;
            state.isUpdated = false;
            state.error = null;
            state.message = null;
        },
        updateProfileSuccess: (state, action) => {
            state.loading = false;
            state.isUpdated = true;
            state.error = null;
            state.message = action.payload;
        },
        updateProfileFailure: (state, action) => {
            state.loading = false;
            state.isUpdated = state.isUpdated;
            state.error = action.payload;
            state.message = null;
        },
        updateProfileResetAfterUpdate(state, action) {
            state.isUpdated = false;
            state.error = null;
            state.message = null;
        }

    }
})

export const login = (email, password) => async (dispatch) => {
    dispatch(userSlice.actions.loginRequest());
    try {
        const { data } = await axios.post("http://localhost:3000/api/v1/user/login", { email, password }, { withCredentials: true, headers: { "Content-Type": "application/json" } });
        dispatch(userSlice.actions.loginSuccess(data.user));
        dispatch(userSlice.actions.clearError());
    } catch (error) {
        dispatch(userSlice.actions.loginFailure(error.response.data.message));
    }
}

export const getUser = () => async (dispatch) => {
    dispatch(userSlice.actions.loadUserRequest());
    try {
        const { data } = await axios.get("http://localhost:3000/api/v1/user/me/portfolio", { withCredentials: true, headers: { "Content-Type": "application/json" } });
        dispatch(userSlice.actions.loadUserSuccess(data.user));
        dispatch(userSlice.actions.clearError());
    } catch (error) {
        dispatch(userSlice.actions.loadUserFailure(error.response.data.message));
    }
}

export const logout = () => async (dispatch) => {
    dispatch(userSlice.actions.logout());
    try {
        const { data } = await axios.get("http://localhost:3000/api/v1/user/logout", { withCredentials: true, headers: { "Content-Type": "application/json" } });
        dispatch(userSlice.actions.logout());
        dispatch(userSlice.actions.clearError());
    } catch (error) {
        dispatch(userSlice.actions.logoutFailed(error.response.data.message));
    }
}

export const clearAllUserErrors = () => (dispatch) => {
    dispatch(userSlice.actions.clearError());
}

export const updatePassword = (oldPassword, newPassword, confirmPassword) => async (dispatch) => {
    dispatch(userSlice.updatePasswordRequest());
    try {
        const { data } = await axios.put("http://localhost:3000/api/v1/user/update/passeord",
            {
                oldPassword,
                newPassword,
                confirmPassword
            }
            , { withCredentials: true, headers: { "content-type": "application/json" } });
            dispatch(userSlice.actions.updatePasswordSuccess(data.message));
            dispatch(userSlice.actions.clearError());
    } catch (error) {
         dispatch(userSlice.actions.updateProfileFailure(error.response.data.message));
    }
}


export const updateProfile = (data) => async (dispatch) => {
    dispatch(userSlice.updateProfileRequest());
    try {
        const { data } = await axios.put("http://localhost:3000/api/v1/user/update/passeord",
            data
            , { withCredentials: true, headers: { "content-type": "multipart/form-data" } });
            dispatch(userSlice.actions.updatePasswordSuccess(data.message));
            dispatch(userSlice.actions.clearError());
    } catch (error) {
         dispatch(userSlice.actions.updateProfileFailure(error.response.data.message));
    }
}
export const resetProfile = () => (dispatch) => {
    dispatch(userSlice.actions.updateProfileResetAfterUpdate());
}
export default userSlice.reducer;