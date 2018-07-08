import React, { Component } from 'react';
import './App.css';
const queryString = require('query-string')
const { Map, Seq } = require('immutable')

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

class Song extends Component {
  constructor(props) {
    super(props);
      this.state = {voteValue: 0};
  }
  render() {
    let listStyle = {
      listStyle: "none"
    }
    let widthStyle = {
      padding: "8px",
      margin: "20px"
      }
    let song = this.props.songs
    return(
      <div style={{defaultStyle}}>
        {/* <img/> */}
        {/* <h3>{playlist.name}</h3> */}
        <ul style={listStyle}>
          <li>{song.name}
            <button onClick={() => this.props.onVote(this.props.voteValue+1)} style={widthStyle}>
                    Up Vote
                </button>
                          {this.props.voteValue}
            <button onClick={() => this.props.onVote(this.props.voteValue-1)} style={widthStyle}>
                      Down Vote
                </button>
          </li>
        </ul>
      </div>
    );
  }
}

// class VoteButton extends React.Component {
//   constructor(props) {
//   super(props);
// }
//
//   render() {
//
//
//
//     return (
//       <div>
//         {/* <button onClick={this.onUpvoteClick} style={widthStyle}> */}
//
//       </div>
//     );
//   }
// }


class App extends Component {
  constructor(props) {
    super(props);
    this.state =
      {
        user: {userName: "", userID: ""},
        filterString: "",
        songs: [{name: "", value: 0}],
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
                        return {name:item.track.name, voteValue: 0}
                      })
                    })
          )})
}

  render() {
    console.log(this.state)
    let playlistToRender = this.state.user.userID && this.state.songs
    ? this.state.songs.filter(arr =>
      arr.name.toLowerCase().includes(this.state.filterString.toLowerCase()))
      : []

      function sortedSongs(songArr, songName, value) {
        songArr.map(e => (e.name === songName) ? e.voteValue = value : e);
        songArr.sort((a,b) => b.voteValue - a.voteValue)
        return songArr
      }


    return (
      <div className="App">
        {
          this.state.user.name ?
          <div className="componentView">
            <h1>OpenAux</h1>
              <h2 style={defaultStyle}>{this.state.user.name}'s Playlist</h2>
              <SongCounter playlist={this.state.songs}/>
              <Filter onFilterChange={text => this.setState({filterString: text})}/>
          {playlistToRender.map(song => <Song songs={song} key={song.name} voteValue={song.voteValue}
            onVote={value => this.setState(prevState => ({songs: sortedSongs(prevState.songs,song.name,value)}))}/>)}
          </div> : <button onClick={() => window.location = 'http://localhost:8888/login'} style={{fontSize: "20px", margin: "20px"}}>Sign in to spotify</button>
        }
      </div>
    );
  }
}


export default App;
