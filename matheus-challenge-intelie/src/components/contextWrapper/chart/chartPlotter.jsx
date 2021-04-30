import React, { Component } from "react";
import Chart from "react-google-charts";

class ChartPlotter extends Component {
  //to have acess to the array of sequence objects, we just need to reference => this.props.treatedSequences
  getData() {
    const sequences = this.props.treatedSequences;
    const labels = this.props.labels;
    let dataset = [labels]; // dataset that is and array of arrays, wich will be used to plot the chart as specified in google charts documentation
    let indexer = { index: 1 }; //reference the list index of the list with timestamps as idex, so we can add multiple data with the same timestamp in the same array.
    for (let i = 0; i < sequences.length; i++) {
      const sequence = sequences[i];
      const begin = sequence.span.begin;
      const end = sequence.span.end;
      const sequenceTimestamps = Object.keys(sequence.data);
      for (let s = 0; s < sequenceTimestamps.length; s++) {
        // for that uses the keys reference inside the sequenceTimestamps array to acess the object properties, and by doing that acess the array inside of it.
        const data = sequence.data[sequenceTimestamps[s]];
        const timestamp = data[0];
        data[0] = this.dateFormat(data[0]); //formatting the timestamp inside the array to make it look like a date(dd/MM/yyyy HH:mm:ss)
        if (timestamp <= end && timestamp >= begin) {
          //comparing if the timestamp of the data is inside the span range, and if it is, placing it into the dataset
          if (!dataset[indexer[timestamp]]) {
            //if the position of the indexer doesn't exists, it'll make a new array with the data iside the sequence.data and push into the indexer position in the array
            indexer[timestamp] = indexer["index"];
            dataset[indexer["index"]] = [
              ...data,
              ...new Array(labels.length - data.length),
            ];
            indexer.index++;
          } else {
            //if the position is not empty, push into the dastaset[indexer]
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
          chartType="LineChart"
          width={"99.6%"}
          height={"44.6vh"}
          loader={<div>Loading Chart</div>}
          data={this.getData()}
          options={{
            width: "100%",
            height: "100%",
            hAxis: {
              title: "Time Stamp",
            },
            pointSize: "5",
          }}
          rootProps={{ "data-testid": "1" }}
        />
      </div>
    );
  }
}
export default ChartPlotter;
