import { Component } from "react";
import Button from "@material-ui/core/Button";
import "./footer.css";

class Footer extends Component {
  render() {
    return (
      <div className="footerDiv">
        <Button
          className="startButton"
          variant="contained"
          color="primary"
          onClick={this.props.actionButton}
        >
          Generate Chart
        </Button>
      </div>
    );
  }
}

export default Footer;
