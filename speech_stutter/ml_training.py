from pydub import AudioSegment
import librosa
from pydub.silence import split_on_silence
import numpy as np
import matplotlib.pyplot as plt
import librosa.display
import main_lib as libFile

for j in range(25):
	sound = AudioSegment.from_wav("chunk1.wav")
	sound = sound[:2]
	for i in range(10):
		sound += sound
	sound = sound.apply_gain(-50)
	sound.export("silence{0}.wav".format(j), format="wav")

# milisecond_silence = AudioSegment.silent(duration=10000,frame_rate=30000)

# sound = sound.overlay(milisecond_silence , gain_during_overlay=-100)



# for i in range(50):
# 	ten_second_silence = AudioSegment.silent(duration=100000,frame_rate=30000)
# 	ten_second_silence =  ten_second_silence
# 	





