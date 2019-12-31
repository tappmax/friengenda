import * as React from "react";
import { Link } from "react-router-dom";
import { Paper } from "@material-ui/core";
import { appStaticStyles } from "styles/app.styles";

export const FrenNotFound = () => (
  <>
    <Paper style={appStaticStyles.contentSection}>
      <h1>Sorry! That Page Doesn't Exist!</h1>
      <p>
        going back to the portal home page, or use the navigation at the left of
        the page to select a section to visit.
      </p>
      <Link to="/">Go Back Home</Link>
    </Paper>
  </>
);
