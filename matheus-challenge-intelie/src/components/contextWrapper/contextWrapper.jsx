import { Component } from "react";
import React from "react";
import JsonField from "./jsonField/jsonField";
import Footer from "./footer/footer";
import Chart from "./chart/chartPlotter";
import Sequence from "../../models/sequence";

//wrapper component created to be the parent component to facilitate passage of props and function between child components.
class ContextWrapper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      jsonField: "",
      treatedSequences: [],
    };
    //binds to pass functions as props to the child components, so the states can be shared
    this.handlerToUpdate = this.handlerToUpdate.bind(this);
    this.actionButton = this.actionButton.bind(this);
  }

  //handler that when the jsonField is changed, will update the jsonField State with the content tiped
  handlerToUpdate(event) {
    this.setState({
      jsonField: event.target.value,
    });
  }
  //action button that when clicked will take the jsonField State data and manipulate it to be in a propper json format so it can be molded in a graph
  actionButton() {
    try {
      //chain functions to parse the string input into valid objects.
      let activeSequence;
      let sequences = [];
      let lines = this.state.jsonField
        .replaceAll("'", "")
        .replaceAll(/([a-z_]+)/g, '"$&"')
        .match(/\{[^}]+\}/g)
        .map(JSON.parse);
      //as said in this post with tests, the forEach method is 60% slower than the for interation with the array length as index.
      //as the size scales, the difference decrases, but it is still significant.
      //https://github.com/dg92/Performance-Analysis-JS
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].type === "start" && !activeSequence) {
          activeSequence = new Sequence();
          activeSequence.start = lines[i];
          sequences.push(activeSequence);
        } else if (lines[i].type === "stop" && activeSequence) {
          activeSequence.stop = lines[i];
          activeSequence = undefined;
        } else if (
          lines[i].type === "span" &&
          activeSequence &&
          !activeSequence.span
        ) {
          activeSequence.span = lines[i];
        } else if (lines[i].type === "data" && activeSequence) {
          activeSequence.data.push(lines[i]);
        }
      }
      this.setState({
        treatedSequences: sequences,
      });
    } catch (e) {
      console.log(
        "invalid input for JsonField, Check the string and try again"
      );
      console.log(e.message);
    }
  }

  render() {
    return (
      <React.Fragment>
        <JsonField handlerToUpdate={this.handlerToUpdate}></JsonField>
        <Chart jsonLine={this.state.treatedLines}></Chart>
        <Footer actionButton={this.actionButton}></Footer>
      </React.Fragment>
    );
  }
}

export default ContextWrapper;
