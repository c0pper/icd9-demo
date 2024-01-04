import json

with open("test_sanita_sandbox2.json", "r", encoding="UTF8") as f:
    platform_out = json.loads(f.read())["document"]


text = platform_out["content"]
extractions = platform_out["extractions"]
extradata = platform_out["extraData"]
tokens = platform_out["tokens"]

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

        for r in extradata_item["relations"]:
            if r["uri"] == "http://www.expertsystem.com/cogito-schema#hasDate":
                # print(label, r["concept_uri"], "\n\n\n")
                pass

    date_node = "2514616"
    if concept_value == date_node:
        for p in extraction['fields'][0]["positions"]:
            print(text[p["start"]:p["end"]+1])
        print("\n\n")