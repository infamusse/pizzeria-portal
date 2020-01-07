import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./Tables.scss";
import Typography from "@material-ui/core/Typography";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import DateFnsUtils from "@date-io/date-fns"; // choose your lib
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";

const Tables = () => {
  useEffect(() => {
    fetchItems();
  }, []);

  const [booking, setBookings] = useState([]);
  const [event, setEvents] = useState([]);

  const [selectedDate, handleDateChange] = useState(new Date());

  const fetchItems = async () => {
    const data = await fetch("http://localhost:3131/api/db/");
    const items = await data.json();
    console.log(items);
    const { event, booking } = items;
    setBookings(booking);
    setEvents(event);
  };

  const selected = booking.filter(book => book.date == "2019-10-24")[0];

  console.log("today", selected);

  console.log("selectedDate", selectedDate.toISOString().substring(0, 10));

  return (
    <Paper>
      <Typography variant="h3"> Table View: </Typography>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <DatePicker value={selectedDate} onChange={handleDateChange} />
      </MuiPickersUtilsProvider>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Godzina</TableCell>
            <TableCell>Table 1</TableCell>
            <TableCell>Table 2</TableCell>
            <TableCell>Table 3</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {booking.map(row => (
            <TableRow key={row.id}>
              <TableCell>{row.hour}</TableCell>
              {/* <TableCell>
              {row.order && (
                <Button component={Link} to={`/waiter/order/${row.order}`}>
                  {row.order}
                </Button>
              )}
            </TableCell>
            <TableCell>{renderActions(row.status)}</TableCell> */}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
};

export default Tables;
