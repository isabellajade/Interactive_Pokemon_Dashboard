# import dependencies

import numpy as np

from flask import Flask, jsonify
from flask_cors import CORS

import json
from pprint import pprint
import requests

# assigning url

url = "https://raw.githubusercontent.com/fanzeyi/pokemon.json/master/pokedex.json"

# making get request

pokemonDataResponse = requests.get(url)

pokemonData = pokemonDataResponse.json()


# Flask Setup

app = Flask(__name__)
CORS(app)

# Flask Routes

@app.route("/")
def welcome():
    """List all available api routes."""
    return (
        f"Available Routes:<br/>"
        f"/api/v1.0/type_counts<br/>"
    )

# selecting pokemon types data
@app.route("/api/v1.0/type_counts")
def type_counts():
    typeDict = {}
    for pokemon in pokemonData:
        types = tuple(sorted(pokemon["type"]))
        typeDict[types] = typeDict.get(types,0) +1
    
    x = []
    y = []
    size = []
    for t,count in typeDict.items():
        if len(t) == 2:
            x.append(t[0])
            y.append(t[1])
        else:
            x.append(t[0])
            y.append(t[0])
        size.append(count)

    ret = {
        "x": x,
        "y": y,
        "size": size,
    }
    return ret
   


if __name__ == '__main__':
    app.run(debug=True)
