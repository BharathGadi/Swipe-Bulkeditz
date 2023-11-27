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
      console.log(action.payload,"this is payload")
      return produce(state, (draftState) => {
        const index = draftState.findIndex(
          (invoice) => invoice.id == action.payload.id
        );
        if (index !== -1) {
          draftState[index] = action.payload.updatedInvoice;
        }
      });
    },
    updateTheBulkInvoice:(state,action)=>{
     return [...action.payload]
    }
  },
});

export const {
  addInvoice,
  deleteInvoice,
  updateInvoice,
  updateTheBulkInvoice
} = invoicesSlice.actions;

export const selectInvoiceList = (state) => state.invoices;

export default invoicesSlice.reducer;
