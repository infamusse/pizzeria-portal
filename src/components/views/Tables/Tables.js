import React, { useEffect } from "react";
import styles from "./Tables.scss";

const Tables = () => {
  useEffect(() => {
    // Zaktualizuj tytuł dokumentu korzystając z interfejsu API przeglądarki
    fetchItems();
  }, []);

  const fetchItems = async () => {
    const data = await fetch("http://localhost:3131/api/db/");
    const items = await data.json();
    console.log(items);
  };

  return (
    <h2 className={styles.component}>
      <h2>Tables View</h2>
    </h2>
  );
};

export default Tables;
