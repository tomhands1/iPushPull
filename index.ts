import AdaptableBlotter from "@adaptabletools/adaptableblotter/agGrid";
import ipushpull from "ipushpull-js";

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

const columnDefs = [
  { field: "OrderId", type: "abColDefNumber" },
  {
    field: "CompanyName",

    type: "abColDefString"
  },
  {
    field: "ContactName",
    type: "abColDefString"
  },
  {
    field: "Employee",
    type: "abColDefString"
  },
  {
    field: "InvoicedCost",
    type: "abColDefNumber"
  }
];

ipushpull.config.set({
  api_url: "https://www.ipushpull.com/api/1.0",
  ws_url: "https://www.ipushpull.com",
  web_url: "https://www.ipushpull.com",
  docs_url: "https://docs.ipushpull.com",
  storage_prefix: "ipp_local",
  api_key: process.env.IPUSHPULL_API_KEY as string,
  api_secret: process.env.IPUSHPULL_API_SECRET as string,
  transport: "polling",
  hsts: false // strict cors policy
});

let demoConfig: PredefinedConfig = {
  Dashboard: {
    VisibleToolbars: ["QuickSearch", "Export", "Layout", "AdvancedSearch"]
  },
  Partner: {
    iPushPull: {
      iPushPullConfig: ipushpull,
      Username: process.env.IPUSHPULL_USERNAME as string,
      Password: process.env.IPUSHPULL_PASSWORD as string
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
    rowData: null
  },
  predefinedConfig: demoConfig
};

const api: BlotterApi = AdaptableBlotter.init(blotterOptions);

// we simulate server loading - so when the blotter is ready
api.eventApi.on("BlotterReady", () => {
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
