import { configureStore } from '@reduxjs/toolkit';
import weatherReducer from './reducers/weatherReducer';

const store = configureStore({
    reducer: {
        weatherReducer,
    },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
