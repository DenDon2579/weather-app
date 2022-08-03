import { IMarks } from '../general/general';

export interface ICurrentWeather {
    temp: number;
    marks: IMarks;
    status: string;
    icon: string;
    location?: {
        city: string;
    };
}
