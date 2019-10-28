import React, {Component}                         from 'react';
import { FloatingActionButton, MuiThemeProvider } from 'material-ui';
import MicrophoneOn                               from 'material-ui/svg-icons/av/mic';
import MicrophoneOff                              from 'material-ui/svg-icons/av/stop';
import PauseIcon                                  from 'material-ui/svg-icons/av/pause';
import { ReactMic }                               from 'react-mic';
import axios                                      from 'axios';

require ('./styles.scss');

const postURL = 'http://localhost:5000/predict';
let interval = 0;
let chunks = new Array();
let chunks_count = 0;
const responses = {
  'dog_bark': 'Cachorro Latindo',
  'siren': 'Sirene',
  'car_horn': 'Buzina',
};

export default class Demo extends Component {
  constructor(props){
    super(props);
    this.state = {
      classification: "Nothing yet...",
      blobObject: null,
      isRecording: false,
      isPaused: false,
      segment: 'first',
      stop: false,
    }
  }

  componentDidMount() {
  }

  startOrPauseRecording= () => {
    const { isPaused, isRecording} = this.state
    this.setState({ segment: 'first'});
    if(isPaused) {
      this.setState({ isPaused: false });
    } else if(isRecording) {
      this.setState({ isPaused: true });
    } else {
      this.setState({ isRecording: true });
      this.setState({ stop: false })
    }

    setTimeout(() => {
      this.sendData();
      interval = setInterval(() => {
        this.sendData();
      }, 1200);
    }, 4160);
  }

  sendData= () => {
    let blob = new Blob(chunks, { type: 'audio/webm;codecs=opus'});
    console.log(blob);
    console.log(chunks);
    chunks.splice(2, chunks_count-1);
    chunks_count = 0;
    let formData = new FormData();
    formData.append('file', blob, 'test.webm');
    formData.append('segment', this.state.segment);
    this.setState({ segment: 'next'});
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
      if (response.data in responses) {
        this.setState({ classification: responses.response.data});
      }
      console.log(response);
    })
    .catch((error) => {
      console.log(error);
    });
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
    this.setState({ blobURL : blobObject.blobURL});
    clearInterval(interval);
  }

  onData(recordedBlob) {
    //console.log('chunk of real-time data is: ', recordedBlob);
    chunks.push(recordedBlob);
    chunks_count++;
  }

  /*<h2>Sound Classification for Deaf and Hard of Hearing Users</h2>*/
  render() {
    const { blobURL, isRecording, isPaused } = this.state;

    return(
      <MuiThemeProvider>
        <div>
          <h1>Classificação de sons para pessoas surdas e com deficiência auditiva</h1>
          <br/>
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
            Resposta:
          </h2>
          <h3 class="classification-title">
            {this.state.classification}
          </h3>
          <br/>
          <br/>
          <div class="fav-icon-source">
            Ícone disponível em <a href="https://icon-icons.com">Icons-Icons</a>
          </div>

        </div>
    </MuiThemeProvider>
    );
  }
}