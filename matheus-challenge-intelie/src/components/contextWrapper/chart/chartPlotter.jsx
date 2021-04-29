import React, { Component } from "react";
import Chart from "react-google-charts";

class ChartPlotter extends Component {
  //to have acess to the array of sequence objects, we just need to reference => this.props.treatedSequences
  getData() {
    const sequences = this.props.treatedSequences;
    const labels = this.props.labels;
    let dataset = [labels];
    let indexer = { index: 1 };
    for (let i = 0; i < sequences.length; i++) {
      const sequence = sequences[i];
      const begin = sequence.span.begin;
      const end = sequence.span.end;
      const sequenceTimestamps = Object.keys(sequence.data);
      for (let s = 0; s < sequenceTimestamps.length; s++) {
        const data = sequence.data[sequenceTimestamps[s]];
        const timestamp = data[0];
        data[0] = this.dateFormat(data[0]);
        if (timestamp <= end && timestamp >= begin) {
          if (!dataset[indexer[timestamp]]) {
            indexer[timestamp] = indexer["index"];
            dataset[indexer["index"]] = [
              ...data,
              ...new Array(labels.length - data.length),
            ];
            indexer.index++;
          } else {
            dataset[indexer[timestamp]].map((value, index) => {
              if (!value) {
                if (data[index]) return data[index];
                return 0;
              }
              return value;
            });
          }
        }
      }
    }
    return dataset;
  }

  dateFormat(timestamp) {
    const data = new Date(timestamp);
    const date = data.getUTCDate().toString().padStart(2, "0");
    const month = data.getUTCMonth().toString().padStart(2, "0");
    const year = data.getUTCFullYear().toString();
    const hours = data.getUTCHours().toString().padStart(2, "0");
    const minutes = data.getUTCMinutes().toString().padStart(2, "0");
    const seconds = data.getUTCSeconds().toString().padStart(2, "0");
    return `${date}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  }
  render() {
    return (
      <div className="chartDiv">
        <Chart
          width={"100vw"}
          height={"28vh"}
          chartType="Line"
          loader={<div>Loading Chart</div>}
          data={this.getData()}
          options={{
            chartArea: { left: 10, top: 20, right: 10, bottom: 10 },
            hAxis: {
              title: "Time Stamp",
            },
            is3D: true,
          }}
          rootProps={{ "data-testid": "2" }}
        />
      </div>
    );
  }
}

// let temp = [];
// for (let i = 0; i < labels.length; i++) {
//   const label = labels[i];
//   let obj;
//   if (i === 0) obj = { label: label, type: "dateTime" };
//   else obj = { label: labels, type: "number" };
//   temp.push(obj);
// }
export default ChartPlotter;
