import React, { useEffect, useState } from "react";
import { CircularProgress, TableCell, TableRow } from "@material-ui/core";
import { variables } from "styles/common.styles";

export const FrenTableLoader = (props: {
  children?: any, 
  loading?:boolean, 
  useStale?:boolean;
  wait?: number;
  colSpan?: number;
  }) => {

  const [waited, setWaited] = useState(false);

  useEffect(() => {
    if(props.loading) {
      setWaited(false);
      const timer = setTimeout(() => {setWaited(true)}, props.wait || variables.loader.wait);
      return () => {
        clearTimeout(timer);
      }
    }
  }, [props.wait, props.loading]);

  return (
    <>
      {props.loading && waited && (
        <TableRow>
          <TableCell colSpan={props.colSpan} style={{height: '60px'}}>
            <div style={{ position: "relative", width: "100%", height: '60px' }}>
              <CircularProgress
                style={{ position: "absolute", left: "50%", top:"10px", margin:0}}
              />
            </div>
          </TableCell>
        </TableRow>
      )}
      {(!props.loading || (props.useStale && !waited)) && props.children && (
        <>
          {props.children}
        </>
      )}
    </>
  );
};
