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
        <label style={{display: 'block'}} for="songNameInPlaylist">search for song within playlist</label>
        <input type="text" placeholder="playlist" id="songNameInPlaylist" name="songNameInPlaylist" onKeyUp={event => this.props.onFilterChange(event.target.value)}/>
      </div>
    );
  }
}

class SearchSong extends Component {
  render() {
    return(
      <div style={defaultStyle}>
        <label style={{display: 'block'}} for="songSearchInput" name="songSearchForm">search song to add</label>
        <input type="text" placeholder= "search song" id="songName" name="songSearchInput" onKeyUp={event => this.props.onSearchSong(event.target.value)}/>

        {/* {if(document.getElementById("songName").value == "") this.setState({queriedSongList: []})} */}
        {this.props.searchSongsDisplay.map(song => <ul style={{listStyle: "none"}}><li>{song.name} {song.artists}</li></ul>)}
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

    // function PlayPause(props) {
    //   return(
    //     <div>
    //     <button onClick={(props.songStatus == "pause") ? props.onPlay(props.songStatus:"play") : props.onPlay(props.songStatus:"pause")}> {props.songStatus} </button>
    //     </div>
    //   );
    // }
                                                                                  //// TODO: convert buttons to function components
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

            <button onClick={(this.props.songStatus === "pause") ? () => this.props.onPlay("play") : () => this.props.onPlay("pause")} style={widthStyle}> {(this.props.songStatus === "pause") ? "play" : "pause"} </button>
          </li>
        </ul>
      </div>
    );
  }
}


class App extends Component {
  constructor(props) {
    super(props);
    this.state =
      {
        user: {userName: "", userID: ""},
        filterString: "",
        songs: [{name: "", value: 0, songID: "", status: "pause"}],
        queriedSongList: [{name: "",}]
      }
  }

  componentDidMount() {
    let parsed = queryString.parse(window.location.search)
    // console.log(parsed)                                    console log accessToken object
    window.accessToken = parsed.access_token

    if (!window.accessToken) return                                    // if no access token return to log in screen

    fetch("https://api.spotify.com/v1/me", {headers: {
       'Authorization': 'Bearer ' + window.accessToken
   }}).then(response => response.json())
      .then(data => this.setState({user: {name: data.display_name, userID: data.uri.slice(13)}}))

   //  fetch("https://api.spotify.com/v1/me/playlists", {headers: {               //TODO unnecessary, can access tracks from playlist request
   //     'Authorization': 'Bearer ' + accessToken
   // }}).then(response => response.json())
   //    .then(data => this.setState({playlist: {songs: [], playlistID: data.items[0].id}}))

      fetch("https://api.spotify.com/v1/me/playlists", {headers: {
         'Authorization': 'Bearer ' + window.accessToken
       }}).then(response => response.json())
            .then(playlistData => {
              // console.log(playlistData.items[0])
              let playlist = playlistData.items[0]
                let trackDataPromise = fetch(playlist.tracks.href, {
                  headers: {'Authorization': 'Bearer ' + window.accessToken}
                })
                  .then(response => response.json())
                    .then(tracks => this.setState({
                      songs: tracks.items.map(item => { console.log(item)
                        return {name:item.track.name, voteValue: 0, songID: item.track.id, status: "pause"}
                      })
                    })
          )})

   const script = document.createElement("script")

   script.src = "https://sdk.scdn.co/spotify-player.js"
   script.async = true

   document.body.appendChild(script)

   window.onSpotifyWebPlaybackSDKReady = () => {
  const token = window.accessToken;
  const player = new window.Spotify.Player({
    name: 'Web Playback SDK Quick Start Player',
    getOAuthToken: cb => { cb(token); }
  });
  // Error handling
  player.addListener('initialization_error', ({ message }) => { console.error(message); });
  player.addListener('authentication_error', ({ message }) => { console.error(message); });
  player.addListener('account_error', ({ message }) => { console.error(message); });
  player.addListener('playback_error', ({ message }) => { console.error(message); });

  // Playback status updates
  player.addListener('player_state_changed', state => { console.log(state); });

  // Ready
  player.addListener('ready', ({ device_id }) => {
    console.log('Ready with Device ID', device_id);
    window.device_id = device_id
  });

  // Not Ready
  player.addListener('not_ready', ({ device_id }) => {
    console.log('Device ID has gone offline', device_id);
  });
  // Connect to the player!
  player.connect();

};

}


   playPauseReq(tempSong) {
     // let parsed = queryString.parse(window.location.search)
     // // console.log(parsed)                                    console log accessToken object
     // const accessToken = parsed.access_token
     console.log(tempSong)
     if(tempSong.status === "play")
      {
       fetch("https://api.spotify.com/v1/me/player/play?device_id=" + window.device_id , {
              method: 'PUT',
              body: JSON.stringify({ uris: ['spotify:track:' + tempSong.songID] }),
              headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + window.accessToken
              },
                }).then(res => {
                    console.log(res)
                  }).catch(err => {
                      console.log(err)
                    })
      } else {
        fetch("https://api.spotify.com/v1/me/player/pause?device_id=" + window.device_id , {
               method: 'PUT',
               body: JSON.stringify({ uris: ['spotify:track:' + tempSong.songID] }),
               headers: {
                 'Content-Type': 'application/json',
                 'Authorization': 'Bearer ' + window.accessToken
               },
                 }).then(res => {
                     console.log(res)
                   }).catch(err => {
                       console.log(err)
                     })
      }
                }




      searchList(tempQueryString) {
        let sortedQueriedSongs;
          fetch("https://api.spotify.com/v1/search?q=" + tempQueryString + "&type=track&limit=5", { headers: {
                           'Authorization': 'Bearer ' + window.accessToken}
                         }).then(res => res.json())
                            .then(data => { console.log(data.tracks.items[0].id)
                                            sortedQueriedSongs = data.tracks.items.map(e => ({name: e.name, artists: e.artists[0].name, songURI: e.id }))
                                            this.setState({queriedSongList: sortedQueriedSongs})
                                          })
                            .then(data => console.log(data))
                           .catch(err => {
                                 console.log(err)
                               })


      }


  render() {

    // console.log(window.Spotify)
    let playlistToRender = this.state.user.userID && this.state.songs
    ? this.state.songs.filter(arr =>
      arr.name.toLowerCase().includes(this.state.filterString.toLowerCase()))
      : []



      function sortedSongs(songArr, songName, value) {
        songArr.map(e => (e.name === songName) ? e.voteValue = value : e);
        songArr.sort((a,b) => b.voteValue - a.voteValue)
        return songArr
      }

      function togglePlayPause(tempSongArr, tempSongName, tempStatus, playPauseReq) {
        tempSongArr.map(e => (e.name === tempSongName) ? e.status = tempStatus : e.status = "pause")
        let tempSongID = tempSongArr.find(x => x.name === tempSongName)
        console.log(tempSongID)
        playPauseReq(tempSongID)
        return tempSongArr
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
              <SearchSong searchSongsDisplay={this.state.queriedSongList} onSearchSong={text => text == "" ? this.setState({queriedSongList: []}) : this.searchList(text.replace(/ /g, "+"))}/>
          {playlistToRender.map(song => <Song songs={song} key={song.name} voteValue={song.voteValue} songURI={song.songID} songStatus={song.status} onPlay={songStatus => this.setState(prevState => ({songs: togglePlayPause(prevState.songs, song.name, songStatus, this.playPauseReq)}))}
            onVote={value => this.setState(prevState => ({songs: sortedSongs(prevState.songs, song.name, value)}))}/>)}
            {console.log(this.state)}
          </div> : <button onClick={() => window.location = 'http://localhost:8888/login'} style={{fontSize: "20px", margin: "20px"}}>Sign in to spotify</button>
        }
      </div>
    );
  }
}


export default App;
