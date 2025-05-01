from serpapi import GoogleSearch
import json
import re
from dotenv import load_dotenv
import os

load_dotenv()
api_key = os.getenv('API_KEY')

def search_prod(query):
    params = {
      "engine": "google_shopping",
      "q": query,
      "api_key": api_key,
      "tbm": "shop",
      "gl":"in"
    }
    search = GoogleSearch(params)
    rslt = search.get_dict()
    return rslt

def send_query(query):
    print("received query for "+query)
    results = search_prod(query)
    if "shopping_results" in results:
        return results["shopping_results"]
    else:
        print(f"No results found for query: {query}")
        return []  # Return an empty list if no results found

# Extract and filter the title, price, product link, and seller name for each product within the price range
def display_result(results,price_range):
    print(f"max_price received as : {price_range[1]}")
    print(f"min_price received as : {price_range[0]}")
    max_price = price_range[1]
    min_price = price_range[0]
    filtered_products = []
    for product in results:
        title = product.get("title")
        price = product.get("price")
        link = product.get("product_link")
        seller = product.get("source")

        # Extract numeric value from price string
        if isinstance(price, str) and price:  # Check if price is a valid string
            price_match = re.search(r'[\d,.]+', price)  # Match numeric values
            price_value = float(price_match.group().replace(',', '').strip()) if price_match else 0.0
        else:
            price_value = 0.0  # Default value if price is not valid

        if price_value <= max_price and price_value > min_price:
            filtered_products.append({
                "title": title,
                "price": int(price_value),  # Store as an integer value
                "link": link,
                "seller": seller
            })
    if filtered_products:
        print(f"Products found")
    return filtered_products

def save_results_to_json(filtered_products):
    # Load existing data if the file exists
    try:
        with open('api_results.json', 'r') as json_file:
            existing_data = json.load(json_file)
    except FileNotFoundError:
        existing_data = []

    # Append new results to existing data
    existing_data.extend(filtered_products)

    # Save the updated results to the JSON file
    with open('api_results.json', 'w') as json_file:
        json.dump(existing_data, json_file, indent=4)

def main():
    query = {"one plus 6T": [20000.00 , 40000.00], "apple watch series 9": [30000.00 , 40000.00]}
    all_filtered_products = []  # List to accumulate all filtered products
    for p in query:
        results = send_query(p)
        filtered_products = display_result(results, query[p])
        all_filtered_products.extend(filtered_products)  # Accumulate filtered products
    # Save all filtered products to JSON once after processing all queries
    save_results_to_json(all_filtered_products)

main()
