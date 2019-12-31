import React, { useEffect, useState } from "react";
import { CircularProgress } from "@material-ui/core";

export const FrenPaperLoader = (props: {
  children?: any, 
  loading?:boolean, 
  useStale?:boolean;
  wait?: number,
  height?: number
  }) => {

  const [waited, setWaited] = useState(false);

  useEffect(() => {
    if(props.loading) {
      setWaited(false);
      const timer = setTimeout(() => {setWaited(true)}, props.wait);
      return () => {
        clearTimeout(timer);
      }
    }
  }, [props.wait, props.loading]);

  return (
    <>
      {props.loading && (waited || !props.wait) && (
        <div style={{ position: "relative", width: "100%", height: props.height || '100%' }}>
          <CircularProgress
            style={{ position: "absolute", left: "50%", top:"50%", margin:0}}
          />
        </div>
      )}
      {(!props.loading || (props.useStale && !waited)) && props.children && (
        <>
          {props.children}
        </>
      )}
    </>
  );
};
