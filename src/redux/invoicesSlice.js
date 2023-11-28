import { createSlice } from "@reduxjs/toolkit";
import produce from "immer";
const invoicesSlice = createSlice({
  name: "invoices",
  initialState: [],
  reducers: {
    addInvoice: (state, action) => {
      state.push(action.payload);
    },
    deleteInvoice: (state, action) => {
      return state.filter((invoice) => invoice.id !== action.payload);
    },
    updateInvoice: (state, action) => {
      const index = state.findIndex(
        (invoice) => invoice.id == action.payload.id // BugFix-Here replcing === with == as we are string type id with number type id
      );
      if (index !== -1) {
        state[index] = action.payload.updatedInvoice;
      }
    },
    updateTheBulkInvoice: (state, action) => {
      return [...action.payload];
    },
    updateBulkItemsWithId: (state, action) => {
      const { rowId, rows, ...rest } = action.payload;
      return state.map((invoice) => {
        if (invoice.id === rowId) {
          return {
            ...invoice,
            items: [...rows],
            ...rest,
          };
        }
        return invoice;
      });
    },
  },
});

export const {
  addInvoice,
  deleteInvoice,
  updateInvoice,
  updateTheBulkInvoice,
  updateBulkItemsWithId,
} = invoicesSlice.actions;

export const selectInvoiceList = (state) => state.invoices;

export default invoicesSlice.reducer;
