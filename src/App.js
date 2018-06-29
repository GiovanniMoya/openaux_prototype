import React, { Component } from 'react';
import './App.css';
const queryString = require('query-string')


let defaultStyle = {
  color: "#000"
};


class SongCounter extends Component {
  render() {
    return (
      <div style={{width: "40%", display: "inline-block"}}>
        <h2 style={defaultStyle}>{this.props.playlist && this.props.playlist.length} songs in playlist</h2>
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
  constructor(props) {
    super(props);
      this.state = {voteValue: 0};
  }
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
          <li>{song.name} <VoteButton voteValue={this.state.voteValue} onVote={value => this.setState({voteValue: value})}/></li>
            </ul>
      </div>
    );
  }
}

class VoteButton extends React.Component {
  constructor(props) {
  super(props);
}

  render() {

    let widthStyle = {
      padding: "8px",
      margin: "20px"
      }

    return (
      <div>
        {/* <button onClick={this.onUpvoteClick} style={widthStyle}> */}
        <button onClick={() => this.props.onVote(this.props.voteValue+1)} style={widthStyle}>
          Up Vote
        </button>
          {this.props.voteValue}
          <button onClick={() => this.props.onVote(this.props.voteValue-1)} style={widthStyle}>
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
      user: {},
      filterString: "",
      playlist: [{
        songs: [],
        playlistID: 1
      }]
    }
  }

  componentDidMount() {
    let parsed = queryString.parse(window.location.search)
    // console.log(parsed)                                    console log accessToken object
    let accessToken = parsed.access_token

    if (!accessToken) return                                    // if no access token return to log in screen

    fetch("https://api.spotify.com/v1/me", {headers: {
       'Authorization': 'Bearer ' + accessToken
   }}).then(response => response.json())
      .then(data => this.setState({user: {name: data.display_name, userID: data.uri.slice(13)}}))

   //  fetch("https://api.spotify.com/v1/me/playlists", {headers: {               //TODO unnecessary, can access tracks from playlist request
   //     'Authorization': 'Bearer ' + accessToken
   // }}).then(response => response.json())
   //    .then(data => this.setState({playlist: {songs: [], playlistID: data.items[0].id}}))

      fetch("https://api.spotify.com/v1/me/playlists", {headers: {
         'Authorization': 'Bearer ' + accessToken
       }}).then(response => response.json())
            .then(playlistData => {
              // console.log(playlistData.items[0])
              let playlist = playlistData.items[0]
                let trackDataPromise = fetch(playlist.tracks.href, {
                  headers: {'Authorization': 'Bearer ' + accessToken}
                })
                  .then(response => response.json())
                    .then(tracks => this.setState({
                      songs: tracks.items.map(item => {
                        return {name:item.track.name}
                      })
                    })
          )})
}

  render() {
    let playlistToRender = this.state.user.userID && this.state.songs
    ? this.state.songs.filter(arr =>
      arr.name.toLowerCase().includes(this.state.filterString.toLowerCase()))
      : []

    return (
      <div className="App">
        {
          this.state.user.name ?
          <div className="componentView">
            <h1>OpenAux</h1>
              <h2 style={defaultStyle}>{this.state.user.name}'s Playlist</h2>
              <SongCounter playlist={this.state.songs}/>
              <Filter onFilterChange={text => this.setState({filterString: text})}/>
              {playlistToRender.map(song => <Playlist songs={song} key={song.name}/>)}
          </div> : <button onClick={() => window.location = 'http://localhost:8888/login'} style={{fontSize: "20px", margin: "20px"}}>Sign in to spotify</button>
        }
      </div>
    );
  }
}


export default App;
