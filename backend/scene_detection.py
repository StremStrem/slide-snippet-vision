import json
import os
import sys
import cv2
from scenedetect import detect, ContentDetector

input_data = json.loads(sys.stdin.read())
video_path = input_data['videoPath']
detection_type = input_data['detectionType']
gallery_path = input_data['gallery']

# threshold=30 means how sensitive it is to changes (higher = less sensitive)
scenes = detect(video_path, ContentDetector(threshold=30))

# Open video file
cap = cv2.VideoCapture(video_path)

scene_list = []
for i, (start, end) in enumerate(scenes):
    cap.set(cv2.CAP_PROP_POS_FRAMES, start.frame_num)
    ret, frame = cap.read()
    if ret:
        filename = f"frame_{i+1}.jpg"
        filepath = os.path.join(gallery_path, filename)
        cv2.imwrite(filepath, frame)
        scene_list.append({
            "start": start.frame_num,
            "end": end.frame_num,
            "image": filename  # just the filename; frontend can resolve full path
        })

cap.release()

print(json.dumps(scene_list))