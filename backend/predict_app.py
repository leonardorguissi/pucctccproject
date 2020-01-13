import numpy as np
from fastai.vision import *
import librosa
import librosa.display
from fastai.imports import *
from flask import request
from flask import Flask
from flask_cors import CORS, cross_origin
from pydub import AudioSegment

app = Flask(__name__)


def create_spectrogram(filename, name):
    plt.interactive(False)
    clip, sample_rate = librosa.load(filename, sr=None)
    fig = plt.figure(figsize=[0.72,0.72])
    ax = fig.add_subplot(111)
    ax.axes.get_xaxis().set_visible(False)
    ax.axes.get_yaxis().set_visible(False)
    ax.set_frame_on(False)
    S = librosa.feature.melspectrogram(y=clip, sr=sample_rate)
    librosa.display.specshow(librosa.power_to_db(S, ref=np.max))
    filename = Path('<PATH>' + name + '.jpg')
    plt.savefig(filename, dpi=400, bbox_inches='tight',pad_inches=0)
    plt.close()    
    fig.clf()
    plt.close(fig)
    plt.close('all')
    del filename, name, clip, sample_rate, fig, ax, S


def preprocess_audio_segments(file):
    #original = AudioSegment.from_file('<PATH>', format="wav")
    final = AudioSegment.from_file(file, codec="opus")
    #original_three = original[-3000:]
    #one_second = segment[:1000]
    #final = original_three + one_second
    final.export('<PATH>', format="wav")


def preprocess_audio_first(file):
    audio = AudioSegment.from_file(file, codec="opus")
    print(audio.duration_seconds)
    aux = 0;
    i = 0;
    for i in range(int(audio.duration_seconds)):
        if i >= int(audio.duration_seconds):
            break
        final = audio[i*1000:(i+1)*1000]
        final.export('<PATH>' + str(i) + '.wav', format="wav")
        create_spectrogram('<PATH>' + str(i) + '.wav', 'audio' + str(i))
        img = open_image('images/audio' + str(i) + '.jpg')
        prediction = model.predict(img)
        if str(prediction[0]) == 'car_horn':
            print('instante: ' + str(i) + ' a ' + str(i))
            aux = aux + 1
            average = average + max(prediction[2]*100)
    print('aux: ' + str(aux))
    print('average: ' + str(average/aux))
    #end = 4000
    #final = audio[:end]
    #final.export('<PATH>', format="wav")


print(" * Loading Model...")
np.random.seed(42)
model = load_learner('/kaggle/working/')
print(" * Model loaded!")
defaults.device = torch.device('cuda')


@app.route('/predict', methods=['POST'])
@cross_origin(origin='localhost',headers=['Content- Type','Authorization'])
def predict():
    response = "nothing"
    file = request.files['file']
    segment = request.form['segment']
    print(segment + '\n')
    if str(segment) == "first":
        print("** FIRST **")
        preprocess_audio_segments(file)
    else:
        print("** SEGMENT **")
        preprocess_audio_segments(file)
    create_spectrogram('<PATH>', 'audio0')
    img = open_image('images/audio0.jpg')
    prediction = model.predict(img)
    if max(prediction[2]*100) > 60:
        response = str(prediction[0])
        print("maior que 60%")
    print("** RESPONSE: **")
    print(response)
    return response
