import json
import csv
from io import StringIO
from pathlib import Path

def process_thesaurus():
    files = list(Path("outputxvincenzo").glob("*.json"))
    data_pairs = []
    for file in files:
        with open(f"outputxvincenzo/{file.name}", 'r', encoding="UTF8") as file:
            output = json.load(file)["document"]

        text = output["content"]
        extractions = output.get("extractions", [])
        extradata = output["extraData"]

        out = []
        for extraction in extractions:
            concept_value = extraction['fields'][0]['value']
            if concept_value in extradata['thesaurusData']:
                extradata_item = extradata['thesaurusData'][concept_value]
                hierarchy = extradata_item.get('hierarchies', [{}])[0]#.split("/")
                label = extradata_item.get('labels', 'Label not found')[0]["value"]
                # hierarchy = "/".join(hierarchy[1:])
                uri = extradata_item.get('uri', 0)
                if uri:
                    icd9code = uri.split("/")[-1]
                out.append(icd9code + hierarchy)

        data = {'text': text}

        for i, tag in enumerate(out, start=2):  # Start index at 2 to leave space for the 'Text' column
            data[f'codice'] = [tag]
        data_pairs.append(data)

    strings = []
    for pair in data_pairs:
        text = pair["text"]
        tags = pair.get("codice", [])
        data_string = f"{text}#{'#'.join(tags)}".replace("\n", "").strip()
        strings.append(data_string)

    csv_data = "\n".join(strings)
    # Use StringIO to simulate a file-like object from the string
    input_data = StringIO(csv_data)

    # Initialize a CSV writer with '#' as the delimiter
    csv_writer = csv.writer(input_data, delimiter='#')

    # Read the lines from the string
    lines = input_data.readlines()
    with open('output.csv', 'w', newline='') as csv_file:
        csv_writer = csv.writer(csv_file)
        for line in lines:
            # Remove leading/trailing whitespaces and split using '#'
            data = [item.strip() for item in line.split('#')]
            csv_writer.writerow(data)


def process_lifescience():
    files = list(Path("outputls").glob("*.json"))
    rows = []
    for file in files:
        print("\n\n\n#########")
        print(file.name)
        with open(f"outputls/{file.name}", 'r', encoding="UTF8") as file:
            output = json.load(file)

        text = output["sections"][0]["text"]
        extractions = output["sections"][0]["cogito_extraction"]
        outputs = []
        for k, v in extractions.items():
            for value in v:
                icd9, icd10 = "", ""
                key = list(value.keys())[0]
                if value[key].get("props"):
                    for prop in value[key]["props"]:
                        if prop.get("name") in ["ICD10", "ICD10CM"]:
                            icd10 = prop.get("value")
                        if prop.get("name") in ["ICD9", "ICD9CM"]:
                            icd9 = prop.get("value")
                if icd9 and icd10:
                    string = f"{k}: {value[key]['base']} - ICD9: {icd9} - ICD10: {icd10}"
                elif icd9:
                    string = f"{k}: {value[key]['base']} - ICD9: {icd9}"
                elif icd10:
                    string = f"{k}: {value[key]['base']} - ICD10: {icd10}"
                else:
                    string = f"{k}: {value[key]['base']}"
                
                outputs.append(string)

        data_string = f"{text}#{'#'.join(outputs)}"
        rows.append(data_string)
        print(data_string)
        

    csv_data = "\n".join(rows)
    input_data = StringIO(csv_data)

    # Initialize a CSV writer with '#' as the delimiter
    csv_writer = csv.writer(input_data, delimiter='#')

    # Read the lines from the string
    lines = input_data.readlines()
    with open('output_ls.csv', 'w', newline='', encoding="UTF8") as csv_file:
        csv_writer = csv.writer(csv_file)
        for line in lines:
            # Remove leading/trailing whitespaces and split using '#'
            data = [item.strip() for item in line.split('#')]
            csv_writer.writerow(data)

    


process_lifescience()