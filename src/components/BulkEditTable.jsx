import { Grid, Input,Select } from 'react-spreadsheet-grid';
import { useState } from 'react';
import { useInvoiceListData } from '../redux/hooks';
import Button from "react-bootstrap/Button";
import { useDispatch } from 'react-redux';
import { updateTheBulkInvoice } from '../redux/invoicesSlice';
import { Link } from 'react-router-dom';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
const currencies = [
    { id: '$', name: 'USD (United States Dollar)' },
    { id: '£', name: 'GBP (British Pound Sterling)' },
    { id: '¥', name: 'JPY (Japanese Yen)' },
    { id: '$', name: 'CAD (Canadian Dollar)' },
    { id: '$', name: 'AUD (Australian Dollar)' },
    { id: '$', name: 'SGD (Singapore Dollar)' },
    { id: '¥', name: 'CNY (Chinese Renminbi)' },
    { id: '₿', name: 'BTC (Bitcoin)' }
];
const BulkEditTable = () => {
    const { invoiceList } = useInvoiceListData();
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const dispatch=useDispatch();
    const [selectedRows, setSelectedRows] = useState([]);

    const toggleRowSelection = (rowId) => {
        const isSelected = selectedRows.includes(rowId);
        let updatedSelectedRows;

        if (isSelected) {
            updatedSelectedRows = selectedRows.filter(id => id !== rowId);
        } else {
            updatedSelectedRows = [...selectedRows, rowId];
        }

        setSelectedRows(updatedSelectedRows);
    };
    const handleBulkDelete = () => {
        const updatedRows = rows.filter(row => !selectedRows.includes(row.id));
        setRows(updatedRows);
        dispatch(updateTheBulkInvoice(updatedRows))
        setSnackbarMessage('Items deleted successfully.');
        setSnackbarOpen(true);
    };
    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    const [rows, setRows] = useState(invoiceList);
    console.log(rows,"this is edit rows")
    const onFieldChange = (rowId, field) => (value) => {
        // Using functional update to correctly modify the state
        setRows(prevRows => {
            const updatedRows = prevRows.map(row => {
                if (row.id === rowId) {
                    return { ...row, [field]: value };
                }
                return row;
            });
            return updatedRows;
        });
    }
    
    const handleBulkEdit=()=>{
        setSnackbarMessage('Items Updated successfully.');
        setSnackbarOpen(true);
        dispatch(updateTheBulkInvoice(rows))
    }
    const initColumns = () => [
        {
            title: () => 'Select',
            value: (row, { focus }) => {
                return (
                    <input
                        type="checkbox"
                        checked={row.selected}
                        
                        onChange={() => toggleRowSelection(row.id)}
                    />
                );
            }
        },
        {
            title: () => 'ID',
            value: (row, { focus }) => {
                return (
                    <Input
                        value={row.id}
                        focus={focus}
                        onChange={onFieldChange(row.id, 'id')}
                    
                    />
                );
            },
            id:'invoiceId'
            
        },
        {
            title: () => 'invoiceNumber',
            value: (row, { focus }) => {
                return (
                    <Input
                        value={row.invoiceNumber}
                        focus={focus}
                        onChange={onFieldChange(row.id, 'invoiceNumber')}
                    />
                );
            },
            id:'invoiceNumber'
        },
        {
            title: () => 'billTo',
            value: (row, { focus }) => {
                return (
                    <Input
                        value={row.billTo}
                        focus={focus}
                        onChange={onFieldChange(row.id, 'billTo')}
                    />
                );
            }
        },
        {
            title: () => 'billToEmail',
            value: (row, { focus }) => {
                return (
                    <Input
                        value={row.billToEmail}
                        focus={focus}
                        onChange={onFieldChange(row.id, 'billToEmail')}
                        disabled={true}
                    />
                );
            }
        },
        {
            title: () => 'billToAddress',
            value: (row, { focus }) => {
                return (
                    <Input
                        value={row.billToAddress}
                        focus={focus}
                        onChange={onFieldChange(row.id, 'billToAddress')}
                    />
                );
            }
        },
        {
            title: () => 'billFrom',
            value: (row, { focus }) => {
                return (
                    <Input
                        value={row.billFrom}
                        focus={focus}
                        onChange={onFieldChange(row.id, 'billFrom')}
                    />
                );
            }
        },
        {
            title: () => 'billFromEmail',
            value: (row, { focus }) => {
                return (
                    <Input
                        value={row.billFromEmail}
                        focus={focus}
                        onChange={onFieldChange(row.id, 'billFromEmail')}
                    />
                );
            }
        },
        {
            title: () => 'billFromAddress',
            value: (row, { focus }) => {
                return (
                    <Input
                        value={row.billFromAddress}
                        focus={focus}
                        onChange={onFieldChange(row.id, 'billFromAddress')}
                    />
                );
            }
        },
        // {
        //     title: 'Currency',
        //     value: (row, {focus}) => {
        //         return (
        //             <Select
        //                 items={currencies}
        //                 selectedId={row.currency}
        //                 isOpen={focus}
        //                 onChange={onFieldChange(row.id, 'currency')}
        //             />
        //         );
        //     },
        //     id: 'contract',
        //     width: 21,
        // }
    ];

    return (
        <>
        <div style={{maxHeight:'600px',overflow:'auto'}}>
        <Grid
            columns={initColumns()}
            rows={rows}
            focusOnSingleClick={true}
            getRowKey={row => row.id}
            disabledCellChecker={(row, columnId) => {
                return columnId === 'invoiceNumber' ||
                    columnId === 'invoiceId';
                   
            }}

        />
        </div>
        <div className='d-flex gap-2 mt-3'>
            <Button onClick={handleBulkEdit}>Edit Bulk</Button>
            <Button onClick={handleBulkDelete} disabled={selectedRows.length===0}>Delete Selected</Button>
        </div>

        <Link to="/" >
            <h5 className='mt-3'>Go Back</h5>
          </Link>
          <Snackbar
                open={snackbarOpen}
                autoHideDuration={4000} // Adjust duration as needed
                onClose={handleCloseSnackbar}
            >
                <MuiAlert
                    elevation={6}
                    variant="filled"
                    onClose={handleCloseSnackbar}
                    severity="success" // Change severity as needed (success, error, warning, info)
                >
                    {snackbarMessage}
                </MuiAlert>
            </Snackbar>
        </>
    )
}
export default BulkEditTable;
