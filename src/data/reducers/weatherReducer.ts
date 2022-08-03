import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { ICurrentWeather } from '../../types/currentWeather/currentWeather';

import { ICurrentWeatherResponce } from '../../types/currentWeather/currentWeatherResponce';
import { degType } from '../../types/general/general';

export const fetchCurrentWeather = createAsyncThunk<
    ICurrentWeatherResponce,
    string,
    { rejectValue: string }
>('weather/fetchCurrentWeather', async function (place, { rejectWithValue }) {
    try {
        const responce = await axios.get(
            'https://api.openweathermap.org/data/2.5/weather',
            {
                params: {
                    appid: 'bac3e64197e17fc7bbc2708165acc449',
                    q: place,
                },
            }
        );
        return responce.data;
    } catch (e: any) {
        if (e.request.statusText) {
            return rejectWithValue('CITY_NOT_FOUND');
        }
        return rejectWithValue('SERVER_ERROR');
    }
});

interface IState {
    requestData: {
        status: string | null;
        error: string | null | undefined;
    };
    weatherData: ICurrentWeather | null;
    general: {
        deg: degType;
        image: string;
    };
}

const initialState: IState = {
    requestData: {
        status: null,
        error: null,
    },
    weatherData: null,
    general: {
        deg: 'C',
        image: 'day/clear',
    },
};

const weatherSlice = createSlice({
    name: 'weather',
    initialState: initialState,
    reducers: {
        setDeg(state, { payload }: PayloadAction<degType>) {
            state.general.deg = payload;
        },
        convertTemperature(
            state,
            { payload }: PayloadAction<{ from: degType; to: degType }>
        ) {
            state.general.deg = payload.to;
            if (state.weatherData) {
                state.weatherData.marks.feels_like.metrics = getMetrics(
                    payload.to
                );

                state.weatherData.temp = convertTemp(
                    state.weatherData?.temp,
                    payload.from,
                    payload.to
                );
                state.weatherData.marks.feels_like.value = convertTemp(
                    state.weatherData.marks.feels_like.value,
                    payload.from,
                    payload.to
                );
            }
        },
    },
    extraReducers(builder) {
        builder
            .addCase(fetchCurrentWeather.pending, (state) => {
                state.requestData.status = 'pending';
                state.requestData.error = null;
            })
            .addCase(fetchCurrentWeather.fulfilled, (state, action) => {
                state.requestData.status = 'fulfilled';
                const data = action.payload;
                //Setting time
                state.general.image = getImage(
                    action.payload.timezone,
                    action.payload.weather[0].main
                );

                //Setting weatherData
                state.weatherData = buildWeatherDataSignature(
                    data,
                    state.general.deg
                );
            })
            .addCase(fetchCurrentWeather.rejected, (state, action) => {
                state.requestData.status = 'rejected';
                state.requestData.error = action.payload;
            });
    },
});

export default weatherSlice.reducer;

export const { convertTemperature, setDeg } = weatherSlice.actions;

const convertToCelsius = (temp: number, deg: degType): number => {
    switch (deg) {
        case 'K':
            return +(temp - 273.15).toFixed(1);
        case 'F':
            return +((temp - 32) / 1.8).toFixed(1);
        default:
            return temp;
    }
};

const convertToFahrenheit = (temp: number, deg: degType): number => {
    switch (deg) {
        case 'K':
            return +((temp - 273.15) * 1.8 + 32).toFixed(1);
        case 'C':
            return +((temp * 9) / 5 + 32).toFixed(1);
        default:
            return temp;
    }
};

const convertToKelvin = (temp: number, deg: degType): number => {
    switch (deg) {
        case 'C':
            return +(temp + 273.15).toFixed(1);
        case 'F':
            return +(((temp - 32) * 5) / 9 + 273.15).toFixed(1);
        default:
            return temp;
    }
};

const convertTemp = (temp: number, from: degType, to: degType): number => {
    switch (to) {
        case 'C':
            return convertToCelsius(temp, from);
        case 'F':
            return convertToFahrenheit(temp, from);
        case 'K':
            return convertToKelvin(temp, from);
    }
};

const getTime = (offset: number): number => {
    return +new Date().toUTCString().split(' ')[4].slice(0, 2) + offset / 3600;
};

const getImage = (timezone: number, weather: string): string => {
    const time = getTime(timezone);
    if (time > 5 && time < 19) {
        return 'day/' + weather;
    } else {
        return 'night/' + weather;
    }
};

const getMetrics = (deg: degType): string => {
    if (deg !== 'K') {
        return '° ' + deg;
    } else {
        return ' ' + deg;
    }
};

const buildWeatherDataSignature = (
    data: ICurrentWeatherResponce,
    deg: degType
): ICurrentWeather => {
    return {
        temp: convertTemp(data.main.temp, 'K', deg),

        marks: {
            feels_like: {
                title: 'Feels like',
                value: convertTemp(data.main.feels_like, 'K', deg),
                metrics: getMetrics(deg),
            },
            humidity: {
                title: 'Humidity',
                value: data.main.humidity,
                metrics: '%',
            },
            pressure: {
                title: 'Pressure',
                value: data.main.pressure,
                metrics: ' mmHg',
            },
            windSpeed: {
                title: 'Wind speed',
                value: data.wind.speed,
                metrics: ' m/s',
            },
        },

        status: data.weather[0].main,

        icon: `http://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`,

        location: {
            city: data.name,
        },
    };
};
