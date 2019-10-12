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
    startDate: this.props.record.timePeriod.start.value,
    endDate: this.props.record.timePeriod.end.value,
    focusedInput: null,
    ...this.props.record
  };

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

  styleFix = { marginBottom: 350 };

  constructor(props) {
    super(props);

    for (let [key, value] of Object.entries(this.defaultParams())) {
      this.setDefaults(key, value);
    }

    // console.log("INIT state", this.state);
  }

  setDefaults = (name, valDefault) => {
    this[name] =
      this.props[name] && isString(this.props[name])
        ? this.props[name]
        : valDefault;
  };

  handleChanges = e => {
    // console.log(e);
    const tmpState = this.state.timePeriod;
    if (e.target && e.target.type === "checkbox") {
      const { checked, name } = e.target;
      if (name === "end") {
        tmpState.end.inclusive = !!checked;
      } else {
        tmpState.start.inclusive = !!checked;
      }
      this.setState(
        { timePeriod: tmpState } //, a => console.log("afterUpdate CKB - Donde!", this.state)
      );
    } else {
      // @TODO find a better way to notice the update. Only way so far is through the pseudo private property _d
      tmpState.start.value = e.startDate
        ? moment(e.startDate._d).format("YYYY-MM-DD")
        : null;
      tmpState.end.value = e.endDate
        ? moment(e.endDate._d).format("YYYY-MM-DD")
        : null;
      this.setState(
        {
          startDate: moment(tmpState.start.value),
          endDate: moment(tmpState.end.value),
          timePeriod: tmpState
        } //, a => console.log("afterUpdate DATES", this.state)
      );
    }
  };

  handleFocusChange = focusedInput => {
    // console.log("focusedInput", focusedInput);
    this.setState(
      { focusedInput } // , a => console.log("afterUpdate focusedInput", this.state)
    );
  };

  isOutsideRange = () => false;

  getBoolFieldsOrNot = () => {
    if (!this.hideInclusiveFields) {
      return (
        <span>
          <BooleanInput
            label={`${this.startName} ${this.incName}?`}
            source="start"
            onChange={this.handleChanges}
            defaultValue={this.props.record.timePeriod.start.inclusive}
          />
          <BooleanInput
            label={`${this.endName} ${this.incName}?`}
            source="end"
            onChange={this.handleChanges}
            defaultValue={this.props.record.timePeriod.end.inclusive}
          />
        </span>
      );
    }
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
  compileParamsForCalendarComponent = () => ({
    startDate: this.setExportDateValues("start"),
    endDate: this.setExportDateValues("end"),
    startDateId: this.startDateId,
    endDateId: this.endDateId,
    focusedInput: this.state.focusedInput,
    isOutsideRange: this.isOutsideRange,
    onDatesChange: this.handleChanges,
    onFocusChange: this.handleFocusChange
  });

  render() {
    return (
      <Fragment>
        {/* style needed for the calendar height */}
        <div style={this.styleFix}>
          <h3>{this.strLabel}</h3>
          {this.getBoolFieldsOrNot()}
          <DateRangePicker {...this.compileParamsForCalendarComponent()} />
        </div>
      </Fragment>
    );
  }
}

export default DateRangeInput;
