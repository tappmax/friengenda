import React from "react";
import {
  FrenFullContainer as Row,
  FrenHalfContainer as Col50
} from "components/shared/containers";
import { FrenInput } from "components/shared/forms";
import { Address } from "models";
import { FrenValidator } from "common/validator";

interface Props {
  address: Address;
  validator: FrenValidator;
  submit: () => void;
  updateAddress: (key: keyof Address, value: any) => void;
}

export const EditAddress = ({
  address,
  validator,
  submit,
  updateAddress
}: Props) => {
  return (
    <div>
      <FrenInput
        labelText="Address"
        value={address.line1 || ""}
        name="line1"
        onChange={updateAddress}
        submit={submit}
        style={{ width: "100%" }}
      />
      <FrenInput
        labelText="Address 2"
        value={address.line2 || ""}
        name="line2"
        onChange={updateAddress}
        submit={submit}
        style={{ width: "100%" }}
      />
      <Row>
        <Col50>
          <FrenInput
            labelText="City"
            value={address.city || ""}
            name="city"
            onChange={updateAddress}
            submit={submit}
            style={{ width: "100%" }}
          />
        </Col50>
        <Col50>
          <div style={{ width: "100%", display: "flex" }}>
            <div style={{ width: "30%" }}>
              <FrenInput
                labelText="State"
                validator={validator}
                validate="exactly:2"
                value={address.state || ""}
                name="state"
                onChange={(k: any, b: any) => {
                  updateAddress(k, b.toUpperCase());
                }}
                submit={submit}
                style={{ width: "100%" }}
              />
            </div>
            <div style={{ width: "70%" }}>
              <FrenInput
                labelText="Zip"
                value={address.zip || ""}
                validator={validator}
                validate="zip"
                name="zip"
                onChange={updateAddress}
                submit={submit}
                style={{ width: "100%" }}
              />
            </div>
          </div>
        </Col50>
      </Row>
    </div>
  );
};
