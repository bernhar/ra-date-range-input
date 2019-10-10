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
    this.setDefaults("startName", "Start");
    this.setDefaults("startDateId", "startDateId");
    this.setDefaults("endName", "End");
    this.setDefaults("endDateId", "endDateId");
    this.setDefaults("incName", "Inclusive");
    this.setDefaults("startDatePlaceholderText", `${this["startName"]} date`);
    this.setDefaults("endDatePlaceholderText", `${this["endName"]} date`);
    this.setDefaults("dateFormat", "MM/DD/YYYY");
  }
  setDefaults = (name, valDefault) => {
    this[name] = (this.props[name] && isString(this.props[name])) || valDefault;
  };
  setNewDateValues = (v, idx) => {
    this.props.record.timePeriod[idx].value = !v
      ? null
      : moment(v).format(this.dateFormat);
  };
  setExportDateValues = idx => {
    return !this.props.record.timePeriod[idx].value
      ? null
      : moment(this.props.record.timePeriod[idx].value);
  };
  handleChanges = param => {
    this.setNewDateValues(param.a, "start");
    this.setNewDateValues(param.b, "end");
  };
  render() {
    return (
      <Fragment>
        {/* style needed for the calendar height */}
        <div style={{ marginBottom: 350 }}>
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
