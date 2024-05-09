import os
import typing, json, os, abc, re
from couchdb.mapping import Document, TextField, IntegerField, ListField, DictField, BooleanField
import librosa
import numpy as np

import simplejson as json


class Audio():
    def __init__(self, audio_file_source, mono=False, sr=44100, duration=None):
        self.source_path = audio_file_source
        
        if (mono == True):
            self.source, self.sr = librosa.load(self.source_path, sr=sr, mono=True, duration=duration)
        else:
            self.source, self.sr = librosa.load(self.source_path, sr=sr, duration=duration)


    def threshold(self, value):
        peak = np.max(np.abs(self.source))

        threshold = value * peak
        mask = self.source < threshold

        self.source[mask] = 0

        return self


    # TRANSMIT METHOD - Returns data in type that can be sent to the frontend
    def transmit(self, args):
        
        pps = args.get("pps", None) #check if a pps value is provided
        
        if pps is None:
            sample_rate = self.sr
            audio_data = self.source
            
        else:
            sample_rate = pps
            audio_data = librosa.resample(self.source, orig_sr=self.sr, target_sr=sample_rate)


        # Get feature information
        info = {
            "sample_rate": sample_rate,
            "duration": librosa.get_duration(y=audio_data, sr=sample_rate) 
        }

        return [audio_data.tolist(), info]


    # FORMAT METHOD - Returns type data in a format that can be stored in the database
    def format(self):
        return self.source_path
    

    def mono_src(self):
        return librosa.to_mono(self.source)
    
    
    
class MIDI():
    def __init__(self):
        return
    

# SONG CLASS - Represents a particular song for processing
class SongSource(Document):
    
    #Song Info
    title = TextField() #full song title
    path = TextField() #path to song file
    artists = ListField(TextField()) #artists list
    name = TextField() #song name

    fts = ListField(TextField()) #features list
    dwIndicator = ListField(BooleanField(), DictField())

    #Additional Song Fields
    audioFile = TextField()
    metadata = DictField()
    audioInfo = DictField()

    #Song Data
    audioData = DictField()
    features = DictField()
    groundTruths = DictField()


    def srcAudio(self, **kwargs):
        audioDataFile = self.audioData["main"]
        return Audio(audioDataFile, **kwargs)
    

    def vocalsAudio(self, **kwargs):
        if "vocals" not in self.audioData:
            raise ValueError("Error: 'vocals' data does not exist.")

        audioDataFile = self.audioData["vocals"]
        return Audio(audioDataFile, **kwargs)


    def getAudio(self, audio_type):
        if audio_type not in self.audioData:
            raise ValueError("Error: Audio data does not exist.")

        audioDataFile = self.audioData[audio_type]
        
        return Audio(audioDataFile)


    def getFeature(self, feature):
        print(feature, flush=True)
        
        if feature not in self.features:
            raise ValueError("Error: Feature does not exist.")
        
        feature_packet = self.features[feature]
        print(feature_packet, flush=True)
        feature_type = feature_packet["type"]
        feature_path = feature_packet["data"]

        print(feature_path, flush=True)


        feature_object = globals()[feature_type](path=feature_path)
        return feature_object


# MELODY CLASS - Represents a melody
class Melody():

    def __init__(self, midi=[], contour=[], path=""):
        
        print(path, flush=True)

        # instantiate object from path
        if path != "":
            f = open(path)
            data = json.load(f)
            print(json.loads(data["times"]), flush=True)
            print(json.loads(data["contour"]), flush=True)

            self.times = json.loads(data["times"])
            self.contour = json.loads(data["contour"])

        else:
            #Melody Data
            self.MIDI = midi
            self.times = contour[0]
            self.contour = contour[1]


    def format(self):
        
        data = {
            "times": json.dumps(self.times.tolist(), allow_nan=True),
            "contour": json.dumps(self.contour.tolist(), allow_nan=True)
        }
        
        info = {
            "some_info": ""
        }
        
        return [data, info]
    

    def transmit(self, args):
        return self.format()
    

# TIME SERIES CLASS - Represents a time series
class TimeSeries():
    def __init__(self, times=[], timeSeriesData=[], path=""):
        self.data = timeSeriesData
        self.times = times

        if path != "":
            f = open(path)
            data = json.load(f)
            self.data = np.array(data["data"])
            self.times = np.array(data["times"])


    def format(self):

        data = {
            "times": self.times.tolist(),
            "data": self.data.tolist()
        }
    
        info = {}

        return [data, info]
    

    def transmit(self, args):
        return self.format()

    

# TIMESTAMPS CLASS - Represents time stamps
class TimeStamps():
    def __init__(self, timeStamps):
        self.data = timeStamps
        
        return
    
    
