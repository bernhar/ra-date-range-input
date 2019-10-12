import React, { Component, Fragment } from "react";
import { BooleanInput } from "react-admin";
import { DateRangePicker } from "react-dates";
import moment from "moment";

const isString = s => typeof s === "string" || s instanceof String;
/**
 * Get the diference in days between the dates in a timePeriod object.
 *
 * @param {timePeriod} obj
 */
export const getDateDiff = obj => {
  return !(obj.start.value && obj.end.value)
    ? null
    : moment(obj.end.value).diff(moment(obj.start.value), "days");
};

/**
 * Generate a calendar date picker based on the react-dates component for React Admin
 *
 * @class DateRangeInput
 * @extends {Component}
 */
class DateRangeInput extends Component {
  state = {
    startDate: this.props.record.timePeriod.start.value,
    endDate: this.props.record.timePeriod.end.value,
    focusedInput: null,
    ...this.props.record
  };

  /**
   * Default params to use if not provided to the component.
   *
   * @memberof DateRangeInput
   */
  defaultParams = () => ({
    startName: "Start",
    endName: "End",
    incName: "Inclusive",
    startDateId: "startDateId",
    endDateId: "endDateId",
    dateFormat: "MM/DD/YYYY",
    hideInclusiveFields: false,
    strLabel: "Range",
    styleFix: { marginBottom: 350 },
    objConfigComponent: {}
  });

  /**
   * Params used to config the react-date component to be used
   * together with the objConfigComponent that can be provided
   * on configuration
   *
   * @memberof DateRangeInput
   */
  exportConfigComponent = () => ({
    startDate: this.setMomentIfExists("start"),
    endDate: this.setMomentIfExists("end"),
    startDateId: this.startDateId,
    endDateId: this.endDateId,
    focusedInput: this.state.focusedInput,
    isOutsideRange: this.isOutsideRange,
    onDatesChange: this.handleDateChanges,
    onFocusChange: this.handleFocusChange,
    ...this.objConfigComponent
  });

  constructor(props) {
    super(props);

    this.setDefaults(this.defaultParams(), props);
    // console.log("INIT state", this.state);
  }
  /**
   * Use a config object to populate 'this' with
   * values provided by 'props' either use values
   * from the config object itsel.
   *
   * @memberof DateRangeInput
   * @param {object} objConfig These are the properties default to use if cant find in 'props'
   * @param {object} props Look here for properties
   */
  setDefaults = (objConfig, props) => {
    for (let [name, valDefault] of Object.entries(objConfig)) {
      this[name] =
        props[name] && isString(props[name]) ? props[name] : valDefault;
    }
  };

  /**
   * Monitor the values changed through the react-dates component
   * and update the component and the state.
   *
   * @memberof DateRangeInput
   */
  handleDateChanges = e => {
    const tmpState = this.state.timePeriod;
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
  };

  /**
   * Monitor the value changes on the boolean inputs and update
   * the component and the state.
   *
   * @memberof DateRangeInput
   */
  handleBooleanFieldChanges = e => {
    const tmpState = this.state.timePeriod;
    const { checked, name } = e.target;
    if (name === "end") {
      tmpState.end.inclusive = !!checked;
    } else {
      tmpState.start.inclusive = !!checked;
    }
    this.setState(
      { timePeriod: tmpState } //, a => console.log("afterUpdate CKB - Donde!", this.state)
    );
  };

  /**
   * Help the reac-dates component to keep track of where is the focus
   *
   * @memberof DateRangeInput
   */
  handleFocusChange = focusedInput => {
    this.setState(
      { focusedInput } // , a => console.log("afterUpdate focusedInput", this.state)
    );
  };

  /**
   * @todo implement control and validation for dates outside limits
   *
   * @memberof DateRangeInput
   */
  isOutsideRange = () => false;

  /**
   * If configured, display the boolean fields related to the dates.
   * Use the 'hideInclusiveFields' config variable.
   *
   * @memberof DateRangeInput
   */
  getBoolFieldsOrNot = () => {
    if (!this.hideInclusiveFields) {
      return (
        <span>
          <BooleanInput
            label={`${this.startName} ${this.incName}?`}
            source="start"
            onChange={this.handleBooleanFieldChanges}
            defaultValue={this.props.record.timePeriod.start.inclusive}
          />
          <BooleanInput
            label={`${this.endName} ${this.incName}?`}
            source="end"
            onChange={this.handleBooleanFieldChanges}
            defaultValue={this.props.record.timePeriod.end.inclusive}
          />
        </span>
      );
    }
  };

  /**
   * Export dates (if set) as Moments for the react-date component based on the 'record'.
   *
   * @memberof DateRangeInput
   * @param {string} idx Start or End
   */
  setMomentIfExists = idx => {
    return !(
      this.props.record &&
      this.props.record.timePeriod &&
      this.props.record.timePeriod[idx] &&
      this.props.record.timePeriod[idx].value
    )
      ? null
      : moment(this.props.record.timePeriod[idx].value);
  };

  render() {
    return (
      <Fragment>
        {/* style for the calendar height fixing */}
        <div style={this.styleFix}>
          <h3>{this.strLabel}</h3>
          {this.getBoolFieldsOrNot()}
          <DateRangePicker {...this.exportConfigComponent()} />
        </div>
      </Fragment>
    );
  }
}

export default DateRangeInput;
