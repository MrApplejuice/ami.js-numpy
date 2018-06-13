'''
Created on 12.06.2018

@author: paul
'''

import numpy as np
import flask
import io
import base64
app = flask.Flask(__name__)

@app.route("/numpy/<string:name>")
def get_numpy_array(name):
    array = np.zeros([10, 10, 10], dtype=np.int16)
    array -= 1000
    array[5:6, 5:6, 1:8] = 1000
    
    mem_file = io.BytesIO()
    np.save(mem_file, array)
    mem_file.seek(0)
    
    response = flask.Response(
        base64.b64encode(mem_file.read()),
        content_type="text/plain")
    return response 


@app.route("/<path:filename>")
def static_files(filename):
    return flask.send_from_directory(".", filename)

