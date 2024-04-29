import os
import typing, json, os, abc, re
from couchdb.mapping import Document, TextField, IntegerField, ListField, DictField, BooleanField
import librosa
import numpy as np


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

        return self.source


    # FORMAT METHOD - Returns type data in a format that can be stored in the database
    def format(self):
        return self.source_path
    
    
    
class MIDI():
    def __init__(self):
        return
    

# SONG CLASS - Represents a particular song for processing
class SongSource(Document):
    
    #Song Info
    title = TextField() #full song title
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


# MELODY CLASS - Represents a melody
class Melody():

    def __init__(self, midi=[], contour=[]):
        
        #Melody Data
        self.MIDI = midi
        self.contour = contour


    def format(self):
        return "Melody Data"
    
    
    
    
