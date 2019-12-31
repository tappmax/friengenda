import React from "react";
import { FrenFullContainer as Row } from "components/shared/containers";
import { FrenInput } from "components/shared/forms";
import { SelectListItem } from "components/shared/forms/helpers";
import { Broker, Plan, Advisor } from "models";
import { FrenValidator } from "common/validator";
import { listHasItems } from "helpers/common.helpers";
import { EditAdvisor } from "./edit-advisor.component";
import { FrenAddButton } from "components/shared/buttons";
import { FrenPercentInput } from "components/shared/forms/percent-input.component";
import { FrenTrashButton } from "components/shared/buttons/remove-button.component";
import { FrenAutocomplete } from "components/shared/forms/autocomplete.component";

interface Props {
  i: number;
  brokerOptions: Broker[];
  advisorOptions: Advisor[];
  broker: Broker;
  plan: Plan;
  validator: FrenValidator;
  submit: () => void;
  updateBrokers: Function;
  updateAdvisors: Function;
  removeBroker: Function;
  removeAdvisor: Function;
  addAdvisor: Function;
}

export const EditBroker = ({
  i,
  brokerOptions,
  advisorOptions,
  broker,
  plan,
  submit,
  validator,
  updateBrokers,
  updateAdvisors,
  removeBroker,
  removeAdvisor,
  addAdvisor
}: Props) => {
  brokerOptions = Array.isArray(brokerOptions) ? brokerOptions : [];
  return (
    <>
      <Row style={{ position: "relative" }}>
        <FrenAutocomplete
          key={`plan-broker-${i}-name`}
          name="id"
          labelText="Broker"
          list={brokerOptions.map(
            x =>
              ({
                text: x.name,
                value: x.id
              } as SelectListItem)
          )}
          onChange={(name: keyof Broker, value: any) => {
            updateBrokers(name, value, i);
          }}
          submit={submit}
          validate="required|integer|min:1,num"
          validator={validator}
          style={{ width: "60%" }}
          value={plan.brokers![i].id}
        />
        <FrenInput
          key={`plan-broker-${i}-bps`}
          name="bps"
          labelText="BPS"
          value={plan.brokers![i].bps}
          onChange={(name: keyof Broker, value: any) =>
            updateBrokers(name, value, i)
          }
          submit={submit}
          validator={validator}
          type="number"
          validate="required|numeric|min:0,num"
          style={{ width: "20%" }}
        />
        <FrenPercentInput
          key={`plan-broker-${i}-percent`}
          name="percent"
          labelText="Percent"
          value={plan
            .brokers![i].advisors!.map(a => a.percentage || 0)
            .reduce((a, sum) => (sum += +a), 0)}
          onChange={(name: keyof Broker, value: any) =>
            updateBrokers(name, value, i)
          }
          submit={submit}
          validator={validator}
          disabled={true}
          validate="numeric|exactly:100,num"
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
              removeBroker(i);
            }}
          />
        </div>
      </Row>
      {listHasItems(broker.advisors) &&
        broker.advisors!.map((advisor: Advisor, idx: number) => (
          <EditAdvisor
            key={`broker-advisor-${i}-${idx}`}
            broker={broker}
            advisorOptions={advisorOptions}
            i={idx}
            advisor={advisor}
            submit={submit}
            updateAdvisors={(
              key: keyof Advisor,
              value: any,
              advisorIndex: number
              ) => updateAdvisors(key, value, advisorIndex, i)}
              removeAdvisor={(advisorIndex: number) =>
                removeAdvisor(i, advisorIndex)
              }
              validator={validator}
          />
        ))}
      <FrenAddButton
        clickHandler={(e: any) => {
          e.preventDefault();
          addAdvisor(i);
        }}
      >
        Add advisor
      </FrenAddButton>
    </>
  );
};
