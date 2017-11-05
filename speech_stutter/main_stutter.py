from pydub import AudioSegment
import librosa
from pydub.silence import split_on_silence
import numpy as np
import matplotlib.pyplot as plt
import librosa.display
import main_lib as libFile

AudioSegment.ffmpeg = "/absolute/path/to/ffmpeg"

audio_path = 'output.wav'

sound = AudioSegment.from_wav("output.wav")
hop = 1*1000

full_length = len(sound)
chopped_sound_arr = []

y, sr = librosa.load(audio_path)
print librosa.effects.split(y,40)

# def rmse(x):
#     return np.sqrt(np.mean(x**2))

# frame_length=2048
# hop_length=256

# for i in range(0,full_length,hop):
# 	chopped_sound_arr.append(sound[i:i+hop])

# print(chopped_sound_arr)
# print(len(chopped_sound_arr))

# for i, chunk in enumerate(chopped_sound_arr):

#     out_file = "chunk{0}.wav".format(i)
#     print "exporting", out_file
#     chunk.export(out_file, format="wav")


# path_arr = libFile.readFiles(len(chopped_sound_arr))

# for i in path_arr:
# 	y, sr = librosa.load(i)
# 	#print("Sr : ", sr)
# 	#plt.semilogy([rmse(frame) for frame in y])
# 	print(y.sum())

#plt.show()


# y_percussive = librosa.effects.hpss(y)
# y_percussive = np.asarray(y_percussive)
# new_y = librosa.core.to_mono(y_percussive)
# new_y = np.asarray(new_y)
# tempo, beats = librosa.beat.beat_track(y=new_y, sr=sr)

# print("Tempo : ", tempo)
# print("Beats : ",beats)


#D = librosa.stft(y)


# print(D.shape)
# librosa.display.specshow(librosa.amplitude_to_db(D,ref=np.max),y_axis='log', x_axis='time')
# plt.title('Power spectrogram')
# plt.colorbar(format='%+2.0f dB')
# plt.tight_layout()


# onset_frames = librosa.onset.onset_detect(y, sr=sr)
# print onset_frames
# onset_times = librosa.frames_to_time(onset_frames, sr=sr)
# print onset_times
# onset_samples = librosa.frames_to_samples(onset_frames)
# print onset_samples
# clicks = librosa.clicks(times=onset_times, length=len(y))
# #ipd.Audio(y+clicks, rate=sr)
# rate = 44100
# librosa.output.write_wav(
#     "out_int16.wav", (y+clicks), rate
# )


# frames = librosa.util.frame(y, frame_length=frame_length, hop_length=hop_length)
# print(frames)
# print(frames.shape)
# plt.semilogy([rmse(frame) for frame in frames.T])
# plt.show()


# plt.figure()
# plt.subplot(3, 1, 1)
# librosa.display.waveplot(new_y, sr=sr)
# plt.title('Monophonic')
# plt.show()

#file_handle = out.export("output.wav", format="wav")



# frames_per_second = out.frame_rate
# print("Frames per second : ", frames_per_second);

# audio_chunks = split_on_silence(out, 
#     # must be silent for at least half a second
#     min_silence_len=90,
#     # consider it silent if quieter than -16 dBFS
#     silence_thresh=-16
# )

# print(len(audio_chunks))



