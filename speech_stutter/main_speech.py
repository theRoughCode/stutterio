import speech_recognition as sr
from requests_toolbelt import MultipartEncoder
import requests
import simplejson as json
from pydub import AudioSegment
import librosa
import numpy as np
import matplotlib.pyplot as plt
import subprocess
from AudioML import main_ml
import re
import operator
import os
import shutil


def getNextSuccess(my_list,iter):
	i = iter

	while(my_list[i]["case"] != "success"):
		i = i + 1

		if(i == len(my_list)):
			return "No Next"

	if (my_list[i]["case"] == "success"):
		return my_list[i]["alignedWord"]

def ManualTranscriptProcessing(google_transcript , real_transcript):
	Manual_answer = []
	#print(real_transcript)
	#print(google_transcript)
	for k in google_transcript.split("\n"):
		print(re.sub(r"[^a-zA-Z0-9]+", ' ', k))
	for k in real_transcript.split("\n"):
		print(re.sub(r"[^a-zA-Z0-9]+", ' ', k))
	# google_transcript_dict = makeAdict(google_transcript)
	# real_transcript_dict = makeAdict(real_transcript)
	google_transcript_list1 =  [word for word in list(google_transcript.split(" "))]
	real_transcript_list1 = [word for word in list(real_transcript.split(" "))]
	google_transcript_list2 = [(i,word) for i,word in enumerate(list(google_transcript.split(" ")))]
	real_transcript_list2 = [(i,word) for i,word in enumerate(list(real_transcript.split(" ")))]
	real_transcript_lower = [x.lower() for x in real_transcript_list1]
	google_transcript_lower = [x.lower() for x in google_transcript_list1]
	for i in real_transcript_lower:
		if i in google_transcript_lower:
			google_transcript_lower.remove(i)
	print google_transcript_lower
	return google_transcript_lower

def startProcessing(filename , real_transcript):
	sound = AudioSegment.from_wav(filename)

	# obtain path to "english.wav" in the same folder as this script
	from os import path
	AUDIO_FILE = path.join(path.dirname(path.realpath(__file__)), "output.wav")
	os.mkdir("new_data")

	# UNCOMMENT THIS LATER.......
	# file = open("transcript.txt","wr");
	# use the audio file as the audio source
	r = sr.Recognizer()
	with sr.AudioFile(AUDIO_FILE) as source:
	    audio = r.record(source)  # read the entire audio file

	print("read the audio...");
	file = open("transcript.txt", 'w');
	file.write(real_transcript)
	file.close()

	# UNCOMMENT THIS LATER.......
	#recognize speech using Google Cloud Speech
	GOOGLE_CLOUD_SPEECH_CREDENTIALS = r"""{
	  "type": "service_account",
	  "project_id": "aerial-garden-180805",
	  "private_key_id": "fcf316d02cc2f24c6305702970fb7275505cb87a",
	  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDEZXX6Lb1YGmC3\nbIyE0JO/VE4u5mSv9eRfWf7bJrhr8AmtmoOhp2I/TepS1q31dn8lha1kAIL15h4P\n4wtO0NwtqYicNDGuj987Qg2BAwpnKrvtF60hBxvIUr5v4m1d0bwTc9XK4zuYXp/X\n8K1/hXe8F9nmiVQOOdJgwFttHX1x27KzOhzsGT1DDrbipGF8yE6YX/XZqi2sMjEi\n5RE5fphMezyib3Mjs4rmSDfkr1DZNxysNhT9E/GRBsyFY0AKrDnYLsCLPY4aFR+b\nCFFfukmeBQlWDPcziZLhHLZenJfbelXcTm/yNdqLW7aWTnsADdu3LBJfRjdydj8O\nXz6RHhJlAgMBAAECggEACbPFPhyUdvwLgJCw2uIs+XwHjWnry8wBs8/6hTiDFYUb\nDUr/jrvrxBq6VwVskZ6AnBDDfCYtNaBSCfuotC8hJB106Evsdtft6onnb6g42mY5\nVT2LlJ1JHrBLxEHIZ7MQaK8pG0RoapDBsnAdHaiUr4crOhn1rc5058l6tzmk5jvp\n8mnwvia9QX8dkugsKXj5blmeLtKjroHfUBWDQgWXAs+v/OloLgsycSkbFqlKLdDY\ntQidVbmulAXqlAH3F9/j0vBukP7YFhSoupClSOrUFrFREDpp9EEr107Pu7WxA3bA\nIayNpiUU1GWRfI1/ZTOZDjhervwVU1l36RseEOaRzwKBgQDiiw9Wixdg5aLQ00Ho\nLOUNbK1Ig6z/CelQc6ePUFjBdooQQHN2UBAuHI9Q/T151yIK5YViYz+PpQS9jrAH\nqsrErbTlzePuPAZRXQRF6CufxyjY6ba1L04Gg28wDGfDi9khrHnASoFyJG++T63z\nZpK9gEnIXbxP+TNhyoRsT152PwKBgQDd7ucJ3OUSwFO6bcwo1mFn/r4Ph1xWxKv3\nqHMYP2ZJuFGey2Xwfb8T7UYf2VX3iHBazG67fc543e8T8B3ASsUpOkmXFTfEWe3Q\nJylAKIIoGItoMxiSn+CuBntKJG0PyUfuEOCqihQ1VBorY89N2Dp5mouS4rBWt9yl\nGxiVd7d2WwKBgQDbLxA3+3szFPricINjz4wN4QgHEN9gIobKgBuuXV6CT95kuvb7\nkZsWAivngBzqtWsKf+b9umjU4iQkAtntkSF+CVLsxLey2ACE2Co6ONd8T4UF2Zoc\n0xf61U/OfTIn0DbUjbt+gJediANVbmIvDR8MmgLJCWgZOFKuWvKkmGYcoQKBgQCQ\nV1DsmT5jc7MBDWg7JzMy7/utHdxwknlGGcjBfHqKd9ad8KvcPeyIiUmSbUf8NkDc\nzRk32BrxgWZ9ES5IYljY94/lM2eRzOte9hleIPqGGXCR1Kmms1Tt2klVb1t/aOnf\nbBqy0BtUk95xWfj6KCff7yPX5JfLzskymOzkSXiJAQKBgEsVYIzlG5aCq8Ci0h46\nyta4UT0CJTk4mSXwK9Mmbncyy5o9KTvDN08lQ82704y6qywyUJrCZJZyqa0tYM7s\nhhj67ZDVx6ZygagvJB6ie1986jZLY/IVF9ejviEvBWZhK7ylyqPkekoUdgPdoKAz\nPrQNZZjS9M99rsvZJisL97Va\n-----END PRIVATE KEY-----\n",
	  "client_email": "aerial-garden-180805@appspot.gserviceaccount.com",
	  "client_id": "112745149054864286993",
	  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
	  "token_uri": "https://accounts.google.com/o/oauth2/token",
	  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
	  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/aerial-garden-180805%40appspot.gserviceaccount.com"
	}
	"""
	try:
	    print("Google Cloud Speech recognition results:")
	    #file = open("transcript.txt", 'w');
	    the_result = r.recognize_google_cloud(audio, credentials_json=GOOGLE_CLOUD_SPEECH_CREDENTIALS)
	    print(the_result)  # pretty-print the recognition result
	    # file.write(the_result)
	    # file.close()
	except sr.UnknownValueError:
	    print("Google Cloud Speech could not understand audio")
	except sr.RequestError as e:
	    print("Could not request results from Google Cloud Speech service; {0}".format(e))

	### This API call is not working right now...
	try:
		result = subprocess.check_output(['curl -F "audio=@output.wav" -F "transcript=@transcript.txt" "http://localhost:8765/transcriptions?async=false"'], stderr=open('/dev/null', 'w'), shell=True)
	except subprocess.CalledProcessError as e:
	    raise RuntimeError("command '{}' return with error (code {}): {}".format(e.cmd, e.returncode, e.output))

	#filename="align.json"
	datastore = json.loads(result)
	print(result)

	Manual_answer = ManualTranscriptProcessing(real_transcript,the_result)

	print("Manual Answer  : ", Manual_answer )

	# if filename:
	#     # Writing JSON data
	#     with open(filename, 'rw') as f:
	#         datastore = json.load(f)

	words = datastore["words"]

	my_list = []
	not_found_in_audio = []

	for i in words:
		case = i["case"]
		if case == "success":
			startTime = i["start"]*1000
			endTime = i["end"]*1000
			alignedWord = i["alignedWord"]
			my_list.append({ "alignedWord" : alignedWord, "startTime" : startTime, "endTime": endTime, "case": case})
		elif(case == "not-found-in-transcript"):
			startTime = i["start"]*1000
			endTime = i["end"]*1000
  			my_list.append({ "startTime" : startTime, "endTime": endTime, "case": case})
		else:
			not_found_in_audio.append(i["word"])

	my_list[0]["startTime"] = 0

	List_of_Audio_Words = []
	for i in my_list:
		if(i["case"] == "not-found-in-transcript"):
			List_of_Audio_Words.append([sound[i["startTime"] : i["endTime"]],1])
		else:
			List_of_Audio_Words.append([sound[i["startTime"] : i["endTime"]],0])

	List_of_files = []
	for i, chunk in enumerate(List_of_Audio_Words):
		filename = "new_data/chunk{0}"
		fail = "Failure"
		exten = ".wav"
		if(chunk[1] == 1):
			filename = filename + fail
		Final_name = filename + exten
		out_file = Final_name.format(i)
		print "exporting", out_file
		List_of_files.append(out_file)
		chunk[0].export(out_file, format="wav")

	print("Successfully chopped up all the files.")

	List_of_stutter_iter = []
	for i in List_of_files:
		if "Failure" in i:
			result = main_ml.ML_Predictor("./" + i)
			List_of_stutter_iter.append(int((re.findall('\d+', i))[0]))
			if not(result == "ERROR"):
				print result[2][int(result[0])]
				print result
		print List_of_stutter_iter

	List_of_stutter_words = []
	List_of_stutter_words += not_found_in_audio
	List_of_stutter_words += Manual_answer
	for i in List_of_stutter_iter:
		if (i != len(List_of_files)):
			ans = getNextSuccess(my_list,i)
			List_of_stutter_words.append(ans)
	shutil.rmtree("./new_data")
	return list(set(List_of_stutter_words))












