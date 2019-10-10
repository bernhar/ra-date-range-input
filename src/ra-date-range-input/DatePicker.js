import React, { Component } from "react";
import { DateRangePicker } from "react-dates";
import moment from "moment";

export default class DateRangeSelector extends Component {
  state = {
    startDate: this.props.startDate,
    endDate: this.props.endDate,
    focusedInput: null
  };

  handleDateChange = ({ startDate, endDate }) => {
    // @TODO find a better way to notice the update. Only way so far is through the pseudo private property
    const newDates = {
      a: startDate ? moment(startDate._d) : null,
      b: endDate ? moment(endDate._d) : null
    };
    this.setState({ startDate, endDate });
    this.props.onRangeModified(newDates);
  };

  handleFocusChange = focusedInput => this.setState({ focusedInput });

  isOutsideRange = () => false;

  render = () => {
    return (
      <DateRangePicker
        endDate={this.state.endDate}
        endDateId={this.props.endDateId}
        focusedInput={this.state.focusedInput}
        isOutsideRange={this.isOutsideRange}
        onDatesChange={this.handleDateChange}
        onFocusChange={this.handleFocusChange}
        startDate={this.state.startDate}
        startDateId={this.props.startDateId}
      />
    );
  };
}
