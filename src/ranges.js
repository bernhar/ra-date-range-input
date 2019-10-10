import React from "react";
import {
  List,
  Datagrid,
  DateField,
  TextField,
  BooleanField,
  FunctionField,
  Create,
  Edit,
  SimpleForm
} from "react-admin";
import DateRangeInput, {
  getDateDiff
} from "./ra-date-range-input/DateRangeInput";
import DateRangeField from "./ra-date-range-field/DateRangeField";

export const RangeList = props => (
  <List {...props} title="Date Ranges">
    <Datagrid rowClick="edit">
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

export const RangeCreate = props => (
  <Create {...props}>
    <SimpleForm>
      <DateRangeInput source="timePeriod" />
    </SimpleForm>
  </Create>
);

const RangeTitle = ({ record }) => {
  return <span>Range ID: {record ? `"${record.id}"` : ""}</span>;
};

export const RangeEdit = props => (
  <Edit title={<RangeTitle />} {...props}>
    <SimpleForm>
      <DateRangeInput source="timePeriod" />
    </SimpleForm>
  </Edit>
);
