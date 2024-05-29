import React from "react";

class Input extends React.Component {
  render() {
    return (
      <div>
        <input
          type="text"
          placeholder="Search for location..."
          value={this.props.location}
          onChange={(e) => this.props.updateLocation(e.target.value)}
        />
      </div>
    );
  }
}

export default Input;
