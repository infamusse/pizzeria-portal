import React, { useEffect, useState } from "react";
import propTypes from "prop-types";

const ReservationDetail = ({ match }) => {
  useEffect(() => {
    fetchItems();
  });

  const [detail, setItems] = useState([]);

  const fetchItems = async () => {
    const data = await fetch("http://localhost:3131/api/db/");
    const items = await data.json();
    const { booking } = items;
    if (match.path.includes("booking")) {
      var detail = booking.filter(item => item.id == match.params.id);
      setItems(detail);
    }

    console.log("book", detail);
  };

  return (
    <div>
      <p>Reservation Details:</p>
      <ul>
        {detail.map(d => (
          <ul key={d.id}>
            <li> Id rezerwacji: {d.id} </li>
            <li> Data: {d.date} </li>
            <li> Godzina: {d.hour} </li>
            <li> Stół: {d.table} </li>
            <li> Długość: {d.duration} </li>
            <div>
              <h4> Startery: </h4>
              {d.starters.length > 0 ? (
                d.starters.map(starter => <li key={starter}> {starter} </li>)
              ) : (
                <p> Brak </p>
              )}
            </div>
          </ul>
        ))}
      </ul>
    </div>
  );
};

ReservationDetail.propTypes = {
  match: propTypes.node
};

export default ReservationDetail;
