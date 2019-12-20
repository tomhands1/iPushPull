import AdaptableBlotter from "@adaptabletools/adaptableblotter/agGrid";
import ipushpull from "ipushpull-js";
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from "react-redux";
import { createStore } from 'redux';

import "@adaptabletools/adaptableblotter/index.css";
import "@adaptabletools/adaptableblotter/themes/dark.css";

import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-balham.css";
import "ag-grid-community/dist/styles/ag-theme-balham-dark.css";

import {
    AdaptableBlotterOptions,
    PredefinedConfig,
    BlotterApi
} from "@adaptabletools/adaptableblotter/types";

import rootReducer from "./rootReducer";
import { updateSelectedGrid } from './application-toolbar/actions';
import ApplicationToolbar from './application-toolbar/ApplicationToolbar';


const store = createStore(rootReducer);
const columnDefs = [
    { field: "OrderId", type: "abColDefNumber", sortable: true, filter: true },
    { field: "CompanyName", type: "abColDefString" },
    { field: "ContactName", type: "abColDefString" },
    { field: "Employee", type: "abColDefString" },
    { field: "InvoicedCost", type: "abColDefNumber", sortable: true }
];

ipushpull.config.set({
    api_url: "https://test.ipushpull.com/api/1.0",
    ws_url: "https://test.ipushpull.com",
    web_url: "https://test.ipushpull.com",
    docs_url: "https://docs.ipushpull.com",
    storage_prefix: "ipp_local",
    api_key: `${ process.env.IPUSHPULL_API_KEY }`,
    api_secret: `${process.env.IPUSHPULL_API_SECRET}`,
    transport: "polling",
    hsts: false // strict cors policy
});

let demoConfig: PredefinedConfig = {
    Dashboard: {
        VisibleToolbars: ["Application", "QuickSearch", "Export", "Layout", "AdvancedSearch"]
    },
    Partner: {
        iPushPull: {
            iPushPullInstance: ipushpull,
            Username: `${process.env.IPUSHPULL_USERNAME}`,
            Password: `${process.env.IPUSHPULL_PASSWORD}`,
        }
    }
};

const blotterOptions: AdaptableBlotterOptions = {
    primaryKey: "OrderId",
    userName: "Demo User",
    blotterId: "IPushPull Integration",

    vendorGrid: {
        columnDefs,
        columnTypes: {
            abColDefNumber: {},
            abColDefString: {},
            abColDefBoolean: {},
            abColDefDate: {},
            abColDefNumberArray: {},
            abColDefObject: {}
        },
        rowData: null,
        enableRangeSelection: true,
        rowSelection: "multiple"
    },
    predefinedConfig: demoConfig
};

export const api: BlotterApi = AdaptableBlotter.init(blotterOptions);

// we simulate server loading - so when the blotter is ready
api.eventApi.on("BlotterReady", () => {
    const contentsDiv = api.applicationApi.getApplicationToolbarContentsDiv();    
    
    ReactDOM.render(
        <Provider store={store}>
            <ApplicationToolbar />
        </Provider>
        , contentsDiv
    );
    
    // we load the json orders
    import("./orders.json")
        .then(data => data.default)
        .then(data => {
            // add an extra timeout
            setTimeout(() => {
                // and then set the correct row data
                api.gridApi.getVendorGrid().api.setRowData(data);
            }, 500);
        });
});

api.eventApi.on("SelectionChanged", () => {
    const selectedCells = api.gridApi.getSelectedCellInfo();
    console.log('index', selectedCells);
    //Action below not being dispatched, not sure on how I can get round this, if I need to?
    updateSelectedGrid(selectedCells.Columns, selectedCells.GridCells);
})