import numpy as np
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func
from flask import Flask, jsonify, render_template
from models import create_classes
import os

#################################################
# Flask Setup
#################################################

app = Flask(__name__)

#################################################
# Database Setup
#################################################
from flask_sqlalchemy import SQLAlchemy
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', '') or "sqlite:///books.sqlite"

# Remove tracking modifications
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

Books = create_classes(db)

#################################################
# Flask Routes
#################################################

@app.route("/")
def welcome():
    """List all available api routes."""
    return render_template("index.html")

@app.route("/dashboard/")
def thedata():
    """List all available api routes."""
    return render_template("dashboard.html")    

@app.route("/api/v1.0/archvisdata")
def arch():

    results = db.session.query(Books.publisher, func.count(Books.primary_isbn_13), func.avg(Books.average_rating)).group_by(Books.publisher).order_by(func.count(Books.primary_isbn_13)).all()

    authors_publishers = []

    for publisher, count, avg in results:

        link_dict = {}
        link_dict["source"]=publisher
        link_dict["target"]=count
        link_dict["avg"]=round(avg, 2)
        authors_publishers.append(link_dict)
   
    return jsonify(authors_publishers)



@app.route("/api/v1.0/wordcloudvisdata")
def wordcloud():

    results = db.session.query(Books.description).all()

    descriptions = list(np.ravel(results))

    return jsonify(descriptions)

@app.route("/api/v1.0/scattervisdata")
def scatterplot():

    results = db.session.query(Books.title, Books.average_rating, Books.weeks_on_list, Books.rating_count, Books.author).all()

    scatter_data = []

    for title, avg_rt, wol, rt_cnt, author in results:

        scatter_dict = {}
        scatter_dict["title"]=title
        scatter_dict["rating"]=avg_rt
        scatter_dict["weeks"]=wol
        scatter_dict["count"]=rt_cnt
        scatter_dict["author"]=author
        scatter_data.append(scatter_dict)

    return jsonify(scatter_data)

@app.route("/api/v1.0/adelavisdata")
def dropdown():

    results = db.session.query(Books.title, Books.description, Books.author, Books.publisher).all()

    title_data = []
    for title, descriptions, author, publisher in results:
        table_dict = {}
        table_dict["title"] = title
        table_dict["descriptions"] = descriptions
        table_dict["author"] = author
        table_dict["publisher"] = publisher
        title_data.append(table_dict)
    return jsonify(title_data)

@app.route("/api/v1.0/adelavisscatterdata")
def scatterdata():

    results = db.session.query(Books.weeks_on_list, Books.title, Books.whole_rating).all()

    scatter_data = []
    for weeks_on_list, title, whole_rating in results:
        scatter_dict = {}
        scatter_dict["weeks_on_list"] = weeks_on_list
        scatter_dict["title"] = title
        scatter_dict["whole_rating"] = whole_rating
        scatter_data.append(scatter_dict)
    return jsonify(scatter_data)

@app.route("/api/v1.0/scatter")
def scatter():
    return render_template("dashboard.html")

if __name__ == '__main__':
    app.run(debug=True)
