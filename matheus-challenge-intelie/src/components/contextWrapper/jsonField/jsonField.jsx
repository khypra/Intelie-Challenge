import { Component } from "react";
import "./jsonField.css";
import EventEmitter from "../eventEmitter";
//Custom TextArea Component
class JsonField extends Component {
  componentDidMount() {
    EventEmitter.on("onClickButton", () => {
      EventEmitter.emit("textUpdate", document.getElementById("txtArea").value);
    });
  }
  componentWillUnmount() {
    EventEmitter.off("onClickButton");
  }
  render() {
    return (
      <div className="container">
        <textarea
          id="txtArea"
          className="jsonArea"
          // onChange={this.props.handlerToUpdate}
        ></textarea>
      </div>
    );
  }
}

export default JsonField;
