export interface IMarks {
    feels_like: {
        title: string;
        value: number;
        metrics: string;
    };
    pressure: {
        title: string;
        value: number;
        metrics: string;
    };
    humidity: {
        title: string;
        value: number;
        metrics: string;
    };
    windSpeed: {
        title: string;
        value: number;
        metrics: string;
    };
}

export type degType = 'C' | 'F' | 'K';
