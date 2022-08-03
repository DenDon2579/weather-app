import React from 'react';
import {
    convertTemperature,
    setDeg,
} from '../../../data/reducers/weatherReducer';

import {
    useAppDispatch,
    useAppSelector,
} from '../../../hooks/react-redux/react-redux-hooks';

import classes from './CurrentWeatherContent.module.scss';

import MarkList from './markList/MarkList';

const CurrentWeatherContent: React.FC = () => {
    const dispatch = useAppDispatch();
    const weather = useAppSelector((state) => state.weatherReducer);
    const deg = weather.general.deg;
    const changeDeg = () => {
        if (deg === 'C') {
            dispatch(convertTemperature({ from: 'C', to: 'F' }));
            dispatch(setDeg('F'));
        } else if (deg === 'F') {
            dispatch(convertTemperature({ from: 'F', to: 'K' }));
            dispatch(setDeg('K'));
        } else {
            dispatch(convertTemperature({ from: 'K', to: 'C' }));
            dispatch(setDeg('C'));
        }
    };
    return (
        <div className={classes.wrapper}>
            <div className={classes.top}>
                <div className={classes.topLeft}>
                    <span className={classes.status}>
                        {weather.weatherData?.status}
                    </span>
                    <img src={weather.weatherData?.icon} alt='' />
                    <span className={classes.temperature}>
                        {weather.weatherData?.temp}
                        {deg !== 'K' && '°'}{' '}
                        <span onClick={changeDeg} className={classes.degree}>
                            {deg}
                        </span>
                    </span>
                </div>
                <div className={classes.topRight}>
                    <MarkList marks={weather.weatherData?.marks} />
                </div>
            </div>
        </div>
    );
};
export default CurrentWeatherContent;
