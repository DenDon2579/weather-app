import React from 'react';
import { IMarks } from '../../../../types/general/general';

import MarkItem from './markItem/MarkItem';
import classes from './MarkList.module.scss';

interface IProps {
    marks: IMarks | undefined;
}

const MarkList: React.FC<IProps> = (props) => {
    let markList: { title: string; value: number; metrics: string }[] = [
        { title: '', value: 0, metrics: '' },
    ];
    if (props.marks) {
        markList = Object.entries(props.marks).map((i) => i[1]);
    }

    return (
        <div className={classes.wrapper}>
            {markList.map((mark, i) => (
                <MarkItem key={i} mark={mark} />
            ))}
        </div>
    );
};
export default MarkList;
