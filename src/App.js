import React from "react";
import { Admin, Resource } from "react-admin";
import fakeDataProvider from "ra-data-fakerest";
import jsonServerProvider from "ra-data-json-server";
import { RangeList, RangeCreate, RangeEdit } from "./ranges";
import { Data4Test } from "./data/Data4Test";

// const dataProvider = jsonServerProvider(
//   "https://my-json-server.typicode.com/msand/demo"
// );
const dataProvider = fakeDataProvider(Data4Test, true);

const App = () => (
  <Admin dataProvider={dataProvider}>
    <Resource
      name="nodes"
      list={RangeList}
      create={RangeCreate}
      edit={RangeEdit}
    />
  </Admin>
);

export default App;
