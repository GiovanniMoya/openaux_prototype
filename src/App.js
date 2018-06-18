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
    let song = this.props.songs
    return(
      <div style={{defaultStyle}}>
        {/* <img/> */}
        {/* <h3>{playlist.name}</h3> */}
        <ul>
          <li>{song.name}</li>
            </ul>
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
          <h1>OpenAux</h1>
            <h2 style={defaultStyle}>{userServerData &&
              userServerData.name}'s Playlist
            </h2>
            <SongCounter playlist={userServerData.playlist}/>
          <Filter onFilterChange={text => this.setState({filterString: text})}/>
          {/* { this.state.filterString
            userServerData.playlist.songs.filter(song => song.name.includes(this.state.filterString))
            .map(playlist => <Playlist playlist={playlist}/>) :
           userServerData.playlist.map(playlist => <Playlist playlist={playlist}/>)
        } */}
        {
          userServerData.playlist[0].songs.filter(arr => arr.name.toLowerCase()
            .includes(this.state.filterString.toLowerCase()))
            .map(song => <Playlist songs={song} key={song.name}/>)
       }
        </div> : <h1>Loading...</h1>
        }
      </div>
    );
  }
}


export default App;
