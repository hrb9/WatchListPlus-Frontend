// frontend/src/slices/authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  authToken: null,
  userId: null,
  isAdmin: false,
  autoApprove: false
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth(state, action) {
      state.authToken = action.payload.token;
      state.userId = action.payload.userId;
    },
    logout(state) {
      state.authToken = null;
      state.userId = null;
    },
    setIsAdmin(state, action) {
      state.isAdmin = action.payload;
    },
    setAutoApprove(state, action) {
      state.autoApprove = action.payload;
    }
  }
});

export const { setAuth, logout, setIsAdmin, setAutoApprove } = authSlice.actions;
export default authSlice.reducer;
