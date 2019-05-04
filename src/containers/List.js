import React, { Component } from "react";
const API_KEY = "";

const debounce = (fn, time) => {
  let timeout;

  return function() {
    const functionCall = () => fn.apply(this, arguments);

    clearTimeout(timeout);
    timeout = setTimeout(functionCall, time);
  };
};
export class List extends Component {
  state = {
    filtered: [],
    searchText: "",
    isLoading: false
  };

  fetchVideosApi = async (query, loadNext) => {
    let url = "";
    this.setState({ isLoading: true });

    if (loadNext)
      url = `https://www.googleapis.com/youtube/v3/search?pageToken=CBkQAA&part=snippet&maxResults=35&q=${query}&type=video&key=${API_KEY}`;
    url = `https://www.googleapis.com/youtube/v3/search?&part=snippet&maxResults=35&q=${query}&type=video&key=${API_KEY}`;
    await fetch(url)
      .then(results => results.json())
      .then(response => {
        if (!this.state.filtered.length)
          this.setState({ filtered: response.items, isLoading: false });
        this.setState({
          filtered: [...this.state.filtered, ...response.items],
          isLoading: false
        });
      });
  };

  fetchVideos = debounce(query => {
    this.fetchVideosApi(query);
  }, 2000);

  handleChange = e => {
    let newList = [];
    this.setState({ searchText: e.target.value });
    // If the search bar isn't empty
    if (e.target.value !== "") {
      this.fetchVideos(e.target.value);
    } else {
      // If the search bar is empty, set newList to original task list
      newList = this.props.items;
      this.setState({
        filtered: newList
      });
    }
  };

  componentDidMount() {
    window.addEventListener("scroll", this.onScroll, false);
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.onScroll, false);
  }

  onScroll = () => {
    if (
      window.innerHeight + window.scrollY >= document.body.offsetHeight - 500 &&
      this.state.filtered.length
    ) {
      this.fetchVideosApi(this.state.searchText, true);
    }
  };

  render() {
    return (
      <div>
        <input
          type="text"
          className="input"
          onChange={this.handleChange}
          placeholder="Search..."
        />
        <ul>
          {this.state.filtered && !this.state.isLoading ? (
            this.state.filtered.map((item, index) => (
              <li key={index}>{item.snippet.title} &nbsp;</li>
            ))
          ) : (
            <p>Loading ...</p>
          )}
        </ul>
      </div>
    );
  }
}
