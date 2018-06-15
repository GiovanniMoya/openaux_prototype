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

class songCounter extends Component {
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
    return(
      <div style={{...defaultStyle}}>
        {/* <img/> */}
        <h3>Playlist Name</h3>
        <ul>
          <li>Song 1</li>
          <li>Song 2</li>
          <li>Song 3</li>
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
    return (
      <div className="App">
        {
          this.state.serverData.user ?
          <div className="componentView">
          <h1>Title</h1>
            <h2 style={defaultStyle}>{this.state.serverData.user &&
              this.state.serverData.user.name}'s Playlist
            </h2>
            <songCounter playlist={this.state.serverData.user.playlist}/>
          <Filter/>
          <Playlist/>
        </div> : <h1>Loading...</h1>
        }
      </div>
    );
  }
}


export default App;
