import os
import typing, json, os, abc, re
from couchdb.mapping import Document, TextField, IntegerField, ListField, DictField, BooleanField


class Audio():
    def __init__(self, audio_file_source):
        self.source = audio_file_source
    
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
    
    
    
    
