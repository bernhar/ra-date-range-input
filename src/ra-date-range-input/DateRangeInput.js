import React, { Component, Fragment } from "react";
import { BooleanInput } from "react-admin";
import { DateRangePicker } from "react-dates";
import moment from "moment";

const isString = s => typeof s === "string" || s instanceof String;

export const getDateDiff = obj => {
  return !(obj.start.value && obj.end.value)
    ? "-"
    : moment(obj.end.value).diff(moment(obj.start.value), "days");
};

class DateRangeInput extends Component {
  state = {
    startDate: this.props.startDate,
    endDate: this.props.endDate,
    focusedInput: null
  };

  constructor(props) {
    super(props);

    for (let [key, value] of Object.entries(this.defaultParams())) {
      this.setDefaults(key, value);
    }

    this.styleFix = { marginBottom: 350 };
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
  };

  handleDateChange = ({ startDate, endDate }) => {
    // @TODO find a better way to notice the update. Only way so far is through the pseudo private property _d
    this.setNewDateValues(startDate ? moment(startDate._d) : null, "start");
    this.setNewDateValues(endDate ? moment(endDate._d) : null, "end");
    this.setState({ startDate, endDate });
  };

  handleFocusChange = focusedInput => this.setState({ focusedInput });

  isOutsideRange = () => false;

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

  // startDatePlaceholderText={this.startDatePlaceholderText}
  // endDatePlaceholderText={this.endDatePlaceholderText}

  render() {
    return (
      <Fragment>
        {/* style needed for the calendar height */}
        <div style={this.styleFix}>
          <h3>{this.strLabel}</h3>
          {this.getBoolFieldsOrNot()}
          <DateRangePicker
            endDate={this.setExportDateValues("end")}
            endDateId={this.endDateId}
            focusedInput={this.state.focusedInput}
            isOutsideRange={this.isOutsideRange}
            onDatesChange={this.handleDateChange}
            onFocusChange={this.handleFocusChange}
            startDate={this.setExportDateValues("start")}
            startDateId={this.startDateId}
          />
        </div>
      </Fragment>
    );
  }
}

export default DateRangeInput;
