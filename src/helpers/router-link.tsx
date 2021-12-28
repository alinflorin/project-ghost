import { Link } from "@fluentui/react";
import React from "react";
import { Link as RLink } from "react-router-dom";

export const RouterLink = ({ to, children }: any) => {
  return (
    <Link as={RLink} to={to}>
      {children}
    </Link>
  );
};

export default RouterLink;
