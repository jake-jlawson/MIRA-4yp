import couchdb
import os, shutil
from abc import ABC, abstractmethod
import typing, json, os, abc, re

# Database global values
username = "4yp-admin"
password = "1150611016"
host = "localhost:5984"

datasets_path = "D:/4YP/Datasets"

from modules.ProcessingTypes import *


""" DATASETSDB:
    - Provides a singleton class for connecting to the CouchDB server
    - Provides a method that retrieves all current datasets in the server
"""
class DatasetsDB:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(DatasetsDB, cls).__new__(cls)

            cls.server = couchdb.Server('http://' + host)
            cls.server.resource.credentials = (username, password) #authenticate database server

        return cls._instance

    def getList(self):

        all_databases = []
        for db_name in (self.server):
            all_databases.append(db_name)

        return all_databases
    


""" DATASET CLASS:
    - Contains reference to a particular database containing the dataset (ds)
    - Calls construction methods for creating new datasets 
"""
class Dataset:

    # CONSTRUCTOR
    def __init__(self, dataset_name):
        self.ds_server = couchdb.Server('http://' + host)
        self.ds_server.resource.credentials = (username, password) #authenticate database server

        # define dataset metadata
        self.name = dataset_name
        self.ds_path = os.path.join(datasets_path, self.name) #path to dataset folder in filesystem

        # provide access to a dataset manager
        self.manager = DatasetManager(self)

        # control creation/loading of a dataset
        if (self.name) in (self.ds_server):
            self.db = self.__getDataset() #get dataset if it already exists
        else:
            self.db = self.__createDataset() #create a new dataset if it does not already exist

        
    # RETRIEVE THE DATASET FROM COUCHDB
    def __getDataset(self):
        return (self.ds_server[self.name])
    
    # CREATE A NEW DATABASE IN COUCHDB CORRESPONDING TO THIS DATASET
    def __createDataset(self):
        os.makedirs(self.ds_path) #make dataset folder in filesystem
        
        ds = (self.ds_server).create(self.name) #creates database for dataset in couchdb
        return ds
    
    # RETRIEVE ALL DATA FROM DATASET AS A JSON OBJECT
    def getData(self):
        all_docs = [doc for doc in self.db]
        documents = [self.db[doc_id] for doc_id in all_docs]

        return json.dumps([doc for doc in documents])


    # DELETE DATASET
    def delete(self):
        (self.ds_server).delete(self.name) #delete database in couch db

        os.rmdir(self.ds_path)

        del self
    


""" DATASET MANAGER:
    - Provides general tools and methods for querying datasets
    - Provides general tools and methods for modifying datasets
"""
class DatasetManager:
   
    def __init__(self, dataset):
        self.dataset = dataset

    def add_song(self, song): #adds a song to the dataset as a new document
    
        # Sub-folders to create for a specific song
        subfolders = ["audioData", "features", "groundTruths"]

        # Add song to dataset file system
        try:
            song_folder_path = os.path.join((self.dataset).ds_path, song.title)
            os.mkdir(song_folder_path) #create song folder
            song.path = song_folder_path

            #create subfolders
            for subfolder in subfolders:
                subfolder_path = os.path.join(song_folder_path, subfolder)
                os.mkdir(subfolder_path)

            #copy audio file into correct directories and change song attributes based on this
            original_location = song.audioFile
            originalName = os.path.basename(original_location)
            newName = "main" + os.path.splitext(originalName)[1]
            new_location = os.path.join(song_folder_path, "audioData", newName)

            shutil.copy(original_location, new_location)

            song.audioData["main"] = new_location

        except:
            print("Directory could not be made! Song already added")

        # Add song to database as a document entry
        doc_id, doc_rev = (self.dataset).db.save(song.data())

    def get_song(self, song_id):
        new_song = SongSource()
        
        return new_song.load(self.dataset.db, song_id)



""" DATASET BUILDER:
    - Provides different implementations for creating different types of datasets from different sources
    - FileDatasetBuilder: Builds and returns a new dataset from a folder full of song mp3s or wav files
    - APIDatasetBuilder: Builds and returns a new dataset from an API that retrieves songs from the internet
"""
class DatasetBuilder(ABC):

    def build(self, name: str) -> Dataset:
        
        db = DatasetsDB()

        # check if there is already a database with that name
        if (name) in db.server:
            raise ValueError("Dataset with specified Name already exists! Cannot build new dataset with this name!")

        new_dataset = Dataset(name)
        self.populate(new_dataset)

        return new_dataset

    @abstractmethod
    def populate():
        return
    

class FileDatasetBuilder(DatasetBuilder):
    def __init__(self, files_loc: str):
        super().__init__()
        self.files_loc = files_loc

    def populate(self, dataset: Dataset):
        
        for file_name in os.listdir(self.files_loc):
            file_path = os.path.join(self.files_loc, file_name)

            songToAdd = Song(file_source=file_path)

            (dataset.manager).add_song(songToAdd)



""" SONG CLASS:
    - Defines a song which is an element of a dataset
    - The song provides a predefined loose schema
"""
class Song:
    def __init__(self, ds_source="", file_source=""):
        
        if (ds_source != ""): #initialise based on database source (a JSON object)
            return
        elif (file_source != ""): #initialise based on a file source (a wav or mp3 file)
            
            # song info parsed directly from file path
            title = os.path.basename(file_source)
            self.title = os.path.splitext(title)[0]
            self.path = ""

            info = parse_song_info_from_file(file_source)
            self.artists = info["artists"]
            self.name = info["name"]
            self.fts = info["fts"]
            self.dwIndicator = info["dwIndicator"]

            # additional fields
            self.audioFile = file_source
            self.metadata = {}
            self.audioInfo = {}

            self.audioData = {
                "main": file_source
            }
            self.features = {}
            self.groundTruths = {}
            
        else:
            return
        
    def data(self):
        return self.__dict__
    

def parse_song_info_from_file(filePath):

    fileTitle = os.path.basename(filePath)
    songTitle = os.path.splitext(fileTitle)[0]


    # Parses a string of artists to return an array containing those artists
    def parseArtists(artistsStr):
        artists = re.findall(r'(?:[^,&]+)', artistsStr)

        return [artist.strip() for artist in artists]


    # PExtracts "features" from a given song title
    def findFeatures(songTitle): 
        fts = []
        titleWithoutFeatures = songTitle

        # match parts of the song title that list features
        regex = r'\(feat\. (.*?)\)|\(ft\. (.*?)\)|feat\. (.*?)[^-]*|ft\. (.*?)[^-]*|\(featuring\. (.*?)[^-]*|featuring\. (.*?)[^-]*'
        regex_matches = re.finditer(regex, songTitle, re.IGNORECASE)


        for match in regex_matches:
            matched_text = match.group(0)
            titleWithoutFeatures = songTitle.replace(matched_text, "") #get title with features removed
            titleWithoutFeatures = titleWithoutFeatures.strip()

            #clean up features text (remove "feat.", remove whitespace, etc.)
            matched_text = re.sub(r'[\[\](){}]', "", matched_text, flags=re.IGNORECASE)

            matched_text = re.sub(r'feat\.|ft\.|featuring\.', "", matched_text, flags=re.IGNORECASE)
            matched_text = matched_text.strip()


            fts = fts + parseArtists(matched_text) #parse artists and add to the fts array

        return [titleWithoutFeatures, fts]
    

    # Retrieves the artist array and the name of the song
    def parseParts(songTitle): 

        songParts = songTitle.split("-")
        artists = songParts[0].strip()
        title = songParts[1].strip()

        return [parseArtists(artists), title]


    # Finds and indicates that the song is a derivative work
    def findDerivativeWorks(songTitle):
        
        cover_regex = r'[([{].*?\bcover\b.*?[)\]}]'
        remix_regex = r'[([{].*?\bremix\b.*?[)\]}]'

        titleWithoutDWs = songTitle
        dwIndicator = [False, {}]


        # Find covers
        cover_matches = re.finditer(cover_regex, songTitle, re.IGNORECASE)

        if any(cover_matches):
            isCover = True #set isCover to true

            cover_matches = re.finditer(cover_regex, songTitle, re.IGNORECASE)

            for match in cover_matches:
                cover_text = match.group(0)

                titleWithoutDWs = titleWithoutDWs.replace(cover_text, "") #get title with cover removed
                titleWithoutDWs = titleWithoutDWs.strip()

                #get original artist from cover description
                original_artist = re.sub(r'[()\[\]{}]', '', cover_text)
                original_artist = re.sub(r'cover', '', original_artist)
                original_artist = original_artist.strip()


            [_, original_song] = parseParts(titleWithoutDWs)

            dwIndicator = [isCover, {
                "type": "cover",
                "og_song": original_song,
                "og_artist": original_artist
            }]
        else:
            isCover = False


        # Find remixes
        remix_matches = re.finditer(remix_regex, songTitle, re.IGNORECASE)
        if any(remix_matches):
            isRemix = True

            remix_matches = re.finditer(remix_regex, songTitle, re.IGNORECASE)

            for match in remix_matches:
                remix_text = match.group(0)
                print("Remix Text is: " + remix_text)

                titleWithoutDWs = titleWithoutDWs.replace(remix_text, "") #get title with cover removed
                titleWithoutDWs = titleWithoutDWs.strip()

                #get original artist from cover description
                original_artist = re.sub(r'[()\[\]{}]', '', cover_text)
                original_artist = re.sub(r'cover', '', original_artist)
                original_artist = original_artist.strip()


            [_, original_song] = parseParts(titleWithoutDWs)

            dwIndicator = [isCover, {
                "type": "cover",
                "og_song": original_song,
                "og_artist": original_artist
            }]
        else:
            isRemix = False

        return [titleWithoutDWs, dwIndicator]
    

    [songTitle, fts] = findFeatures(songTitle)
    [songTitle, dwIndicator] = findDerivativeWorks(songTitle)
    
    [songArtists, songName] = parseParts(songTitle)

    return {
        "artists": songArtists,
        "name": songName,
        "fts": fts,
        "dwIndicator": dwIndicator
    }


    

