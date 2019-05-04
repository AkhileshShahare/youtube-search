import React, { Component } from "react";
const API_KEY = "AIzaSyAlPlr6ZuMz9LdvfhrHoqI2dB6IbDNBJjA";


const debounce = (fn, time) => {
  let timeout;

  return function() {
    const functionCall = () => fn.apply(this, arguments);
    
    clearTimeout(timeout);
    timeout = setTimeout(functionCall, time);
  }
}
export class List extends Component {
  state = {
    filtered: []
  };

  fetchVideos = debounce(async query => {
    await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&type=video&key=${API_KEY}`
    )
      .then(results => results.json())
      .then(response => {
        this.setState({ filtered: response.items });
      });
  }, 2000);

  handleChange = e => {
    let newList = [];

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
          {this.state.filtered && this.state.filtered.map((item, index) => (
            <li key={index}>{item.snippet.title} &nbsp;</li>
          ))}
        </ul>
      </div>
    );
  }
}
