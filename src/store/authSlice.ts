import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  status: boolean;
  userData: Record<string, any> | null; // you can replace `any` with a stricter user type
}

const initialState: AuthState = {
  status: false,
  userData: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ userData: Record<string, any> }>) => {
      state.status = true;
      state.userData = action.payload.userData;
    },
    logout: (state) => {
      state.status = false;
      state.userData = null;
    },
  },
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;
