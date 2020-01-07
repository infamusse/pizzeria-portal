import React from "react";
import styles from "./Dashboard.scss";
import Typography from "@material-ui/core/Typography";

const Dashboard = () => {
  return (
    <h2 className={styles.component}>
      <Typography variant="h3">Dashboard View</Typography>
    </h2>
  );
};

export default Dashboard;
