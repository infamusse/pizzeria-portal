import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./Tables.scss";

const Tables = () => {
  useEffect(() => {
    fetchItems();
  }, []);

  const [booking, setBookings] = useState([]);
  const [event, setEvents] = useState([]);

  const fetchItems = async () => {
    const data = await fetch("http://localhost:3131/api/db/");
    const items = await data.json();
    console.log(items);
    const { event, booking } = items;
    setBookings(booking);
    setEvents(event);
  };

  return (
    <h2 className={styles.component}>
      <h2>Tables View</h2>
      <p>Bookings:</p>
      <ul>
        {booking.map(item => (
          <li key={item.id}>
            <Link to={`/tables/booking/${item.id}`}>
              {item.date} ({item.hour}) Table: {item.table}
            </Link>
          </li>
        ))}
      </ul>
      <p>Events:</p>
      <ul>
        {event.map(item => (
          <li key={item.id}>
            <Link to={`/tables/events/${item.id}`}>
              {item.date} ({item.hour}) Table: {item.table}
            </Link>
          </li>
        ))}
      </ul>
    </h2>
  );
};

export default Tables;
