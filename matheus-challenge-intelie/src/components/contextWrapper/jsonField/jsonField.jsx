import { Component } from "react";
import "./jsonField.css";

//Custom TextArea Component
class JsonField extends Component {
  render() {
    return (
      <div className="container">
        <textarea
          className="jsonArea"
          onChange={this.props.handlerToUpdate}
        ></textarea>
      </div>
    );
  }
}

export default JsonField;
