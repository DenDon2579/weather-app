import React from 'react';
import { useAppSelector } from '../hooks/react-redux/react-redux-hooks';
import Content from './content/Content';
import classes from './Layout.module.scss';

const Layout: React.FC = () => {
    const image = useAppSelector((state) => state.weatherReducer.general.image);

    return (
        <div className={`${classes.wrapper} ${classes[image.toLowerCase()]}`}>
            <Content />
        </div>
    );
};

export default Layout;
