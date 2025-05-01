from flask import Flask, request, jsonify
from flask_cors import CORS
from serpapi import GoogleSearch
import json
import re

app = Flask(__name__)
CORS(app)  # Allow React frontend to talk to this backend

SERP_API_KEY = "4e9f647b16dfb41ea8f762ea32fcdd25d104382d9e1fed6b7c9bcbc06e770570"

def search_product(query, min_price, max_price):
    params = {
        "engine": "google_shopping",
        "q": query,
        "api_key": SERP_API_KEY,
        "tbm": "shop"
    }

    search = GoogleSearch(params)
    results = search.get_dict()
    shopping_results = results.get("shopping_results", [])

    filtered_products = []

    for product in shopping_results:
        title = product.get("title")
        price = product.get("price")
        link = product.get("link")
        seller = product.get("source")

        # Extract price value
        price_match = re.search(r'[\d,.]+', price)
        price_value = float(price_match.group().replace(',', '')) if price_match else 0.0

        if min_price <= price_value <= max_price:
            filtered_products.append({
                "title": title,
                "price": price,
                "link": link,
                "seller": seller
            })

    # Overwrite JSON file with new data
    with open('api_results.json', 'w') as f:
        json.dump(filtered_products, f, indent=4)

    return filtered_products


@app.route('/search', methods=['POST'])
def handle_search():
    try:
        data = request.get_json()
        query = data.get('searchQuery')
        min_price = float(data.get('minPrice', 0))
        max_price = float(data.get('maxPrice', 999999))

        if not query:
            return jsonify({"error": "Missing searchQuery"}), 400

        products = search_product(query, min_price, max_price)
        return jsonify({"message": "Search complete", "count": len(products)}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)
