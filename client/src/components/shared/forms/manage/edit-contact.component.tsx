import React from "react";
import {
  FrenFullContainer as Row,
  FrenHalfContainer as Col50
} from "components/shared/containers";
import { FrenInput } from "components/shared/forms";
import { SelectListItem } from "components/shared/forms/helpers";
import { Contact, Address } from "models";
import { FrenValidator } from "common/validator";
import { EditAddress } from "./edit-address.component";
import { FrenTrashButton } from "components/shared/buttons/remove-button.component";
import { FrenMaskableNumberInput } from "../masked-input.component";
import { FrenSelectList } from "../select-list.component";
import { listHasItems } from "helpers/common.helpers";
import { FrenTitle } from "components/shared/titles";
import { Paper } from "@material-ui/core";
import { CommonConstants } from "constants/common.constants";
import { variables } from "styles/common.styles";

interface Props {
  i: number;
  contact: Contact;
  validator: FrenValidator;
  includeName?: boolean;
  hidePaymentMethod?: boolean;
  paymentMethods?: string[];
  title?: string;
  submit: () => void;
  updateContact: (key: keyof Contact, value: any, contactIndex: number) => void;
  updateAddress: (key: keyof Address, value: any, contactIndex: number) => void;
  removeContact?: (contactIndex: number) => void;
}

export const EditContact = ({
  i,
  contact,
  submit,
  validator,
  paymentMethods,
  title,
  includeName,
  hidePaymentMethod,
  updateContact,
  updateAddress,
  removeContact
}: Props) => {
  return (
    <Paper style={{ padding: "1rem", margin: "1rem 0" }} elevation={2}>
      <Row style={{ flexDirection: "column" }}>
        <FrenTitle
          title={title ? title : "Contact information"}
          component="h5"
          style={{
            marginBottom: "0.5rem",
            alignItems: "center",
            marginTop: removeContact ? "-1rem" : 0
          }}
        >
          {removeContact && (
            <FrenTrashButton
              size="sm"
              color="primary"
              style={{
                marginRight: "-1rem",
                color: variables.solidColors.dkRed
              }}
              clickHandler={(e: any) => {
                removeContact!(i);
              }}
            />
          )}
        </FrenTitle>
        <div style={!!removeContact ? { position: "relative" } : {}}>
          {includeName && (
            <Row>
              <FrenInput
                labelText="Contact Name"
                validator={validator}
                validate="name"
                value={contact.name || ""}
                name="name"
                onChange={(key: keyof Contact, val: any) =>
                  updateContact(key, val, i)
                }
                submit={submit}
                style={{ width: "100%" }}
              />
            </Row>
          )}
          <Row>
            <FrenInput
              labelText="Email"
              validator={validator}
              validate="email"
              value={contact.email || ""}
              name="email"
              onChange={(key: keyof Contact, val: any) =>
                updateContact(key, val, i)
              }
              submit={submit}
              style={{ width: "50%" }}
            />
            <FrenMaskableNumberInput
              labelText="Phone"
              validator={validator}
              format={CommonConstants.ui.formats.phone}
              validate="phone"
              value={contact.phone || ""}
              name="phone"
              onChange={(key: keyof Contact, val: any) =>
                updateContact(key, val, i)
              }
              submit={submit}
              style={{ width: "50%" }}
            />
          </Row>
          {listHasItems(paymentMethods) && (
            <Col50 style={{display: hidePaymentMethod ? "none" : "block"}}>
              <FrenSelectList
                key={`contact-${i}-payment-methods`}
                list={(paymentMethods || []).map(
                  x =>
                    ({
                      isSelected: x === contact.paymentMethod,
                      text: x,
                      value: x
                    } as SelectListItem)
                )}
                labelText="Payment Method"
                name="paymentMethod"
                onChange={(key: keyof Contact, val: any) =>
                  updateContact(key, val, i)
                }
                submit={submit}
                value={contact.paymentMethod || ""}
              />
            </Col50>
          )}
        </div>
        <EditAddress
          address={contact.address || {}}
          submit={submit}
          updateAddress={(key: keyof Address, value: any) =>
            updateAddress(key, value, i)
          }
          validator={validator}
        />
      </Row>
    </Paper>
  );
};
