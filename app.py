from flask import Flask, render_template, request, url_for
import multical_const, utils

import json, os
from pathlib import Path
from rosbags.highlevel import AnyReader as bagReader

app = Flask(__name__)

@app.route('/')
def hello():
    return render_template('home.html', const_phrases=multical_const.const_phrases)

@app.route('/api/search_bags', methods=['GET'])
def search_bags():
    files = utils.list_files(multical_const.dataset_path)
    bags = []
    for file in files:
        if file["filename"].endswith(".bag"):
            bags.append({
                "bag_name":file["filename"],
                "bag_folder":file["filefolder"],
                "bag_size":utils.getFileSize(file)
                })
    return json.dumps(bags)

@app.route('/api/analyze_bag', methods=['POST'])
def analyze_bag():
    with bagReader([Path(os.path.join(request.form['filefolder'], request.form['filename']))]) as reader:
        connections = [{"bag_index":request.form['index'],"topic_index":x.id,"topic":x.topic,"msgtype":x.msgtype} for x in reader.connections if x.msgtype in ["sensor_msgs/msg/Imu",
                                                                                                                                                               "sensor_msgs/msg/CompressedImage",
                                                                                                                                                               "sensor_msgs/msg/Image",
                                                                                                                                                               "sensor_msgs/msg/PointCloud2"]]
        for connection in connections:
            if connection["msgtype"]=="sensor_msgs/msg/PointCloud2":
                connection["sensor_type"] = "lidar"
            elif connection["msgtype"] in ["sensor_msgs/msg/CompressedImage", "sensor_msgs/msg/Image"]:
                connection["sensor_type"] = "camera"
            elif connection["msgtype"]=="sensor_msgs/msg/Imu":
                connection["sensor_type"] = "imu"
        return json.dumps(connections)
    

# @app.route('/login', methods=['POST', 'GET'])
# def login():
#     error = None
#     if request.method == 'POST':
#         if valid_login(request.form['username'],
#                        request.form['password']):
#             return log_the_user_in(request.form['username'])
#         else:
#             error = 'Invalid username/password'
#     # the code below is executed if the request method
#     # was GET or the credentials were invalid
#     return render_template('login.html', error=error)