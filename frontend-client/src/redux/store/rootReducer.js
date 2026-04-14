import { combineReducers } from '@reduxjs/toolkit';

import authReducer from '../slices/authSlice';
import reelsReducer from '../slices/reelsSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  reels: reelsReducer,
});

export default rootReducer;
