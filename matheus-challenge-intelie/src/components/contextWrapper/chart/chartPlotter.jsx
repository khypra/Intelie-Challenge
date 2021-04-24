import Chart from "react-google-charts";
import { Component } from "react";

class ChartPlotter extends Component {
  render() {
    return (
      <Chart
        width={"600px"}
        height={"400px"}
        chartType="LineChart"
        loader={<div>Loading Chart</div>}
        data={[]}
        options={{
          hAxis: {
            title: "Time Span",
          },
          vAxis: {
            title: "Selection",
          },
        }}
        rootProps={{ "data-testid": "1" }}
      />
    );
  }
}

export default ChartPlotter;
