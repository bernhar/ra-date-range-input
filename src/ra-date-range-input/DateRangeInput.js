import React, { Component, Fragment } from "react";
import { BooleanInput } from "react-admin";
import DateRangeSelector from "./DatePicker";
import moment from "moment";

const isString = s => typeof s === "string" || s instanceof String;

export const getDateDiff = obj => {
  return !(obj.start.value && obj.end.value)
    ? "-"
    : moment(obj.end.value).diff(moment(obj.start.value), "days");
};

class DateRangeInput extends Component {
  constructor(props) {
    super(props);

    for (let [key, value] of Object.entries(this.defaultParams())) {
      this.setDefaults(key, value);
    }
  }

  defaultParams = () => ({
    startName: "Start",
    startDateId: "startDateId",
    endName: "End",
    endDateId: "endDateId",
    incName: "Inclusive",
    startDatePlaceholderText: `${this["startName"]} date`,
    endDatePlaceholderText: `${this["endName"]} date`,
    dateFormat: "MM/DD/YYYY",
    hideInclusiveFields: false,
    strLabel: "Range"
  });

  setDefaults = (name, valDefault) => {
    this[name] =
      this.props[name] && isString(this.props[name])
        ? this.props[name]
        : valDefault;
    console.log(name + " conf", this.props[name]);
    console.log(name, this[name]);
  };

  setNewDateValues = (v, idx) => {
    this.props.record.timePeriod[idx].value = !v
      ? null
      : moment(v).format(this.dateFormat);
  };
  setExportDateValues = idx => {
    return !(
      this.props.record &&
      this.props.record.timePeriod &&
      this.props.record.timePeriod[idx] &&
      this.props.record.timePeriod[idx].value
    )
      ? null
      : moment(this.props.record.timePeriod[idx].value);
  };
  handleChanges = param => {
    this.setNewDateValues(param.a, "start");
    this.setNewDateValues(param.b, "end");
  };

  getBoolFieldsOrNot = () => {
    if (!this.hideInclusiveFields) {
      return (
        <span>
          <BooleanInput
            label={`${this.startName} ${this.incName}?`}
            source="timePeriod.start.inclusive"
          />
          <BooleanInput
            label={`${this.endName} ${this.incName}?`}
            source="timePeriod.end.inclusive"
          />
        </span>
      );
    }
  };

  render() {
    return (
      <Fragment>
        {/* style needed for the calendar height */}
        <div style={{ marginBottom: 350 }}>
          <h3>{this.strLabel}</h3>
          {this.getBoolFieldsOrNot()}
          <DateRangeSelector
            startDate={this.setExportDateValues("start")}
            endDate={this.setExportDateValues("end")}
            startDatePlaceholderText={this.startDatePlaceholderText}
            endDatePlaceholderText={this.endDatePlaceholderText}
            onRangeModified={this.handleChanges}
            endDateId={this.endDateId}
            startDateId={this.startDateId}
          />
        </div>
      </Fragment>
    );
  }
}

export default DateRangeInput;
