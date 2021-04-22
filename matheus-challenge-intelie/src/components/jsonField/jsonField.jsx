import {Component} from "react";
import "./jsonField.css"

//Custom TextArea Component
class JsonField extends Component{
  constructor(props){
    super(props);
    this.state = {
      jsonField : "",
    }
  }

  TreatInput(){
      
  }

  render(){
    return  (
    <div className="container">
      <textarea className="jsonArea" 
        onChange={(event) => {
          this.setState({jsonField : event.target.value});
        }} value={this.state.jsonField} >
      </textarea>
    </div>
    );
  }
}

export default JsonField;