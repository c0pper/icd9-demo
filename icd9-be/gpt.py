import json
import os
import random
import time
import traceback
from openai import OpenAI
from dotenv import load_dotenv
import requests
from utils import get_input_context


load_dotenv()

model = "gpt-3.5-turbo-1106"
client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY"),
)


def ask_chatGPT_map_bodyparts(output_body_parts):
    prompt = f"""
### Instructions
Map each of the following body parts to the CLOSEST relevant element from the supported body parts list and use exclusively parts from the supported body parts list:
{output_body_parts}

### Example
{{"torace": "chest", "encefalo": "head", ...}}

### Answer:
"""
    print("\n\n******** " + prompt)

    response = client.chat.completions.create(
        seed=69420,
        model=model,
        messages=[
            {
                "role": "system",
                "content": "Always reply with valid json. You will map the provided body parts to their closest body part in this supported body parts list: [head, chest, stomach, left_shoulder, left_arm,	left_hand, right_shoulder, left_leg_lower, right_arm, right_hand, left_leg_upper, left_foot, right_leg_upper, right_leg_lower, right_foot]."
            },
            {
                "role": "user",
                "content": prompt,
            }
        ],
    )

    response_text = response.choices[0].message.content
    full_response = {}
    full_response["status"] = True
    full_response["content"] = response_text
    full_response["source"] = "gpt-api"
    full_response["prompt"] = prompt,
    # full_response["gpt_response"] = response

    return full_response


def ask_chatGPT(retriever, instruction, k):
    input_context, retrieved = get_input_context(retriever, instruction, k=k)
    prompt = "Usa i seguenti estratti da documenti medici per rispondere alla domanda. " \
                    "\n\n### Input:\n" + input_context + "\n\n### Domanda:\n" + instruction + "\n\n### Risposta:\n"
    print("\n\n******** " + prompt)

    response = client.chat.completions.create(
        # seed=69420,
        model=model,
        messages=[
            {
                "role": "system",
                "content": "Sei un assistente esperto di documentazione medica. Rispondi in maniera più esaustiva possibile."
            },
            {
                "role": "user",
                "content": prompt,
            }
        ],
    )

    response_text = response.choices[0].message.content
    full_response = {}
    full_response["status"] = True
    full_response["content"] = response_text
    full_response["source"] = "elmi-api"
    full_response["prompt"] = prompt,
    full_response["sources"] = retrieved
    # full_response["gpt_response"] = response

    return full_response



def ask_ELMI(retriever, instruction, k):

    input_context, retrieved = get_input_context(retriever, instruction, k=k)
    elmi_model = "elmi"

    url = 'https://elmilab.expertcustomers.ai/'+elmi_model+'/generate'
    hed = {f"Authorization': 'Bearer {os.getenv('ELMI_APIKEY')}"}

    prompt = "### TEXT:\n" + input_context + "\n\n" \
             "### TASK:\nUsa gli estratti forniti sopra per rispondere alla domanda seguente.\n\n" \
             "### QUESTION:\n" + instruction + "\n\n" \
             "### ANSWER:\n"
    print("\n\n******** " + prompt)


    data = {
      "text": prompt,
       "input": "",
       "instruction": "",
       "max_length": 300,
        "num_beams": 2,
        "use_beam_search": True,
        "stream": False
    }


    full_response={
        "status": False,
        "source": "",
        "content": ""
    }

    try:
        response = requests.post(url, json=data, headers=hed)
        if response.status_code == 200:
            response_text = json.loads(response.text)
            full_response["status"] = True
            full_response["content"] = response_text
            full_response["source"] = "elmi-api"
            full_response["prompt"] = prompt,
            full_response["sources"] = retrieved
    except Exception as e:
        traceback.print_exc()
        print("error with elmi request!", e, "\n\n\n")

    return full_response



# def run_gpt(input, instruction):

#     global gpt_made_calls
#     gpt_model = "gpt-3.5-turbo-0301"

#     url = 'https://api.openai.com/v1/chat/completions'
#     hed = {"Authorization': 'Bearer os.getenv('OPENAI_API_KEY')"}

#     data = {
#         "model": gpt_model,
#         "messages":"",
#         "max_tokens": 300,
#         "temperature": 0.1
#     }

#     prompt_messages = [{"role": "system","content": "Sei un esperto di documentazione medica."}]

#     prompt = "Usa i seguenti estratti da documenti medici per rispondere alla domanda. " \
#                     "\n\n### Input:\n" + input + "\n\n### Domanda:\n" + instruction + "\n\n### Response:\n"

#     prompt_messages.append({"role": "user","content": prompt})
#     data["messages"] = prompt_messages

#     full_response={
#         "status": False,
#         "source": "",
#         "content": ""
#     }

#     try:
#         # cache_name = calculate_md5(str(data))
#         # gtp_cache_file = "elmi/cache-elmi/"+gpt_model+"/"+cache_name+".cache"
#         gpt_to_be_cached = False
#         # if os.path.exists(gtp_cache_file):
#         #     with open(gtp_cache_file, "r", encoding='UTF8') as cacheFile:
#         #         full_response["status"] = True
#         #         full_response["content"] = cacheFile.read()
#         #         full_response["source"] = "gpt-cache"
#         # else:
#         time.sleep(random.uniform(0.1, 1.5))
#         response = requests.post(url, json=data, headers=hed)
#         # gpt_made_calls+=1

#         if response.status_code==200:
#             json_resp = json.loads(response.text)
#             full_response["status"] = True
#             full_response["content"] = json_resp["choices"][0]["message"]["content"]
#             full_response["source"] = "gpt-api"

#             #print("out json:" +str(json_resp))
#             gpt_to_be_cached = True
#             print("\n\n\n##########\n[ALERT] another GPT invocation was made! ["+str(gpt_made_calls)+"]\n############\n\n\n")
#         else:
#             print("\n\n\n##########\n[[ALERT]  GPT error ["+str(response.status_code)+"] ["+str(response.reason)+"]\n############\n\n\n")

#         # if gpt_to_be_cached and not os.path.exists(gtp_cache_file):
#         #     with open(gtp_cache_file, 'w', encoding='UTF8') as f:
#         #         print(str(full_response["content"]), file=f)

#     except:
#         traceback.print_exc()
#         print("error with json resp (prompt:)")

#     #gpt_answers = extract_gpt_answers(resp_content)

#     return full_response
