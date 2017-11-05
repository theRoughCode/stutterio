from pyAudioAnalysis import audioTrainTest as aT
from pydub import AudioSegment
import os

def ML_Predictor(filename):
	statinfo = os.stat(filename)
	file_size = statinfo.st_size
	file_size = file_size / 1000
	if(file_size < 10):
		return "ERROR"
	else:
		result = aT.fileClassification(filename, "AudioML/svmSMtemp","svm")
		return result

