import { createSlice } from "@reduxjs/toolkit";
import { User } from "lucide-react";

const userSlice=createSlice({
    name:"user",
    initialState:{
        user:{},
        loading:false,
        error:null,
        isAuthenticated:false,
        message:null
    },
    reducers:{
        loginRequest:(state,action)=>{
            state.loading=true;
            state.isAuthenticated=false;
            state.error=null;
            state.user={};
            state.message=null;
        },
        loginSuccess:(state,action)=>{
            state.loading=false;
            state.isAuthenticated=true;
            state.error=null;
            state.user=action.payload;
            state.message=null;
        },
        loginFailure:(state,action)=>{
            state.loading=false;
            state.isAuthenticated=false;
            state.error=action.payload;
            state.user={};
            state.message=null;
        },
        logout:(state,action)=>{
            state.loading=false;
            state.isAuthenticated=false;
            state.error=null;
            state.user={};
            state.message=null;
        },
        clearError:(state,action)=>{
            state.loading=false;
            state.isAuthenticated=false;
            state.error=null;
            state.user={};
            state.message=null;
        }
       
    }
})

export const login=(email,password)=>async (dispatch)=>{
    dispatch(userSlice.actions.loginRequest());
    try {
        const data=await axios.post("",{email,password},{withCredentials:true,headers:{"Content-Type":"application/json"}});
        dispatch(userSlice.actions.loginSuccess(data.user));
        dispatch(userSlice.actions.clearError());
    } catch (error) {
        dispatch(userSlice.actions.loginFailure(error.response.data.message));
    }
}

export default userSlice.reducer;