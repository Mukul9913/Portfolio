import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const forgotResetPassSlice = createSlice({
    name: "forgotPasword",
    initialState: {
        loading: false,
        error: null,
        message: null
    },
    reducers: {
        forgotPaswordRequest: (state, action) => {
            state.loading = true;
            state.error = null;
            state.message = null;
        },
        forgotPaswordSuccess: (state, action) => {
            state.loading = false;
            state.error = null;
            state.message = action.payload;
        },
        forgotPaswordFailure: (state, action) => {
            state.loading =false;
            state.error = action.payload;
            state.message = null;
        },
        resetPaswordRequest: (state, action) => {
            state.loading = true;
            state.error = null;
            state.message = null;
        },
        resetPaswordSuccess: (state, action) => {
            state.loading = false;
            state.error = null;
            state.message = action.payload;
        },
        resetPaswordFailure: (state, action) => {
            state.loading =false;
            state.error = action.payload;
            state.message = null;
        },
        clearError: (state, action) => {
            state.error = null;
        }
    }
})

export const forgotPasword = (email) => async (dispatch) => {
    dispatch(forgotResetPassSlice.actions.forgotPaswordRequest());
    try {
        const {data}=await axios.post("http://localhost:3000/api/v1/user/password/forgotpassword",{email},{withCredentials:true,headers:{
            "Content-Type":"application/json"
        }});
        dispatch(forgotResetPassSlice.actions.forgotPaswordSuccess(data.message))
        dispatch(forgotResetPassSlice.actions.clearError());
    } catch (error) {
        dispatch(forgotResetPassSlice.actions.forgotPaswordFailure(error.response.data.message));
    }
  
}

export const resetPassword = (token,passeord,confirmPassword) => async (dispatch) => {
    dispatch(forgotResetPassSlice.actions.resetPaswordRequest());
    try {
        const {data}=await axios.put(`http://localhost:3000/api/v1/user/password/resetpassword/${token}`,{passeord,confirmPassword},{withCredentials:true,headers:{
            "Content-Type":"application/json"
        }});
        dispatch(forgotResetPassSlice.actions.resetPaswordSuccess(data.message))
        dispatch(forgotResetPassSlice.actions.clearError());
    } catch (error) {
        dispatch(forgotResetPassSlice.actions.resetPaswordFailure(error.response.data.message));
    }
}

export const clearAllForgotPasswordErrors = () => (dispatch) => {
    dispatch(forgotResetPassSlice.actions.clearError());
} 
export default forgotResetPassSlice.reducer;