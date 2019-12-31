import React from "react";
import { Contact } from "models/contact.models";
import { FrenTwoColumnDetails } from "./two-column-details.component";

interface Props {
  model: Contact
  children?: any;
  leftWidth?: number;
}

/** Renders `contact` prop with left alignment as a two column data table.
 * Any children passed in will be rendered to the top right.
 * Uses capitalized model keys as names, so you should pass in display 
 * friendly names as well as formatted values, as those are not doctored either. */
export function FrenTwoColumnContact({
  model,
  children,
  leftWidth
}: Props): JSX.Element | null {

  if (!model) return null;
  return (
    <div>
        {model.name !== undefined && (<FrenTwoColumnDetails leftWidth={leftWidth} model={[ {name: 'Name', value: model.name || '' }]}/>)}
        <FrenTwoColumnDetails leftWidth={leftWidth} model={[ {name: 'Email', value: model.email || '' }]}/>
        <FrenTwoColumnDetails leftWidth={leftWidth}model={[ {name: 'Phone', value: model.phone || '' }]}/>
        <FrenTwoColumnDetails leftWidth={leftWidth}model={[ {name: 'Address', value: (model.address && model.address.line1) ? model.address.line1 : '' }]}/>
        {
          model.address !== undefined && 
          model.address.line2 !== undefined && 
          model.address.line2.length > 0 &&
          (<FrenTwoColumnDetails leftWidth={leftWidth}model={[ {name: '', value: (model.address && model.address.line2) ? model.address.line2 : '' }]}/>)
        }
        {
          model.address !== undefined && model.address.line1 !== undefined && 
          (<FrenTwoColumnDetails leftWidth={leftWidth}model={[ {name: '', value: (model.address.city || '') + ", " + (model.address.state||'') + "  " + (model.address.zip||'') }]}/>)
        }
    </div>
  );
}
