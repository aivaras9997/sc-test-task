export interface bitcoinData {
    chartName: string;
    disclaimer: string;
    time: time;
    bpi: bpi;
}
export interface time {
    updated: string;
    updatedISO: string;
    updateduk: string;
}
export interface bpi {
    [key:string]: currencyData;
}
export interface currencyData {
    code: string;
    description: string;
    rate: string;
    rate_float: number;
    symbol: string;
}