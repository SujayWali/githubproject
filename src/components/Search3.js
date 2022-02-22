import React from "react";

class Search extends React.Component {
  handleKeyEvent = (e) => {
    if (e.keyCode === 13) {
      const value = e.target.value;

      alert(`the input value is ${value}`);
    }
  };

  render() {
    return (
      <div>
        <input
          onKeyDown={this.handleKeyEvent}
          name="username"
          type="text"
          placeholder="Enter Name"
        ></input>
      </div>
    );
  }
}

export default Search;
