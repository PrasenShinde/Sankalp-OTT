import { StatusBar } from 'expo-status-bar';
import { Provider } from 'react-redux';

import RootStackNavigator from './src/navigation/RootStackNavigator';
import { store } from './src/redux';
import { setStore, setAuthActions } from './src/services/api';
import { setTokens, logout } from './src/redux/slices/authSlice';

// Pass Redux store to API interceptors
setStore(store);

// ✅ Pass auth action creators to API service
// This ensures proper Redux state updates when token refresh happens
setAuthActions({
  setTokens,
  logout,
});

export default function App() {
  return (
    <Provider store={store}>
      <StatusBar style="auto" />
      <RootStackNavigator />
    </Provider>
  );
}
