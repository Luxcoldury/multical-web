from flask import Flask, render_template, request, url_for
import multical_const, utils
import json, os

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
    os.path.join(request.form['filefolder'], request.form['filename'])


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