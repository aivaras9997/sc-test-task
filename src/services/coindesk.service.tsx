import axios from 'axios';

export function getCurrentPrice() {
    return axios('https://api.coindesk.com/v1/bpi/currentprice.json')
}