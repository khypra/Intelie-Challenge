import { Component } from "react";
import React from "react";
import JsonField from "./jsonField/jsonField";
import Footer from "./footer/footer";
import Chart from "./chart/chartPlotter";
import Sequence from "../../models/sequence";
import "./contextWrapper.css";
import EventEmitter from "./eventEmitter";

//wrapper component created to be the parent component to facilitate passage of props and function between child components.
class ContextWrapper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      jsonField: "",
      treatedSequences: [],
      labels: [],
    };
    //binds to pass functions as props to the child components, so the states can be shared

    // this.handlerToUpdate = this.handlerToUpdate.bind(this);
    this.actionButton = this.actionButton.bind(this);
  }
  componentDidMount() {
    EventEmitter.on("textUpdate", (value) => {
      this.dataReader(value);
    });
  }
  componentWillUnmount() {
    EventEmitter.off("textUpdate");
  }
  //handler that when the jsonField is changed, will update the jsonField State with the content tiped
  // handlerToUpdate(event) {
  //   this.setState({
  //     jsonField: event.target.value,
  //   });
  // }
  //action of the button that when clicked, will take the jsonField State data and manipulate it to be in a propper json format, so it can be molded in a chart
  actionButton() {
    EventEmitter.emit("onClickButton");
  }

  dataReader(value) {
    try {
      //time validation to ensure that processing will not pass a certain time. it'll interupt the data reading and pass on the already completed sequences.
      const startTime = +new Date();
      //chain functions to parse the string input into valid objects.
      let activeSequence;
      let activeGroup = [];
      let activeSelect = [];
      let sequences = [];
      let labels = ["Time Stamp"];
      let dataset = {};
      //formatting the string input to make it possible parsing to json, by removing the >>'<< character and surround all the characters with >>" "<<
      //then using the REGEX to find all entries that are surrounded with {} that simbolizes an object and mapping them into a list of objects.
      let lines = value
        .replaceAll("'", "")
        .replaceAll(/([a-z_]+)/g, '"$&"')
        .match(/\{[^}]+\}/g)
        .map(JSON.parse);
      //as said in this post with tests, the forEach method is slower than the for loop with the array length as index.
      //as the size scales, the difference decrases, but it is still significant.
      //https://github.com/dg92/Performance-Analysis-JS

      //in this sequences of conditionals, it is verified that a sequence is only valid between an event start and stop.
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].type === "start" && !activeSequence) {
          //defined because it was not specified that, if a two or more start events happen before the first one ends, the first one will be valid, and the subsequent ones will be ignored.
          activeSequence = new Sequence();
          activeSequence.start = lines[i];
          dataset = {};
          activeGroup = activeSequence.start.group; //used to filter eventData that have these specific properties
          activeSelect = activeSequence.start.select; // used to filter eventData that have these specific properties
          sequences.push(activeSequence);
        } else if (lines[i].type === "stop" && activeSequence) {
          //this ensures that all stop events need a start event to be a valid sequence
          activeSequence.stop = lines[i];
          activeSequence.data = dataset;
          activeSequence = undefined;
        } else if (
          lines[i].type === "span" &&
          activeSequence &&
          !activeSequence.span
        ) {
          //same for the span event, if two or more span events happens in the same sequence, the first one will be the valid, and all subsequent span events will be ignored.
          //note that all the data is invalid if a span event is not defined.
          activeSequence.span = lines[i];
        } else if (lines[i].type === "data" && activeSequence) {
          //the validation of a data timestamp will come before de chart plotting to ensure that valid sequences with span defined after all the data, will be inserted.
          //in this code i've done the data treatment and separation to facilitate plotting in the next step,
          //granting that only dataEvents that have the group and select properties will be pushed into the activeSequece data array.
          let label = "";
          let timeStamp = lines[i].timestamp;
          let value;
          //verifying if this specific dataEvent have one or more property correspondent to the goup specification, and preparing the label for the new dataObject to facilitate the plot.
          for (let j = 0; j < activeGroup.length; j++) {
            const element = activeGroup[j];
            if (typeof lines[i][element] !== "undefined") {
              label += lines[i][element] + " ";
            }
          }
          //same for the select specification, but as each value from properties will be points in the chart, i've used this loop to separate'em in different data objects
          //as well as finishing the label, putting into an temporary object and pushing it into the data array from the activeSequence.
          for (let j = 0; j < activeSelect.length; j++) {
            const selection = activeSelect[j];
            if (typeof lines[i][selection] !== "undefined") {
              value = lines[i][selection];
              if (!dataset[timeStamp]) dataset[timeStamp] = [];
              dataset[timeStamp][0] = timeStamp;
              let index = labels.indexOf(label + selection);
              if (index === -1) {
                index = labels.push(label + selection) - 1;
              }
              dataset[timeStamp][index] = value;
            }
          }
        }
        if (
          i + 1 === lines.length &&
          activeSequence &&
          typeof activeSequence.stop === "undefined"
        ) {
          //conditional that specifies that a sequence start without an stop is not valid.
          sequences.pop(activeSequence);
          activeSequence = undefined;
        }

        const nowTime = +new Date();
        if (nowTime - startTime > 5000) {
          if (typeof activeSequence.stop === "undefined") {
            console.log("fudeu");
            sequences.pop(activeSequence);
            break;
          }
        }
      }

      //setting the state after preparing it
      this.setState({
        treatedSequences: sequences,
        labels: labels,
      });
    } catch (e) {
      console.log(
        "invalid input for JsonField, Check the string and try again"
      );
      console.log(e.message);
      console.log(e.stack);
    }
  }

  render() {
    return (
      <React.Fragment>
        <JsonField handlerToUpdate={this.handlerToUpdate}></JsonField>
        <div className="bottomDiv">
          <Chart
            treatedSequences={this.state.treatedSequences}
            labels={this.state.labels}
          ></Chart>
          <Footer actionButton={this.actionButton}></Footer>
        </div>
      </React.Fragment>
    );
  }
}

export default ContextWrapper;
