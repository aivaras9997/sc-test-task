import React, { useEffect, useState } from 'react'
import { bitcoinData } from 'interfaces/currentPrice.interface';
import { getCurrentPrice } from '../services/coindesk.service'
import CurrencyTable from './currencyTable';
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';
import './currencyConversionWrapper.scss';

/**
 * Main currency conversion wrapper which holds all logic together
*/
export default function CurrencyConversionWrapper() {
    const oneMinuteInMs = 60000;
    const [currentBitcoinPrice, setCurrentBitcoinPrice] = useState<bitcoinData>();
    const [inputValue, setInputValue] = useState<number>(1);
    let time;
    let table;
    renterTime();
    renderTableView(inputValue);

    /**
     * Making API request to coindesk for bitcoin price rate
     * @returns void
    */
    function getCurrentPriceData(): void {
        getCurrentPrice().then(
            (result: any) => {
            setCurrentBitcoinPrice(result.data);
            },
            (error) => {
            console.error(error)
            }
        );
    }

    /**
     * Render time chip to show when last time data was updated
     * @returns void
    */
    function renterTime(): void {
        if (currentBitcoinPrice && currentBitcoinPrice.time && currentBitcoinPrice.time.updated){
            time = <Chip size="small" label={currentBitcoinPrice.time.updated}/>
        }
        else time = <Chip size="small" label="No exchange rates received"/>
    }

    /**
     * Render table view based on received currentBitcoinPrice and inputValue
     * @param {number} inputValue
     * @returns void
    */
    function renderTableView(inputValue: number): void {
        if (currentBitcoinPrice && currentBitcoinPrice.bpi){
            table = <CurrencyTable bpi={currentBitcoinPrice.bpi} inputNumber={inputValue}/>
        }  
        else table = <div>No data received!</div>
    }

    /**
     * Handling input value change to set new input value and reload the table dom
     * @param {any} event
     * @returns void
    */
    function handleChange(event: any): void {
        setInputValue(event.target.value);
      }

    useEffect(() => {
        getCurrentPriceData();
        const intervalId = setInterval(() => {
            getCurrentPriceData();
        }, oneMinuteInMs)
        return () => clearInterval(intervalId);
    }, [])
    
    return (
        <div className="wrapper">
            <div className="wrapper-field">
                <TextField inputProps={{maxLength: 20}} size="small" id="outlined-basic" label="Amount of Bitcoins (₿)" variant="outlined" value={inputValue} onChange={handleChange}/>
            </div>
            {table}
            {time}
        </div>
    )
}
