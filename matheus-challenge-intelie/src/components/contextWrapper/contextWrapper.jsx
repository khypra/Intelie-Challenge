import { Component } from "react";
import React from "react";
import JsonField from "./jsonField/jsonField";
import Footer from "./footer/footer";

class ContextWrapper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      jsonField: "",
    };
    this.handlerToUpdate = this.handlerToUpdate.bind(this);
    this.actionButton = this.actionButton.bind(this);
  }

  handlerToUpdate(event) {
    this.setState({
      jsonField: event.target.value,
    });
  }

  actionButton() {}

  render() {
    return (
      <React.Fragment>
        <JsonField handlerToUpdate={this.handlerToUpdate}></JsonField>
        <Footer actionButton={this.actionButton}></Footer>
      </React.Fragment>
    );
  }
}

export default ContextWrapper;
