#!/bin/bash
curl -F "audio=@output.wav" -F "transcript=@transcript.txt" "http://localhost:8765/transcriptions?async=false"
