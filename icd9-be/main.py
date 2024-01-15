from flask import Flask, request, jsonify
import gpt
from flask_cors import CORS
from ingest import get_retriever, process_platform_output
import json
from dateutil import parser
import os
import re


app = Flask(__name__)
CORS(app)


def get_body_parts_and_instances(json_ouput):
    result_list = []
    for extraction in json_ouput.get("rules", {}).get("extraction", []):
        for field in extraction.get("fields", []):
            field_value = field.get("value")

        instances_count = extraction.get("instances")

        # Create a dictionary with the extracted information
        extracted_info = {
            "field_value": field_value,
            "instances": instances_count
        }

        # Append the dictionary to the result list
        result_list.append(extracted_info)
    sorted_result_list = sorted(result_list, key=lambda x: x["instances"], reverse=True)
    return sorted_result_list


@app.route('/api/get_timeline_dates', methods=['POST'])
def get_timeline_dates():
    text = request.json.get('text').replace("	", "  ")
    
    if not text:
        return jsonify({"error": "Missing 'text' in the request payload"}), 400
    
    print("Getting timeline dates\n-----------------------------")
    response = gpt.ask_chatGPT_dates(text)["content"]
    # response = """'- Ricovero del 4.09.07 al 15.09.07 per intervento chirurgico di asportazione di disco intervertebrale - Settembre 2007\n- Ricovero dal 07.01.08 al 12.01.08 presso la SOD Medicina del Dolore e Palliativa a causa di radicolopatia all\'arto inferiore destro post-laminectomia - Gennaio 2008\n- Visita presso l\'U.O. di Neurochirurgia dell\'Ospedale di Bergamo per "indispensabile intenso trattamento fisioterapico" - 15 gennaio 2008'"""
#     response = """
# - Ricovero del 4.09.07 al 15.09.07 per intervento chirurgico di asportazione di disco intervertebrale
# - Ricovero dal 07.01.08 al 12.01.08 per radicolopatia post-laminectomia
# - Visita presso l'U.O. di Neurochirurgia dell'Ospedale di Bergamo il 15.01.08, con prescrizione di terapia fisioterapica
# """

    events_list = [line.strip() for line in response.split('\n') if line.strip()]
    
    events_with_year = []
    events_no_year = []
    for event in events_list:
        event_dict = {}
        parts = event.split(' - ')
        if len(parts) == 2:
            key, date_str = parts
            # try:
                # year = parser.parse(date_str).year
            event_dict["event"] = key
            match = re.search(r'\b\d{4}\b', date_str)
            if match:
                year = match.group(0)
                event_dict["year"] = year
                events_with_year.append(event_dict)
            else:
                event_dict["year"] = date_str
                events_no_year.append(event_dict)

        else:
            date_pattern = re.compile(r'\b\d{1,2}\.\d{1,2}\.(\d{2,4})\b')
            matches = date_pattern.findall(event)
            if matches:
                first_match_year = matches[0]
                event_dict["year"] = first_match_year
                event_dict["event"] = event
                events_with_year.append(event_dict)
            else:
                event_dict["event"] = event
                event_dict["year"] = 'Formato non valido'
                events_no_year.append(event_dict)

    sorted_events_with_year = sorted(events_with_year, key=lambda x: x['year'])

    print(f"repsonse\n{response}\n")
    print(f"w/year\n{sorted_events_with_year}\n")
    print(f"no/year\n{events_no_year}\n")

    return jsonify({"events_with_year": sorted_events_with_year, "events_no_year": events_no_year})


@app.route('/api/process_platform_output', methods=['POST'])
def process_platform_output_route():
    platform_out = request.json.get('platform_out')
    
    if not platform_out:
        return jsonify({"error": "Missing 'platform_out' in the request payload"}), 400
    
    print("Processing platform output")
    full_processed = process_platform_output(platform_out)
    return jsonify(full_processed)


@app.route('/api/process_body_parts', methods=['POST'])
def process_body_parts_route():
    #  da fare la richiesta
    # body_parts_out = request.json.get('platform_out')
    print("Processing body_parts_out")
    with open("icd9-be/output_parti_del_corpo.json", "r", encoding="UTF8") as j:
        body_parts_out = json.loads(j.read())["match_info"]
    
    if not body_parts_out:
        return jsonify({"error": "Missing 'body_parts_out' in the request payload"}), 400
    
    sorted_result_list = get_body_parts_and_instances(body_parts_out)
    return jsonify(sorted_result_list)


@app.route('/api/map_body_parts_to_body', methods=['POST'])
def map_body_parts_to_body():
    #  da fare la richiesta
    # body_parts_out = request.json.get('platform_out')
    print("Mapping body_parts to body")
    with open("icd9-be/output_parti_del_corpo.json", "r", encoding="UTF8") as j:
        body_parts_out = json.loads(j.read())["match_info"]
    
    if not body_parts_out:
        return jsonify({"error": "Missing 'body_parts_out' in the request payload"}), 400
    
    sorted_result_list = get_body_parts_and_instances(body_parts_out)
    response = gpt.ask_chatGPT_map_bodyparts((", ".join([x["field_value"] for x in sorted_result_list])))
    try:
        json_body_parts = json.loads(response["content"])
        return jsonify(json_body_parts)
    except json.decoder.JSONDecodeError as e:
        print(f"Error: {e}")
        return jsonify({"error": e})



@app.route('/api/ask_question', methods=['POST'])
def ask_question():
    full_processed = request.json.get('full_processed_platform_out', {})
    llm = request.json.get('llm', {})
    number_of_contexts = int(request.json.get('number_of_contexts', 10))

    if not full_processed:
        return jsonify({"error": "Missing processed platform output in the request payload"}), 400
    if not llm:
        return jsonify({"error": "Missing llm in the request payload. Must be either 'ELMI' or 'ChatGPT'"}), 400
    
    retriever = get_retriever(full_processed)
    question = request.json.get('question')
    
    if not question:
        return jsonify({"error": "Missing 'question' in the request payload"}), 400

    if llm == "chatgpt":
        print("Asking ChatGPT")
        answer = gpt.ask_chatGPT(retriever, question, k=number_of_contexts)
        # answer= answer.response.choices[0].message.content
    elif llm == "elmi":
        print("Asking ELMI")
        answer = gpt.ask_ELMI(retriever, question, k=number_of_contexts)

    # Return the response as JSON
    return jsonify(answer)


if __name__ == '__main__':
    app.run(debug=True)