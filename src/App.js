import React, { useState, useEffect } from "react";
import "./App.css";
import { csv } from "d3";
import data from "./test.csv";
import BarChart from "./BarChart";
import CsvBarChart from "./CsvBarChart";

const App = () => {
  const [csvData, setCsvData] = useState([]);
  const [compTypeId, setCompTypeId] = useState([]);

  // grabbing data from csv file and assigning to local state
  useEffect(() => {
    csv(data).then(setCsvData).then(console.log("csvData", csvData));
  }, []);

  // grabbing the ComponentTypeId from each item and making another array with just those id's. this will be used for putting some data into D3.
  useEffect(() => {
    let newArray = [...csvData];
    let idArray = [];

    newArray.map((entry) => {
      idArray.push(entry.ComponentTypeId);
    });

    setCompTypeId(idArray);
  }, [csvData]);

  console.log("compTypeId", compTypeId);

  return (
    <React.Fragment>
      <h2>Testing data from exported SprintRay CSV file</h2>
      <h4 style={{ marginBottom: "2rem" }}>
        (ComponentTypeId from Attribute Table in database)
      </h4>
      {/* <GeoChart data={data} property={property} /> */}
      {/* <BarChart data={csvData} /> */}
      <CsvBarChart data={compTypeId} />
      {/* {compTypeId.map((entry, i) => (
        <h4 key={i}>{entry}</h4>
      ))} */}
    </React.Fragment>
  );
};

export default App;
