import React, {Component}                         from 'react';
import { FloatingActionButton, MuiThemeProvider } from 'material-ui';
import MicrophoneOn                               from 'material-ui/svg-icons/av/mic';
import MicrophoneOff                              from 'material-ui/svg-icons/av/stop';
import PauseIcon                                  from 'material-ui/svg-icons/av/pause';
import { ReactMic }                               from 'react-mic';
import axios                                      from 'axios';

require ('./styles.scss');

var userStartStop = 0;
const postURL = 'http://127.0.0.1:5000/hello';
var interval;

export default class Demo extends Component {
  constructor(props){
    super(props);
    this.state = {
      classification: "Nothing yet...",
      blobObject: null,
      isRecording: false,
      isPaused: false
    }
  }

  componentDidMount() {
  }

  startOrPauseRecording= () => {
    /*if(userStartStop) {
      clearInterval(interval);
      userStartStop = 0;
    }
    else {
      userStartStop = 1;
    }*/
    const { isPaused, isRecording } = this.state

    if(isPaused) {
      this.setState({ isPaused: false })
    } else if(isRecording) {
      this.setState({ isPaused: true })
    } else {
      this.setState({ isRecording: true })
    }
    this.setState({classification: "Recording..."})

    /*if(!userStartStop) {
      return;
    }

    setTimeout(() => {
      document.getElementById('stop').click();
      document.getElementById('start-pause').click();
    }, 4000);
    interval = setInterval(() => {
      document.getElementById('stop').click();
      document.getElementById('start-pause').click();
    },1000);*/
  }

  stopRecording= () => {
    this.setState({ isRecording: false });
  }

  onSave=(blobObject) => {
  }

  onStart=() => {
    console.log('You can tap into the onStart callback');
  }

  onStop= (blobObject) => {
    this.setState({ blobURL : blobObject.blobURL });
    let formData = new FormData();
    console.log(blobObject.blob);
    formData.append('file', blobObject.blob)
    axios.post(
      postURL,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      }
    )
    .then((response) => {
      this.setState({ classification: response.data});
      console.log(response);
    })
    .catch((error) => {
      console.log(error);
    });
  }

  onData(recordedBlob) {
    console.log('chunk of real-time data is: ', recordedBlob);
  }

  render() {
    const { blobURL, isRecording, isPaused } = this.state;

    return(
      <MuiThemeProvider>
        <div>
          <h1>What's Around?</h1>
          <h2>Sound Classification for Deaf and Hard of Hearing Users</h2>
          <br/>
          <ReactMic
            className="oscilloscope"
            record={isRecording}
            pause={isPaused}
            backgroundColor="#212121"
            visualSetting="sinewave"
            audioBitsPerSecond= {128000}
            onStop={this.onStop}
            onStart={this.onStart}
            onSave={this.onSave}
            onData={this.onData}
            strokeColor="#ffffff" />
          <div>
            <audio ref="audioSource" controls="controls" src={blobURL}></audio>
          </div>
          <br />
          <br />
          <FloatingActionButton
            className="btn"
            id="start-pause"
            secondary={true}
            onClick={this.startOrPauseRecording}>
            { (isRecording && !isPaused )? <PauseIcon /> : <MicrophoneOn /> }
          </FloatingActionButton>
          <FloatingActionButton
            className="btn"
            id="stop"
            secondary={true}
            disabled={!isRecording}
            onClick={this.stopRecording}>
            <MicrophoneOff />
          </FloatingActionButton>
          <br/>
          <br/>
          <h2 class="classification-title">
            Result:
          </h2>
          <h3 class="classification-title">
            {this.state.classification}
          </h3>
          <br/>
          <br/>
          <br/>
          <br/>
          <div class="fav-icon-source">
            Listen icon by <a href="https://icon-icons.com">Icons-Icons</a>
          </div>

        </div>
    </MuiThemeProvider>
    );
  }
}