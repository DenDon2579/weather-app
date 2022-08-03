import React from 'react';
import { useAppSelector } from '../../hooks/react-redux/react-redux-hooks';
import CitySearchForm from './citySearchForm/CitySearchForm';
import classes from './Content.module.scss';
import CurrentWeatherContent from './currentWeatherContent/CurrentWeatherContent';

interface IProps {}

const Content: React.FC<IProps> = (props) => {
    const status = useAppSelector(
        (state) => state.weatherReducer.requestData.status
    );
    return (
        <div>
            <div className={status === 'fulfilled' ? classes.wrapper : ''}>
                <CitySearchForm />
                {status === 'fulfilled' && <CurrentWeatherContent />}
            </div>
        </div>
    );
};
export default Content;
