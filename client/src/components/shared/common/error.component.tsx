import * as React from "react";
import { Paper, IconButton } from "@material-ui/core";
import { variables } from "styles/common.styles";
import CloseIcon from "@material-ui/icons/Close";

interface Props {
  error: string;
  style?: any;  
}

export const FrenPageError = ({ error, style }: Props) => {
  return (
    <div>
      <h2>Uh-oh!</h2>
      <p>
        There was an error loading data from the server:
        <br />
        <br />
        <code>{error}</code>
        <br />
      </p>
      <p
        style={{
          cursor: "pointer",
          textAlign: "left",
          textDecoration: "underline",
          ...style
        }}
        onClick={() => window.location.reload()}
      >
        Click here to try again
      </p>
    </div>
  );
};

export const FrenErrorPanel = ({ error, style, allowClose }: {error:any, style?:any, allowClose?:boolean}) => {
  const [display, setDisplay] = React.useState(!!error);
  // TODO: get component to display again if a new error comes in (or the same error)
  return (
    <Paper
      style={{
        display: display ? "flex" : "none",
        justifyContent: "space-between",
        backgroundColor: variables.alphaColors.mdRed50,
        padding: "0.25rem 1rem",
        margin: "0.5rem",
        ...style
      }}
    >
      <span style={{ color: variables.solidColors.dkRed, padding: '1rem' }}>
        {error}
      </span>
      {(allowClose === undefined || allowClose === true) && (
        <IconButton
          aria-label="close"
          edge="end"
          color="inherit"
          onClick={(e: any) => {
            setDisplay(false);
          }}
        >
          <CloseIcon />
        </IconButton>
      )}
    </Paper>
  );
};
