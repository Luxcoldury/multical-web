import os

def list_files(rootdir):
    files = []
    for filefolder,dirnames,filenames in os.walk(rootdir):
        for filename in filenames:
            files.append({"filefolder":filefolder,"filename":filename})
    return files

def getFileSize(file):
    return os.path.getsize(os.path.join(file["filefolder"], file["filename"]))