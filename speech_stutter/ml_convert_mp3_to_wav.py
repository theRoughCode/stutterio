from pydub import AudioSegment
import glob
filenames = glob.glob("../AudioML/classifierData/normal/*")
for i in filenames:
	print i
	sound = AudioSegment.from_file(i, format="mp3")
	#file_handle = sound.export(i, format="wav")