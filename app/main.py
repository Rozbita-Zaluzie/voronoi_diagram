
from unicodedata import category
from flask import Flask, jsonify, request, render_template
from flask_cors import CORS, cross_origin

app = Flask(__name__, template_folder='templates')
CORS(app, support_credentials=True)


@cross_origin(supports_credentials=True)
@app.route("/", methods=['GET'])
def home_view():
    return render_template('index.html')



