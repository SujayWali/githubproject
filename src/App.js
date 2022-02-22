import React from "react";
import "./App.css";
import ReposCard from "./components/ReposCard";
import Search from "./components/Search";
import UserCard from "./components/UserCard";

const PAGE_SIZE = 3;

class App extends React.Component {
  state = {
    user: null,
    repos: [],
    userDataError: null,
    reposDataError: null,
    loading: false,
    page: 1,
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
    const { page } = this.state;
    const res = await fetch(
      `https://api.github.com/users/${username}/repos?${page}&per_page=${PAGE_SIZE}`
    );

    if (res.ok) {
      const data = await res.json();
      console.log(data);

      return { data, page: page + 1 };
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
            page: repos.page,
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

  render() {
    const { userDataError, reposDataError, loading, user, repos, page } =
      this.state;
    const renderRepos = !loading && !reposDataError && !!repos.length;
    return (
      <div className="App">
        <div>
          <Search fetchData={this.fetchData} />
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
            <div className="mb-4">
              {[...new Array(Math.ceil(user.public_repos / PAGE_SIZE))].map(
                (_, index) => (
                  <button key={index} className="btn btn-success m-2">
                    {index + 1}
                  </button>
                )
              )}
            </div>
            <div>
              {repos.map((repo) => (
                <ReposCard key={repo.id} repo={repo} />
              ))}
              {/* {(page - 1) * PAGE_SIZE < user.public_repos && (
                <button className="btn btn-success" onClick={this.loadMore}>
                  Load More
                </button>
              )} */}
            </div>
          </React.Fragment>
        )}
      </div>
    );
  }
}

export default App;
