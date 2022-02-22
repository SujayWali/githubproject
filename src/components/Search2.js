import React from "react";

class Search extends React.Component {
  inputRef = React.createRef();

  handlechange = () => {
    const value = this.inputRef.current.value;
    alert(`The value of input value is ${value}`);
  };

  render() {
    return (
      <div>
        <input
          ref={this.inputRef}
          name="username"
          type="text"
          placeholder="Enter Name"
        ></input>
        <button onClick={this.handlechange}>Click me!</button>
      </div>
    );
  }
}

export default Search;
