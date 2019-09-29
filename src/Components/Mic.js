import React, {Component}                         from 'react';
import { FloatingActionButton, MuiThemeProvider } from 'material-ui';
import MicrophoneOn                               from 'material-ui/svg-icons/av/mic';
import MicrophoneOff                              from 'material-ui/svg-icons/av/stop';
import PauseIcon                                  from 'material-ui/svg-icons/av/pause';
import { ReactMic }                               from 'react-mic';

require ('./styles.scss');

export default class Demo extends Component {
  constructor(props){
    super(props);
    this.state = {
      blobObject: null,
      isRecording: false,
      isPaused: false
    }
  }

  componentDidMount() {
  }

  startOrPauseRecording= () => {
    const { isPaused, isRecording } = this.state

    if(isPaused) {
      this.setState({ isPaused: false })
    } else if(isRecording) {
      this.setState({ isPaused: true })
    } else {
      this.setState({ isRecording: true })
    }
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
          <br />
          <br />
          <FloatingActionButton
            className="btn"
            secondary={true}
            onClick={this.startOrPauseRecording}>
            { (isRecording && !isPaused )? <PauseIcon /> : <MicrophoneOn /> }
          </FloatingActionButton>
          <FloatingActionButton
            className="btn"
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
            Nothing yet...
          </h3>
          <br/>
          <br/>
          <br/>
          <br/>
          <div class="fav-icon-source">
            Listen icon by <a target="_blank" href="https://icon-icons.com">Icons-Icons</a>
          </div>

        </div>
    </MuiThemeProvider>
    );
  }
}