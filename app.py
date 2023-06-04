from flask import Flask, render_template, request, url_for
import multical_const, utils

import json, os, yaml
from pathlib import Path
from rosbags.highlevel import AnyReader as bagReader
from datetime import datetime

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
    
@app.route('/api/load_cam_configs_files', methods=['GET'])
def load_cam_configs_files():
    files = utils.list_files(multical_const.dataset_path)
    cam_configs = []
    for file in files:
        if file["filename"].endswith(".yaml"):
            with open(file["filefolder"]+'/'+file["filename"],"r") as f:
                try:
                    cam_config = {"camera_model":"pinhole","distortion_coeffs":{},"distortion_model":"","intrinsics":{},"resolution":{}}

                    cam_config_src=yaml.load(f,Loader=yaml.FullLoader)
                    if cam_config_src["distortion_model"]=="plumb_bob":
                        cam_config["distortion_model"]="radtan"
                    elif cam_config_src["distortion_model"]=="equidistant":           
                        cam_config["distortion_model"]="equidistant"
                    else:
                        continue
                    cam_config["distortion_coeffs"] = cam_config_src["distortion_coefficients"]["data"][:4]
                    cam_config["intrinsics"] = [cam_config_src["camera_matrix"]["data"][i] for i in [0,4,2,5]]
                    cam_config["resolution"] = [cam_config_src["image_width"],cam_config_src["image_height"]]
                except:
                    continue
                else:
                    cam_configs.append({"config_name":file["filename"],"config_folder":file["filefolder"],"config":cam_config})

    return json.dumps(cam_configs)

@app.route('/api/start_task', methods=['POST'])
def start_task():
    folder = "/home/bowen/multical-web-playground/"
    task = json.loads(request.form["data"])

    task_folder = folder+str(datetime.now().strftime("%Y%m%d-%H%M%S"))
    os.mkdir(task_folder);

    # print(task)
    with open(task_folder+"/cameras.yaml",'w') as f:
        yaml.dump(task["cameras"],f,encoding='utf-8')
    if task["imus"].__len__()>0:
        with open(task_folder+"/imus.yaml",'w') as f:
            yaml.dump(task["imus"],f,encoding='utf-8')
    with open(task_folder+"/lidars.yaml",'w') as f:
        yaml.dump(task["lidars"],f,encoding='utf-8')
    with open(task_folder+"/target.yaml",'w') as f:
        yaml.dump(task["target"],f,encoding='utf-8')

    with open(task_folder+'/run.bash', 'w') as f:
        f.write("""
#/bin/bash
source /catkin_ws/devel/setup.bash
multical_calibrate_sensors --bag {0} --cams cameras.yaml {1} --lidars lidars.yaml --target target.yaml --no-time-calibration \
2>&1 | tee $1.log
""".format(task["cameras"]["cam0"]["rosbag"], "--imus imus.yaml" if task["imus"].__len__()>0 else ""))

    

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