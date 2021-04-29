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
  render() {
    return (
      <div className="chartDiv">
        <Chart
          width={"100vw"}
          height={"400px"}
          chartType="Line"
          loader={<div>Loading Chart</div>}
          data={this.getData()}
          options={{
            hAxis: {
              title: "Time Stamp",
            },
          }}
          rootProps={{ "data-testid": "2" }}
        />
      </div>
    );
  }
}

export default ChartPlotter;
