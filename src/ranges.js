import React from "react";
import {
  List,
  Show,
  Create,
  Edit,
  Datagrid,
  DateField,
  TextField,
  BooleanField,
  FunctionField,
  SimpleForm,
  SimpleShowLayout
} from "react-admin";
import DateRangeInput, {
  getDateDiff
} from "./ra-date-range-input/DateRangeInput";
import DateRangeField from "./ra-date-range-field/DateRangeField";

/**
 * Standard record for creation of new dange dates. Mustn't have the ID key.
 */
const recordDefault = {
  timePeriod: {
    start: {
      value: null,
      inclusive: true
    },
    end: {
      value: null,
      inclusive: false
    }
  }
};

const objConfigDateRange = {
  source: "timePeriod",
  strStart: "Starting",
  strEnd: "Until",
  strInc: "Inclusive",
  strDays: "Nro. Days",
  emptyVal: "(empty)",
  isLiteralInfo: true,
  showDaysDiff: true
};

export const RangeList = props => (
  <List {...props} title="Date Ranges">
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <DateRangeField {...objConfigDateRange} />
      <DateField
        source="timePeriod.start.value"
        label="Starting on"
        textAlign="right"
      />
      <BooleanField
        source="timePeriod.start.inclusive"
        label="Inclusive?"
        textAlign="right"
        sortable={false}
      />
      <DateField
        source="timePeriod.end.value"
        label="Ending on"
        textAlign="right"
      />
      <BooleanField
        source="timePeriod.end.inclusive"
        label="Inclusive?"
        textAlign="right"
        sortable={false}
      />
      <FunctionField
        label="N. of Days"
        textAlign="right"
        render={record => getDateDiff(record.timePeriod)}
      />
    </Datagrid>
  </List>
);

export const RangeShow = props => (
  <Show title={<RangeTitle />} {...props}>
    <SimpleShowLayout>
      <TextField source="id" />
      <DateRangeField
        source="timePeriod"
        strStart="Starting"
        strEnd="Until"
        strInc="Inclusive"
        strDays="Nro. Days"
        emptyVal="(empty)"
        isLiteralInfo="true"
        showDaysDiff="true"
      />
    </SimpleShowLayout>
  </Show>
);

const RangeTitle = ({ record }) => {
  return (
    <span>
      {record && record["id"] ? `Range ID: "${record.id}"` : "New range"}
    </span>
  );
};

export const RangeCreate = props => (
  <Create title={<RangeTitle />} {...props} record={recordDefault}>
    <SimpleForm redirect="list">
      <DateRangeInput strLabel="New range" />
    </SimpleForm>
  </Create>
);

export const RangeEdit = props => (
  <Edit title={<RangeTitle />} {...props}>
    <SimpleForm>
      <DateRangeInput source="timePeriod" strLabel="Range info" />
    </SimpleForm>
  </Edit>
);
