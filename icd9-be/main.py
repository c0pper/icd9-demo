from flask import Flask, request, jsonify
import gpt
from flask_cors import CORS
from ingest import get_retriever, process_platform_output

app = Flask(__name__)
CORS(app)


@app.route('/api/process_platform_output', methods=['POST'])
def process_platform_output_route():
    platform_out = request.json.get('platform_out')
    
    if not platform_out:
        return jsonify({"error": "Missing 'platform_out' in the request payload"}), 400
    
    print("Processing platform output")
    full_processed = process_platform_output(platform_out)
    return jsonify(full_processed)

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