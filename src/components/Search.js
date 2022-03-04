import React from "react";
import { withRouter } from "react-router-dom";
class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: props.username || "",
    };
  }

  handlechange = (e) => {
    const value = e.target.value;
    this.setState({
      username: value,
    });
  };

  render() {
    const { history } = this.props;
    const { username } = this.state;

    return (
      <div className="bg-dark">
        <div className="container py-5">
          <div className="row">
            <div className="col-8 offset-2 text-center">
              <div className="row">
                <div className="col-9">
                  <input
                    className="form-control"
                    value={username}
                    onChange={this.handlechange}
                    name="username"
                    type="text"
                    placeholder="Enter Username"
                  ></input>
                </div>
                <div className="col-3">
                  <button
                    onClick={() => history.push(`/${username}`)}
                    className="btn btn-large btn-success"
                  >
                    Search
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(Search);
