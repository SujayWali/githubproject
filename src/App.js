import React, { Fragment } from "react";
import "./App.css";
import ReposCard from "./components/ReposCard";
import Search from "./components/Search";
import UserCard from "./components/UserCard";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { withRouter } from "react-router-dom";

// const PAGE_SIZE = 10;

class App extends React.Component {
  state = {
    user: null,
    repos: [],
    userDataError: null,
    reposDataError: null,
    loading: false,
    pageSize: 10,
    page: 1,
    fetchingRepos: false,
  };

  componentDidMount() {
    window.addEventListener("scroll", this.handleScroll);
    const { match } = this.props;

    if (match.params.username) this.fetchData(match.params.username);
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  }

  handleScroll = () => {
    const currentScroll = window.scrollY;
    const maxScroll = window.scrollMaxY;
    const { user, page, pageSize } = this.state;

    console.log(currentScroll, maxScroll);

    if (
      user &&
      maxScroll - currentScroll <= 100 &&
      (page - 1) * pageSize < user.public_repos
    )
      this.loadPage();
  };

  fetchUserData = async (username) => {
    const res = await fetch(`https://api.github.com/users/${username}`);

    if (res.ok) {
      const data = await res.json();
      console.log(data);

      return { data };
    }

    const error = (await res.json()).message;

    return { error };
  };

  fetchRepos = async (username) => {
    const { pageSize, page } = this.state;
    const res = await fetch(
      `https://api.github.com/users/${username}/repos?${page}&per_page=${pageSize}`
    );

    if (res.ok) {
      const data = await res.json();
      console.log(data);

      return { data };
    }
    const error = (await res.json()).message;

    return { error };
  };

  fetchData = async (username) => {
    this.setState({ loading: true }, async () => {
      try {
        const [user, repos] = await Promise.all([
          this.fetchUserData(username),
          this.fetchRepos(username),
        ]);

        if (user.data !== undefined && repos.data !== undefined) {
          return this.setState({
            user: user.data,
            repos: repos.data,
            page: 2,
            loading: false,
          });
        }
        this.setState({
          userDataError: user.error,
          reposDataError: repos.error,
          loading: false,
        });
      } catch (err) {
        this.setState({
          error: "There is some error",
          loading: false,
        });
      }
    });
  };

  // loadMore = async () => {
  //   const { data, page } = await this.fetchRepos(this.state.user.login);

  //   if (data)
  //     this.setState((state) => ({
  //       repos: [...state.repos, ...data],
  //       page,
  //     }));
  // };

  loadPage = async () => {
    if (this.state.fetchingRepos === true) return;
    this.setState({ fetchingRepos: true }, async () => {
      const { data } = await this.fetchRepos(this.state.user.login);

      if (data)
        this.setState((state) => ({
          repos: [...state.repos, ...data],
          fetchingRepos: false,
        }));
    });
  };
  // handlePageChange = (page) => {
  //   this.setState({ page }, () => this.loadPage());
  // };

  // handlePageSizeChange = (e) =>
  //   this.setState(
  //     {
  //       pageSize: e.target.value,
  //     },
  //     () => this.loadPage()
  //   );

  render() {
    const { userDataError, reposDataError, loading, user, repos } = this.state;
    const { match } = this.props;
    const renderRepos = !loading && !reposDataError && !!repos.length;

    return (
      <>
        <div className="App">
          <div>
            <Search
              //fetchData={this.fetchData}
              username={match.params.username}
            />
          </div>
          <div>
            {loading && <p>Loading...</p>}
            {userDataError && <p className="text-danger">{userDataError}</p>}
          </div>
          <div>
            {!loading && !userDataError && user && <UserCard user={user} />}
          </div>
          {reposDataError && <p className="text-danger">{reposDataError}</p>}
          {renderRepos && (
            <React.Fragment>
              {repos.map((repo) => (
                <ReposCard key={repo.id} repo={repo} />
              ))}
            </React.Fragment>
          )}
        </div>
      </>
    );
  }
}

export default withRouter(App);
