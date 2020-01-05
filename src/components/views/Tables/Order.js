import React, { useEffect, useState } from "react";
import propTypes from "prop-types";

const Order = ({ match }) => {
  useEffect(() => {
    fetchItems();
  });

  const [detail, setItems] = useState([]);

  const fetchItems = async () => {
    const data = await fetch("http://localhost:3131/api/db/");
    const items = await data.json();
    const { order } = items;
    if (match.path.includes("order")) {
      var detail = order.filter(item => item.id === match.params.id);
      setItems(detail);
    }
  };

  return (
    <div>
      <p>Order Details:</p>
    </div>
  );
};

Order.propTypes = {
  match: propTypes.node
};

export default Order;
