import React from "react";
import propTypes from "prop-types";
import PageNav from "../PageNav/PageNav";

const MainLayout = ({ children }) => {
  return (
    <div>
      <PageNav />
      {children}
    </div>
  );
};

MainLayout.propTypes = {
  children: propTypes.node
};

export default MainLayout;
