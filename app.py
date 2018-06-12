'''
Created on 12.06.2018

@author: paul
'''

import flask
app = flask.Flask(__name__)

@app.route("/<path:filename>")
def static_files(filename):
    return flask.send_from_directory(".", filename)
