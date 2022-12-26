import * as React from "react";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import { LocalizationProvider } from "@mui/x-date-pickers-pro";
import { AdapterDayjs } from "@mui/x-date-pickers-pro/AdapterDayjs";
import { DateRangePicker } from "@mui/x-date-pickers-pro/DateRangePicker";
import EventIcon from "@mui/icons-material/Event";

const addDays = (date, n) => {
  var time = date.getTime();
  var changedDate = new Date(time + n * 24 * 60 * 60 * 1000);
  return changedDate;
};

const initialEndDate = new Date();
const initialStartDate = addDays(initialEndDate, -30);

export default function BasicDateRangePicker({ setDate }) {
  const [value, setValue] = React.useState([initialStartDate, initialEndDate]);

  React.useEffect(() => {
    console.log(value);
    if (value[0] && value[1]) {
      setDate([
        [value[0].$D, value[0].$M, value[0].$y].join("-"),
        [value[1].$D, value[1].$M, value[1].$y].join("-"),
      ]);
    }
  }, [value,setDate]);

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
