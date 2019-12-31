import React from "react";
import { FrenFullContainer as Row } from "components/shared/containers";
import { FrenInput } from "components/shared/forms";
import { SelectListItem } from "components/shared/forms/helpers";
import { Broker, Advisor } from "models";
import { FrenValidator } from "common/validator";
import { FrenPercentInput } from "components/shared/forms/percent-input.component";
import { FrenTrashButton } from "components/shared/buttons/remove-button.component";
import { FrenAutocomplete } from "components/shared/forms/autocomplete.component";

interface Props {
  i: number;
  advisorOptions: Advisor[];
  broker: Broker;
  advisor: Advisor;
  validator: FrenValidator;
  submit: () => void;
  updateAdvisors: Function;
  removeAdvisor: Function;
}

export const EditAdvisor = ({
  i,
  advisor,
  advisorOptions,
  broker,
  submit,
  validator,
  updateAdvisors,
  removeAdvisor
}: Props) => {
  advisorOptions = Array.isArray(advisorOptions) ? advisorOptions : [];
  return (
    <Row style={{ position: "relative" }}>
      <FrenAutocomplete
        key={`advisor-${i}-name`}
        name="id"
        labelText="Advisor"
        list={advisorOptions.map(
          x =>
            ({
              isSelected: advisor.id === x.id,
              text: x.name,
              value: x.id
            } as SelectListItem)
        )}
        onChange={(name: keyof Broker, value: any) =>
          updateAdvisors(name, value, i)
        }
        submit={submit}
        validate="required"
        style={{ width: "40%", paddingLeft: "2rem" }}
        validator={validator}
        value={advisor.id}
      />
      <FrenInput
        key={`advisor-${i}-ext-id`}
        name="externalId"
        labelText="Advisor ID"
        value={advisor.externalId}
        onChange={(name: keyof Advisor, value: any) => {
          updateAdvisors(name, value, i);
        }}
        submit={submit}
        style={{ width: "20%" }}
      />
      <FrenInput
        key={`advisor-${i}-bps`}
        name="bps"
        type="number"
        labelText="BPS"
        value={((broker.bps || 0) * (advisor.percentage || 0)) / 100}
        onChange={(name: keyof Advisor, value: any) => {
          name = "percentage";
          value = (value / (broker.bps || 0)) * 100;
          updateAdvisors(name, +value, i);
        }}
        submit={submit}
        validator={validator}
        disabled={true}
        validate={`numeric|max:${broker.bps ? broker.bps : 0},num`}
        style={{ width: "20%" }}
      />
      <FrenPercentInput
        key={`advisor-${i}-percent`}
        name="percentage"
        labelText="Percent"
        type="number"
        value={advisor.percentage}
        onChange={(name: keyof Advisor, value: any) =>
          updateAdvisors(name, +value, i)
        }
        submit={submit}
        validator={validator}
        validate="required|numeric|max:100,num"
        style={{ width: "20%" }}
      />
      <div
        style={{
          position: "absolute",
          right: "-3rem",
          padding: "0rem",
          top: "0.5rem"
        }}
      >
        <FrenTrashButton
          clickHandler={(e: any) => {
            removeAdvisor(i);
          }}
        />
      </div>
    </Row>
  );
};
