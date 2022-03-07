import React, { useState } from 'react';
import parse from 'html-react-parser';
import NumberFormat from 'react-number-format';
import { bpi, currencyData } from 'interfaces/currentPrice.interface';
import ClearIcon from '@mui/icons-material/Clear';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import './currencyTable.scss';

interface CurrencyTableInterface {
    bpi:bpi, inputNumber:number
}
/**
 * Used to display and add/remove currencies from/to table
 */
export default function CurrencyTable({ bpi, inputNumber }: CurrencyTableInterface) {
    /**
     * MatMenu default logic starts
    */
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    /**
     * MatMenu default logic ends
    */

    const [bpiValue, setBpiValue] = useState<bpi>(bpi);
    const [deletedCurrencies, setDeletedCurrency] = useState<string[]>([]);

    /**
     * Removing clicked currency from a table view
     * Clone deep is in use to avoid affecting main object
     * @param {currencyData} currency
     * @returns void
    */
    function deleteCurrency(currency: currencyData): void {
        const newBpi = JSON.parse(JSON.stringify(bpiValue));
        delete newBpi[currency.code];
        setBpiValue(newBpi);
        const deleted = JSON.parse(JSON.stringify(deletedCurrencies));
        deleted.push(currency.code);
        setDeletedCurrency(deleted);
    }

    /**
     * Adding clicked currency to a table view
     * Clone deep is in use to avoid affecting main object
     * @param {string} currency
     * @returns void
    */
    function addCurrecy(currency: string): void {
        const newBpi = JSON.parse(JSON.stringify(bpiValue));
        newBpi[currency] = bpi[currency];
        setBpiValue(newBpi);
        const deleted = JSON.parse(JSON.stringify(deletedCurrencies));
        deleted.splice(deleted.indexOf(currency), 1);
        setDeletedCurrency(deleted);
        handleClose();
    }

    /**
     * Mapping table body rows and cells based on existing currencies
    */
    function mapTableBody() {
        const bpiList = Object.keys(bpiValue).map(key => 
            bpiValue[key]
        )

        return (<TableBody>
            {bpiList.map((currency: currencyData) => (
                <TableRow key={currency.code}>
                    <TableCell align="right">{currency.code} - {currency.description}</TableCell>
                    <TableCell align="right">{calculateBitcoinPrice(inputNumber, currency)}</TableCell>
                    <TableCell align="right" onClick={() => deleteCurrency(currency)}><ClearIcon /></TableCell>
                </TableRow>
            ))}
            </TableBody>)
    }

    /**
     * Displaying button with menu dropdown for adding currency back to table view
    */
    function showDeletedCurrencies() {
        return (
            <div className="currency-table--add-currencies">
              <Button
                id="add-currency--button"
                aria-controls={open ? 'add-currency-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
                disabled={!deletedCurrencies.length}
              >
                Add currencies
              </Button>
              <Menu
                id="add-currency-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                  'aria-labelledby': 'add-currency--button',
                }}
              >
                {deletedCurrencies.map((currency: string) => (
                    <MenuItem key={currency} onClick={() => addCurrecy(currency)}>{currency}</MenuItem>
                ))}
              </Menu>
            </div>
          );
    }

    /**
     * Calculating bitcoin price based on passed parameters
     * @param {number} inputNumber
     * @param {currencyData} currency
    */
    function calculateBitcoinPrice(inputNumber: number, currency: currencyData) {
        const multiplier:number = inputNumber ? inputNumber : 1;
        const currencyRate:number = Number(currency.rate.replace(',', ''));
        const rateToDisplay = multiplier * currencyRate;
        const currencySymbol = parse(currency.symbol) as string;
        return (
            <NumberFormat value={rateToDisplay} prefix={currencySymbol} displayType={'text'} decimalScale={2} thousandSeparator={true} />
        )
    }
    
    return (
        <>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell align="right">Currency</TableCell>
                            <TableCell align="right">Calculated price</TableCell>
                            <TableCell align="right"></TableCell>
                        </TableRow>
                    </TableHead>
                    {mapTableBody()}
                </Table>
            </TableContainer>
            {showDeletedCurrencies()}
        </>
    )
}