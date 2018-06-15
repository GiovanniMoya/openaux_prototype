import React, { Component } from 'react';
import './App.css';

let defaultStyle = {
  color: "#000"
};

let fakeServerData = {
  user: {
    name: "Clark",
    playlist: [
      {
          name: "my favorites",
          songs: ["ms. jackson", "talk", "3005"]
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
        <input type="text"/>
      </div>
    );
  }
}

class Playlist extends Component {
  render() {
    let playlist = this.props.playlist
    return(
      <div style={{defaultStyle}}>
        {/* <img/> */}
        <h3>{playlist.name}</h3>
        <ul>
          {playlist.songs.map(song =>
          <li>{song}</li>
            )}
            </ul>
      </div>
    );
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {serverData: {}};
  }

  componentDidMount() {
    setTimeout(() => {
       this.setState({serverData: fakeServerData});
     }, 1000);
  }

  render() {
    let userServerData = this.state.serverData.user
    return (
      <div className="App">
        {
          this.state.serverData.user ?
          <div className="componentView">
          <h1>Title</h1>
            <h2 style={defaultStyle}>{userServerData &&
              userServerData.name}'s Playlist
            </h2>
            <SongCounter playlist={userServerData.playlist}/>
          <Filter/>
          {userServerData.playlist.map(playlist =>
            <Playlist playlist={playlist}/>
          )}

        </div> : <h1>Loading...</h1>
        }
      </div>
    );
  }
}


export default App;
