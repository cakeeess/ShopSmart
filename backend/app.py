from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import json
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

app = Flask(__name__)
CORS(app)  # Allow cross-origin requests from React (like localhost:3000)


app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///searches.db'
db = SQLAlchemy(app)

class Search(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    search_query = db.Column(db.String(200), nullable=False)
    min_price = db.Column(db.Integer, nullable=False)
    max_price = db.Column(db.Integer, nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

# Create the database table
with app.app_context():
    db.create_all()


DATA_FILE = os.path.join("data", "user_searches.json")
os.makedirs("data", exist_ok=True)

# Initialize file if not present
if not os.path.exists(DATA_FILE):
    with open(DATA_FILE, "w") as f:
        json.dump({}, f, indent=2)

@app.route("/")
def index():
    return "Welcome to ShopSmart"


@app.route("/save-search", methods=["POST"])
def save_search():
    data = request.get_json()

    new_search = Search(
        search_query=data["searchQuery"],
        min_price=int(data["minPrice"]),
        max_price=int(data["maxPrice"])
    )
    db.session.add(new_search)
    db.session.commit()

    if not(new_search):
        return jsonify({"error": "Missing fields"}), 400
    else:
        return jsonify({"message": "Search saved to database!"})


    # Read existing JSON
    # with open(DATA_FILE, "r") as f:
    #     all_data = json.load(f)

    # Update with new data
    # all_data[search_query] = [min_price, max_price]

    # Save back to file
    # with open(DATA_FILE, "w") as f:
    #     json.dump(all_data, f, indent=2)

    # return jsonify({"message": "Search saved", "data": all_data}), 200


@app.route("/get-searches", methods=["GET"])
def get_searches():
    searches = Search.query.order_by(Search.timestamp.desc()).all()
    result = [{
        "search_query": s.search_query,
        "min_price": s.min_price,
        "max_price": s.max_price,
        "timestamp": s.timestamp.isoformat()
    } for s in searches]

    return jsonify(result)

if __name__ == "__main__":
    app.run(debug=True)
