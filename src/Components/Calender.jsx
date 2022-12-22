import * as React from "react";

import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import { LocalizationProvider } from "@mui/x-date-pickers-pro";
import { AdapterDayjs } from "@mui/x-date-pickers-pro/AdapterDayjs";
import { DateRangePicker } from "@mui/x-date-pickers-pro/DateRangePicker";
import EventIcon from "@mui/icons-material/Event";

export default function BasicDateRangePicker() {
  const [value, setValue] = React.useState([null, null]);

  return (
    <div style={{ paddingBottom: "20px", float: "right" }}>
      <LocalizationProvider
        dateAdapter={AdapterDayjs}
        localeText={{
          start: (
            <div style={{ display: "flex", justifyContent: "center" }}>
              <EventIcon fontSize="small" /> &nbsp;Start Date
            </div>
          ),
          end: (
            <div style={{ display: "flex", justifyContent: "center" }}>
              <EventIcon fontSize="small" /> &nbsp;End Date
            </div>
          ),
        }}
      >
        <DateRangePicker
          value={value}
          onChange={(newValue) => {
            setValue(newValue);
          }}
          renderInput={(startProps, endProps) => (
            <React.Fragment>
              <TextField {...startProps} size="small" sx={{ width: 150 }} />
              <Box sx={{ mx: 1 }}> - </Box>
              <TextField {...endProps} size="small" sx={{ width: 150 }} />
            </React.Fragment>
          )}
        />
      </LocalizationProvider>
    </div>
  );
}
