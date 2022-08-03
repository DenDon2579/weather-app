import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { fetchCurrentWeather } from '../../../data/reducers/weatherReducer';

import {
    useAppDispatch,
    useAppSelector,
} from '../../../hooks/react-redux/react-redux-hooks';
import classes from './CitySearchForm.module.scss';

const CitySearchForm: React.FC = () => {
    const [value, setValue] = useState<string>('');
    const [errorCityValue, setErrorCityValue] = useState<string>('');
    const [inputClasses, setInputClasses] = useState<string[]>([classes.input]);
    const request = useAppSelector((state) => state.weatherReducer.requestData);
    const dispatch = useAppDispatch();
    const formSubmitHandler = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (value) {
            dispatch(fetchCurrentWeather(value));
        }
    };

    const inputChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
    };

    const inputFocusHandler = () => {
        setInputClasses([...inputClasses, classes.inputOnFocus]);
    };

    const inputBlurHandler = () => {
        if (!value && request.status !== 'fulfilled') {
            setInputClasses((prev) =>
                prev.filter((i) => i !== classes.inputOnFocus)
            );
        }
    };

    useEffect(() => {
        if (request.status === 'pending') {
            setInputClasses([
                classes.input,
                classes.inputOnFocus,
                classes.inputOnPending,
            ]);
        } else if (request.error) {
            setErrorCityValue(value);
            setInputClasses([
                classes.input,
                classes.inputOnFocus,
                classes.inputOnError,
            ]);
        } else if (request.status === 'fulfilled') {
            setInputClasses([
                classes.input,
                classes.inputOnFocus,
                classes.inputOnDone,
            ]);
        }
    }, [request.status, request.error]);

    return (
        <div className={classes.wrapper}>
            <form onSubmit={formSubmitHandler} className={classes.form}>
                <input
                    onFocus={inputFocusHandler}
                    onBlur={inputBlurHandler}
                    onChange={inputChangeHandler}
                    value={value}
                    className={inputClasses.join(' ')}
                    placeholder='city name'
                />
            </form>
            {request.error === 'CITY_NOT_FOUND' && (
                <span className={classes.error}>
                    city with name '{errorCityValue}' not found
                </span>
            )}
            {request.error === 'SERVER_ERROR' && (
                <span className={classes.error}>SERVER ERROR</span>
            )}
        </div>
    );
};
export default CitySearchForm;
