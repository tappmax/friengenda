import React from "react";
import { variables } from "styles/common.styles"

export const FrenTablePlaceholder = ({placeholder} : {placeholder: any}) => {
  return (
    <>
      <div style={{fontStyle:'italic', textAlign:'center', borderTop:`solid 7px ${variables.brandColors.frenPrimary}`}}>
        <div style={{margin:'4rem'}}>
          {placeholder}
        </div>
      </div>
    </>
  )
}