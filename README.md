<img src="https://challengepost-s3-challengepost.netdna-ssl.com/photos/production/software_photos/000/563/312/datas/gallery.jpg" />

# Stutter.io
Stutter.io is a web app that employs speech recognition and machine learning to detect stuttered speech from voice.  Once trained on a user, it can predict words that the user will stutter on, given an input text.  It will also provide the user with synonyms that they can scroll through to replace the original word.

# How It Works
The user is given a sample text to read through.  We use JavaScript's native Web Speech API to parse the voice audio and extract the words.  This audio file is then sent to the back-end machine learning algorithm for processing and detecting where the stutter(s) occurs.  The results are then used to create a profile for the user containing commonly-stuttered words.  Once the profile has been created, the user can choose to upload any text which the app will look through and highlight possible stuttered words using the trained user profile.  It will also use the Words API to retrieve synonyms for each highlighted words.

# Tech Stack
The front-end is written in Handlebars, CSS, and JavaScropt.<br />
The server is written in Node.js with Express.js and hosted on Google App Engine.<br />
The database is stored on Google's Firebase.<br />
The machine learning algorithm is written in Python and utilizes the scikit-learn library.

# Links
[Website](https://stutterio-9a716.appspot.com/)<br />
[Devpost](https://devpost.com/software/stutterio)
