import React from 'react';
import classes from './MarkItem.module.scss';

interface IProps {
    mark: {
        title: string;
        value: number;
        metrics: string;
    };
}

const MarkItem: React.FC<IProps> = (props) => {
    return (
        <div className={classes.wrapper}>
            <div className={classes.markTitle}>{props.mark.title}</div>
            <div className={classes.markValue}>
                {props.mark.value + '' + props.mark.metrics}
            </div>
        </div>
    );
};
export default MarkItem;
