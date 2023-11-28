import { Grid, Input } from "react-spreadsheet-grid";
import { useEffect, useState } from "react";
import { useInvoiceListData } from "../redux/hooks";
import { useDispatch } from "react-redux";
import { updateTheBulkInvoice } from "../redux/invoicesSlice";
import { BiSolidPencil } from "react-icons/bi";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import EditItemsModal from "./BulkEditItems";
import './BulkEditTable.css'
import CommonSnackbar from "../common/SnackBar";
import { BiArrowBack } from "react-icons/bi";

const BulkEditTable = () => {
  const { invoiceList } = useInvoiceListData();
  const dispatch = useDispatch();
  const [rows, setRows] = useState(invoiceList);
  const [isEditItemOpen, setOpenEdititem] = useState(false);
  const [selectedRow, setSelectedRow] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [severity, setSeverityType] = useState("success");
  const initColumns = () => [
    {
      title: () => "Select",
      value: (row, { focus }) => {
        return (
          <input
            type="checkbox"
            checked={row.selected}
            onChange={() => toggleRowSelection(row.id)}
          />
        );
      },
    },
    {
      title: () => "ID",
      value: (row, { focus }) => {
        return (
          <Input
            value={row.id}
            focus={focus}
            onChange={onFieldChange(row.id, "id")}
          />
        );
      },
      id: "invoiceId",
    },
    {
      title: () => "invoiceNumber",
      value: (row, { focus }) => {
        return (
          <Input
            value={row.invoiceNumber}
            focus={focus}
            onChange={onFieldChange(row.id, "invoiceNumber")}
          />
        );
      },
      id: "invoiceNumber",
    },
    {
      title: () => "billTo",
      value: (row, { focus }) => {
        return (
          <Input
            value={row.billTo}
            focus={focus}
            onChange={onFieldChange(row.id, "billTo")}
          />
        );
      },
    },
    {
      title: () => "billToEmail",
      value: (row, { focus }) => {
        return (
          <Input
            value={row.billToEmail}
            focus={focus}
            onChange={onFieldChange(row.id, "billToEmail")}
            disabled={true}
          />
        );
      },
    },
    {
      title: () => "billToAddress",
      value: (row, { focus }) => {
        return (
          <Input
            value={row.billToAddress}
            focus={focus}
            onChange={onFieldChange(row.id, "billToAddress")}
          />
        );
      },
    },
    {
      title: () => "billFrom",
      value: (row, { focus }) => {
        return (
          <Input
            value={row.billFrom}
            focus={focus}
            onChange={onFieldChange(row.id, "billFrom")}
          />
        );
      },
    },
    {
      title: () => "billFromEmail",
      value: (row, { focus }) => {
        return (
          <Input
            value={row.billFromEmail}
            focus={focus}
            onChange={onFieldChange(row.id, "billFromEmail")}
          />
        );
      },
    },
    {
      title: () => "billFromAddress",
      value: (row, { focus }) => {
        return (
          <Input
            value={row.billFromAddress}
            focus={focus}
            onChange={onFieldChange(row.id, "billFromAddress")}
          />
        );
      },
    },
    {
      title: () => "Edit Items",
      value: (row, { focus }) => {
        return (
          <Button
            variant="outline-primary"
            onClick={() => handleEditItemClick(row)}
          >
            <div className="d-flex align-items-center justify-content-center gap-2">
              <BiSolidPencil />
            </div>
          </Button>
        );
      },
    },
  ];
  const toggleRowSelection = (rowId) => {
    const isSelected = selectedRows.includes(rowId);
    let updatedSelectedRows;

    if (isSelected) {
      updatedSelectedRows = selectedRows.filter((id) => id !== rowId);
    } else {
      updatedSelectedRows = [...selectedRows, rowId];
    }

    setSelectedRows(updatedSelectedRows);
  };
  const handleBulkDelete = () => {
    const updatedRows = rows.filter((row) => !selectedRows.includes(row.id));
    setRows(updatedRows);
    dispatch(updateTheBulkInvoice(updatedRows));
    setSnackbarMessage("Items deleted successfully.");
    setSnackbarOpen(true);
  };
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };
  const isValidField = (field, value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if ((field === 'billFromEmail' || field === 'billToEmail') && !emailRegex.test(value)) {
      return false;
    }
    return true;
  };
  const onFieldChange = (rowId, field) => (value) => {
    setRows((prevRows) => {
      const updatedRows = prevRows.map((row) => {
        if (row.id === rowId) {
            if (isValidField(field, value)) {
                return { ...row, [field]: value };
              } else {
                setSnackbarOpen(true);
                setSeverityType('error');
                setSnackbarMessage(`Enter Valid Mail id`);
                return row;
              }
            }
            return row;
      });
      return updatedRows;
    });
  };
  const handleBulkEdit = () => {
    setSnackbarMessage("Items Updated successfully.");
    setSnackbarOpen(true);
    setSeverityType('success')
    dispatch(updateTheBulkInvoice(rows));
  };
  const handleEditItemClick = (row) => {
    setSelectedRow(row);
    setOpenEdititem(true);
  };
  const closeModel = () => {
    setOpenEdititem(false);
  };

  const renderPlaceholder = () => {
    return (
      <div className="d-flex justify-content-center fs-5">No items found</div>
    );
  };
  useEffect(() => {
    setRows(invoiceList);
  }, [invoiceList]);
  return (
    <>
      <div className="table-height">
        <Grid
          columns={initColumns()}
          rows={rows}
          focusOnSingleClick={true}
          getRowKey={(row) => row.id}
          disabledCellChecker={(row, columnId) => {
            return columnId === "invoiceNumber" || columnId === "invoiceId";
          }}
        />
        {rows.length === 0 && renderPlaceholder()}
      </div>
      <div className="d-flex gap-2 mt-3">
        <Button onClick={handleBulkEdit}>Edit items</Button>
        <Button onClick={handleBulkDelete} disabled={selectedRows.length === 0}>
          Delete Selected
        </Button>
      </div>
      <Link to="/">
      <div className="d-flex align-items-center">
        <BiArrowBack size={18} />
        <div className="fw-bold mt-1 mx-2 cursor-pointer">
          <Link to="/">
            <h5>Go Back</h5>
          </Link>
        </div>
      </div>
      </Link>
      <CommonSnackbar open={snackbarOpen} message={snackbarMessage} severity={severity} handleClose={handleCloseSnackbar} />
      <EditItemsModal
        isEditItemOpen={isEditItemOpen}
        handleClose={closeModel}
        selectedItems={selectedRow.items}
        row={selectedRow}
        rowId={selectedRow.id}
      />
    </>
  );
};
export default BulkEditTable;
