import React, { Component } from 'react';
import './App.css';
const queryString = require('query-string')



let defaultStyle = {
  color: "#000"
};

let fakeServerData = {
  user: {
    name: "Clark",
    playlist: [{
          name: "my favorites",
          songs: [
            {name: "ms. jackson"},
            {name: "talk"},
            {name: "3005"}
          ]
      }
    ]
  }
};

class SongCounter extends Component {
  render() {
    return (
      <div style={{width: "40%", display: "inline-block"}}>
        <h2 style={defaultStyle}>{this.props.playlist && this.props.playlist[0].songs.length} songs in playlist</h2>
      </div>
    );
  }
}

class Filter extends Component {
  render() {
    return (
      <div style={defaultStyle}>
        {/* <img/> */}
        <input type="text" onKeyUp={event => this.props.onFilterChange(event.target.value)}/>
      </div>
    );
  }
}

class Playlist extends Component {
  render() {
    let listStyle = {
      listStyle: "none"
    }
    let song = this.props.songs
    return(
      <div style={{defaultStyle}}>
        {/* <img/> */}
        {/* <h3>{playlist.name}</h3> */}
        <ul style={listStyle}>
          <li>{song.name} <VoteButton/></li>
            </ul>
      </div>
    );
  }
}

class VoteButton extends React.Component {
  constructor(props) {
  super(props);
  this.state = {voteValue: 0};

    // This binding is necessary to make `this` work in the callback
    this.onUpvoteClick = this.onUpvoteClick.bind(this);
    this.onDownVoteClick = this.onDownVoteClick.bind(this);
  }

  onUpvoteClick() {
    this.setState(prevState => this.state.voteValue = prevState.voteValue + 1
   );
  }

  onDownVoteClick() {
    this.setState((prevState) => this.state.voteValue = (prevState.voteValue - 1)
    );
  }

  render() {

    let widthStyle = {
      padding: "8px",
      margin: "20px"
      }

    return (
      <div>
        <button onClick={this.onUpvoteClick} style={widthStyle}>
          Up Vote
        </button>
          {this.state.voteValue}
          <button onClick={this.onDownVoteClick} style={widthStyle}>
            Down Vote
          </button>
      </div>
    );
  }
}


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      serverData: {},
      filterString: ""
    }
  }

  componentDidMount() {
    let parsed = queryString.parse(window.location.search)
    // console.log(parsed)                                    console log accessToken object
    let accessToken = parsed.access_token

    fetch("https://api.spotify.com/v1/me", {headers: {
       'Authorization': 'Bearer ' + accessToken
   }}).then(response => response.json())
      .then(data => console.log(data))
}

  render() {
    let userServerData = this.state.serverData.user
    return (
      <div className="App">
        {
          this.state.serverData.user ?
          <div className="componentView">
            <h1>OpenAux</h1>
              <h2 style={defaultStyle}>{userServerData &&
                userServerData.name}'s Playlist
              </h2>
              <SongCounter playlist={userServerData.playlist}/>
              <Filter onFilterChange={text => this.setState({filterString: text})}/>
              {userServerData.playlist[0].songs.filter(arr => arr.name.toLowerCase()
                .includes(this.state.filterString.toLowerCase()))
                .map(song => <Playlist songs={song} key={song.name}/>)}
          </div> : <button onClick={() => window.location = "htttp://localhost::8888/login"} style={{fontSize: "20px", margin: "20px"}}>Sign in to spotify</button>
        }
      </div>
    );
  }
}


export default App;
