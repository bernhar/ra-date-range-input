import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { addField, FieldTitle } from "ra-core";
import {
  ArrayInput,
  SimpleFormIterator,
  DateInput,
  BooleanInput
} from "react-admin";
import { Field } from "redux-form";
/*
export default val => {
  return (
    <Fragment>
      <DateInput source="val.record.timePeriod.start.value" label="From" />
      <BooleanInput
        source="val.record.timePeriod.start.inclusive"
        label="Inclusive?"
      />
      <DateInput source="val.record.timePeriod.end.value" label="To" />
      <BooleanInput
        source="val.record.timePeriod.end.inclusive"
        label="Inclusive?"
      />
    </Fragment>
  );
};
*/
const isValidRange = (dateA, dateB) => {
  return dateA && dateB;
};

//To calculate the no. of days between two dates
export const getDateDiff = (dateA, dateB) => {
  if (!isValidRange(dateA, dateB)) return "-";
  const date1 = new Date(dateA);
  const date2 = new Date(dateB);
  return Math.ceil(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));
};

const getLiteralDateAndInclusive = (str, reg) => {
  return !reg.value
    ? ""
    : `${str} ${reg.value} (${reg.inclusive ? "" : "not "}inclusive) `;
};

const getLiteralDiffInDays = reg => {
  return !isValidRange(reg.start.value, reg.end.value)
    ? ""
    : `Total days: ${getDateDiff(reg.start.value, reg.end.value)}`;
};

export const DateRangeField = val => {
  let strResult = "";
  strResult += getLiteralDateAndInclusive(
    "Starting",
    val.record.timePeriod.start
  );
  strResult += getLiteralDateAndInclusive("Until", val.record.timePeriod.end);
  strResult += getLiteralDiffInDays(val.record.timePeriod);
  return strResult || "-";
};

const DateRangeInput = record => (
  <Fragment>
    <span>
      <DateInput label="Starting" source="timePeriod.start.value" />
      <BooleanInput label="Inclusive?" source="timePeriod.start.inclusive" />
      <DateInput label="Until" source="timePeriod.end.value" />
      <BooleanInput label="Inclusive?" source="timePeriod.end.inclusive" />
    </span>
  </Fragment>
);
export default DateRangeInput;
/*
export class DateRangeInputTeste extends Component {
  onChange = event => {
    this.props.input.onChange(event.target.value);
  };

  render() {
    const {
      className,
      meta,
      input,
      isRequired,
      label,
      options,
      source,
      resource,
      ...rest
    } = this.props;
    if (typeof meta === "undefined") {
      throw new Error(
        "The DateRangeInput component wasn't called within a redux-form <Field>. Did you decorate it and forget to add the addField prop to your component? See https://marmelab.com/react-admin/Inputs.html#writing-your-own-input-component for details."
      );
    }
    const { touched, error } = meta;
    const value = sanitizeValue(input.value);

    return (
      <TextField
        {...input}
        className={className}
        type="date"
        margin="normal"
        id={`${resource}_${source}_date_input`}
        error={!!(touched && error)}
        helperText={touched && error}
        label={
          <FieldTitle
            label={label}
            source={source}
            resource={resource}
            isRequired={isRequired}
          />
        }
        InputLabelProps={{
          shrink: true
        }}
        {...options}
        {...sanitizeRestProps(rest)}
        value={value}
        onChange={this.onChange}
      />
    );
  }
}

DateRangeInput.propTypes = {
  classes: PropTypes.object,
  className: PropTypes.string,
  input: PropTypes.object,
  isRequired: PropTypes.bool,
  label: PropTypes.string,
  meta: PropTypes.object,
  options: PropTypes.object,
  resource: PropTypes.string,
  source: PropTypes.string
};

DateRangeInput.defaultProps = {
  options: {}
};
*/
