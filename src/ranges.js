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
  DateRangeField,
  getDateDiff
} from "./component/DateRangeInput";

export const RangeList = props => (
  <List {...props} title="Date Ranges">
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <DateRangeField source="timePeriod" />
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
        render={record =>
          getDateDiff(
            record.timePeriod.start.value,
            record.timePeriod.end.value
          )
        }
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
