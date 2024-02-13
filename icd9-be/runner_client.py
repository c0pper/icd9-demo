import requests
import json

url = "http://localhost:8087/analyze"

headers = {
    "Accept": "*/*",
    "Content-Type": "application/json",
}

def get_essex_analysis(text):
    data = {
        "projectId": "automazione",
        "text": text,
        "analysis": [
            "ENTITIES",
            "DISAMBIGUATION",
            "RELATIONS",
            "CATEGORIES",
            "SENTIMENT",
            "RELEVANTS",
            "EXTRACTIONS"
        ],
        "features": [
            "DEPENDENCY_TREE",
            "POSITIONS_SYNCHRONIZATION",
            "KNOWLEDGE",
            "EXTRA_DATA",
            "EXTERNAL_IDS"
        ]
    }

    response = requests.post(url, json=data, headers=headers)

    if response.status_code == 200:
        response_json = response.json()
        with open("output.json", "w", encoding="utf8") as f:
            json.dump(response_json, f, indent=4)
        return response_json
    else:
        print("Error:", response.status_code)