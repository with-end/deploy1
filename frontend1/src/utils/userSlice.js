import { createSlice } from "@reduxjs/toolkit";

const initialUser = JSON.parse(localStorage.getItem("user")) || { token: null };

const userSlice = createSlice({
  name: "userSlice",
  initialState: initialUser,
  reducers: {
    login(state, action) {
      // ✅ modify draft only (don’t return)
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.token = action.payload.token;
      state.username = action.payload.username ;
    //  state.profilePic = action.payload.profilePic ;
      localStorage.setItem("user", JSON.stringify(state));
    },

    logout() {
      localStorage.removeItem("user");
      return { token: null };
    },

    updateData(state, action) {
      const data = action.payload;
      const updatedUser = {
        ...state,
        ...data,
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      return updatedUser;
    },
  },
});

export const { login, logout, updateData } = userSlice.actions;
export default userSlice.reducer;
