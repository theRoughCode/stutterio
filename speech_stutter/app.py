#----------------------------------------------------------------------------#
# Imports

#----------------------------------------------------------------------------#

from flask import Flask, render_template, request
import requests
import logging
from logging import Formatter, FileHandler
import os
from main_speech import startProcessing
import pyrebase
import base64
import json
import subprocess
from flask_cors import CORS


#----------------------------------------------------------------------------#
# App Config.
#----------------------------------------------------------------------------#

app = Flask(__name__)
CORS(app)

config = {
  "apiKey": "AIzaSyC33Y85QzhPvfargKMOoJYSum1XUujo1bg",
  "authDomain": "stutterio-9a716.firebaseapp.com",
  "databaseURL": "https://stutterio-9a716.firebaseio.com",
  "projectId": "stutterio-9a716",
  "storageBucket": "stutterio-9a716.appspot.com",
  "messagingSenderId": "628025936739"
}

firebase = pyrebase.initialize_app(config)
auth = firebase.auth()
db = firebase.database()

@app.route('/')
def home():
    return "Hello World"


@app.route('/iterationComplete/<int:id>', methods=["POST"])
def iterationComplete(id):
    ###### Connect to firebase and fetch the mp3
    transcript_json = request.get_json()
    real_transcript = transcript_json["transcript"]
    payload = { 'id': id }
    try:
        r = requests.post("http://localhost:8000/getUser", data=payload)
        json_data = json.loads(r.text)
        my_mp3 = json_data["mp3"]
    except:
        print("Error : There was a problem with the User")
    # print(my_mp3)
    mymp3_64_decode = base64.decodestring(my_mp3)
    image_result = open('output.mp3', 'wb') # create a writable image and write the decoding result
    image_result.write(mymp3_64_decode)
    subprocess.call(['ffmpeg', '-i', './output.mp3', './output.wav', '-y'])
    ## save mp3 in the same folder and call the mp3 "output.wav"
    my_ans = startProcessing("output.wav" , real_transcript)
    os.remove("./output.wav")
    os.remove("./output.mp3")
    print(my_ans)
    return json.dumps(my_ans)





# @app.errorhandler(500)
# def internal_error(error):
#     #db_session.rollback()
#     return render_template('errors/500.html'), 500


# @app.errorhandler(404)
# def not_found_error(error):
#     return render_template('errors/404.html'), 404

# if not app.debug:
#     file_handler = FileHandler('error.log')
#     file_handler.setFormatter(
#         Formatter('%(asctime)s %(levelname)s: %(message)s [in %(pathname)s:%(lineno)d]')
#     )
#     app.logger.setLevel(logging.INFO)
#     file_handler.setLevel(logging.INFO)
#     app.logger.addHandler(file_handler)
#     app.logger.info('errors')

#----------------------------------------------------------------------------#
# Launch.
#----------------------------------------------------------------------------#

# Default port:
# if __name__ == '__main__':
#     app.run()

# Or specify port manually:

if __name__ == '__main__':
    print("Server is up.")
    port = int(os.environ.get('PORT', 5000))
    app.run(host='127.0.0.1', port=port)
