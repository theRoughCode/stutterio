import librosa
import librosa.display

def readFiles(num):
	audio_path_arr = []
	for i in range(num):
		audio_path = 'chunk'
		audio_path += str(i)
		audio_path += ".wav"
		audio_path_arr.append(audio_path)
	return audio_path_arr


readFiles(20)