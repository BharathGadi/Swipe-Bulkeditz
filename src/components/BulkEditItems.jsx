import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { updateBulkItemsWithId } from "../redux/invoicesSlice";
import { Grid, Input } from "react-spreadsheet-grid";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import CommonSnackbar from "../common/SnackBar";

const EditItemsModal = ({
  isEditItemOpen,
  handleClose,
  selectedItems,
  rowId,
  row: rowAll,
}) => {
  const dispatch = useDispatch();
  const [discountC, setDiscountChange] = useState(0);
  const [taxC, setTaxChange] = useState(0);
  const [subTotalC, setSubTotalChange] = useState(0);
  const [rows, setRows] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [severity, setSeverityType] = useState("error");

  /* Defining the Table columns */
  const initColumns = () => [
    {
      title: () => "Item Name",
      value: (row, { focus }) => {
        return (
          <Input
            value={row.itemName}
            focus={focus}
            onChange={onFieldChange(row.itemId, "itemName")}
          />
        );
      },
    },
    {
      title: () => "Item Description",
      value: (row, { focus }) => {
        return (
          <Input
            value={row.itemDescription}
            focus={focus}
            onChange={onFieldChange(row.itemId, "itemDescription")}
          />
        );
      },
    },
    {
      title: () => "Item Quantity",
      value: (row, { focus }) => {
        return (
          <Input
            value={row.itemQuantity}
            focus={focus}
            onChange={onFieldChange(row.itemId, "itemQuantity")}
          />
        );
      },
    },
    {
      title: () => "Item Price",
      value: (row, { focus }) => {
        return (
          <Input
            value={row.itemPrice}
            focus={focus}
            onChange={onFieldChange(row.itemId, "itemPrice")}
          />
        );
      },
    },
    {
      title: () => "Actions",
      value: (row) => (
        <Button variant="danger" onClick={() => handleDeleteRow(row.itemId)}>
          Delete
        </Button>
      ),
    },
  ];

  const handleTaxrateChange = (e) => {
    if (e.target.value <= 100) {
      setTaxChange(e.target.value);
    } else {
      setSnackbarOpen(true);
      setSeverityType("warning");
      setSnackbarMessage("Tax rate can't be greater than 100");
    }
  };
  const handleDiscountrateChange = (e) => {
    if (e.target.value <= 100) {
      setDiscountChange(e.target.value);
    } else {
      setSnackbarOpen(true);
      setSeverityType("warning");
      setSnackbarMessage("Discount rate  can't be greater than 100");
    }
  };
  const onFieldChange = (rowId, field) => (value) => {
    setRows((prevRows) => {
      const updatedRows = prevRows.map((row) => {
        if (row.itemId === rowId) {
          if (isValidField(field, value)) {
            return { ...row, [field]: value };
          } else {
            setSnackbarOpen(true);
            setSeverityType("error");
            setSnackbarMessage(`Please enter valid value`);
            return row;
          }
        }
        return row;
      });
      return updatedRows;
    });
  };
  const handleDeleteRow = (itemId) => {
    const updatedRows = rows.filter((row) => row.itemId !== itemId);
    setRows(updatedRows);
    dispatch(
      updateBulkItemsWithId({
        rowId,
        rows: updatedRows,
        ...handleCalculateTotal(),
        discountRate: discountC,
        taxRate: taxC,
      })
    );
  };
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };
   /* Calculating the subamount,total,tax,dicount */
  const handleCalculateTotal = () => {
    let subTotal = 0;
    rows?.forEach((item) => {
      subTotal +=
        parseFloat(item.itemPrice).toFixed(2) * parseInt(item.itemQuantity);
    });

    const taxAmount = parseFloat(subTotal * (taxC / 100)).toFixed(2);
    const discountAmount = parseFloat(subTotal * (discountC / 100)).toFixed(2);
    const total = (
      subTotal -
      parseFloat(discountAmount) +
      parseFloat(taxAmount)
    ).toFixed(2);
    setSubTotalChange(total);
    return { subTotal, taxAmount, discountAmount, total };
  };

  const isValidField = (field, value) => {
    const numericRegex = /^[0-9]*$/;
    if (
      (field === "itemPrice" || field === "itemQuantity") &&
      !numericRegex.test(value)
    ) {
      return false;
    } else return true;
  };

  const renderPlaceholder = () => {
    return (
      <div className="d-flex justify-content-center fs-5">
        No items found
      </div>
    );
  };
  const handleEditItems = () => {
    dispatch(
      updateBulkItemsWithId({
        rowId,
        rows,
        ...handleCalculateTotal(),
        discountRate: discountC,
        taxRate: taxC,
      })
    );
    setSnackbarOpen(true);
    setSeverityType("success");
    setSnackbarMessage("Items successfully updated");
    handleClose();
  };
  React.useEffect(() => {
    setRows(selectedItems);
    setDiscountChange(rowAll?.discountRate);
    setTaxChange(rowAll?.taxRate);
    setSubTotalChange(rowAll?.total);
  }, [isEditItemOpen]);
  React.useEffect(() => {
    handleCalculateTotal();
  }, [rows, taxC, discountC]);

  return (
    <>
      <Modal show={isEditItemOpen} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Items</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Grid
            columns={initColumns()}
            rows={rows}
            getRowKey={(row) => row.id}
            focusOnSingleClick={true}
            placeholder="There are no rows"
          />
          {(rows?.length === 0 || !rows) && renderPlaceholder()}
        </Modal.Body>
        <Form.Group className="my-3 p-2">
          <Form.Label className="fw-bold">Tax rate:</Form.Label>
          <InputGroup className="flex-nowrap">
            <Form.Control
              name="taxRate"
              type="number"
              value={taxC}
              onChange={handleTaxrateChange}
              className="bg-white border"
              placeholder="0.0"
              min="0.00"
              step="0.01"
              max="100.00"
            />
            <InputGroup.Text className="bg-light fw-bold text-secondary small">
              %
            </InputGroup.Text>
          </InputGroup>
        </Form.Group>
        <Form.Group className="my-3 p-2">
          <Form.Label className="fw-bold">Discount rate:</Form.Label>
          <InputGroup className="my-1 flex-nowrap">
            <Form.Control
              name="discountRate"
              type="number"
              value={discountC}
              onChange={handleDiscountrateChange}
              className="bg-white border"
              placeholder="0.0"
              min="0.00"
              step="0.01"
              max="100.00"
            />
            <InputGroup.Text className="bg-light fw-bold text-secondary small">
              %
            </InputGroup.Text>
          </InputGroup>
        </Form.Group>
        <div
          className="d-flex flex-row align-items-start justify-content-between p-2"
          style={{ fontSize: "1.125rem" }}
        >
          <span className="fw-bold">Total:</span>
          <span className="fw-bold">
            {rowAll?.currency}
            {subTotalC || 0}
          </span>
        </div>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleEditItems}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
      <CommonSnackbar
        open={snackbarOpen}
        message={snackbarMessage}
        severity={severity}
        handleClose={handleCloseSnackbar}
      />
    </>
  );
};

export default EditItemsModal;
