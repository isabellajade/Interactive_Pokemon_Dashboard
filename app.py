import numpy as np
import pymongo

# import sqlalchemy
# from sqlalchemy.ext.automap import automap_base
# from sqlalchemy.orm import Session
# from sqlalchemy import create_engine, func

from flask import Flask, jsonify
from flask_cors import CORS

import json
from pprint import pprint

url = "https://raw.githubusercontent.com/fanzeyi/pokemon.json/master/pokedex.json"

#pokemonDataResponse = requests.get(url)

client = pymongo.MongoClient("mongodb+srv://admin:project123@tccedxproject3group3.kbc4ahv.mongodb.net/pokemon_data?retryWrites=true&w=majority")
db = client["pokemon_data"]

pokemonData = list(db["pokemon_collection"].find())

#################################################
# Database Setup
#################################################
# engine = create_engine("sqlite:///titanic.sqlite")

# # reflect an existing database into a new model
# Base = automap_base()
# # reflect the tables
# Base.prepare(autoload_with=engine)

# # Save reference to the table
# Passenger = Base.classes.passenger

#################################################
# Flask Setup
#################################################
app = Flask(__name__)
CORS(app)


#################################################
# Flask Routes
#################################################

@app.route("/")
def welcome():
    """List all available api routes."""
    return (
        f"Available Routes:<br/>"
        f"/api/v1.0/type_counts<br/>"
    )


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
    # Create our session (link) from Python to the DB
    # session = Session(engine)

    # """Return a list of all passenger names"""
    # # Query all passengers
    # results = session.query(Passenger.name).all()

    # session.close()

    # # Convert list of tuples into normal list
    # all_names = list(np.ravel(results))

    # return jsonify(all_names)


# @app.route("/api/v1.0/passengers")
# def passengers():
#     # Create our session (link) from Python to the DB
#     session = Session(engine)

#     """Return a list of passenger data including the name, age, and sex of each passenger"""
#     # Query all passengers
#     results = session.query(Passenger.name, Passenger.age, Passenger.sex).all()

#     session.close()

#     # Create a dictionary from the row data and append to a list of all_passengers
#     all_passengers = []
#     for name, age, sex in results:
#         passenger_dict = {}
#         passenger_dict["name"] = name
#         passenger_dict["age"] = age
#         passenger_dict["sex"] = sex
#         all_passengers.append(passenger_dict)

#     return jsonify(all_passengers)


if __name__ == '__main__':
    app.run(debug=True)
