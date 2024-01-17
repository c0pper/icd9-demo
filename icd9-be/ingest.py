import json
import gpt
import vecstore
from utils import calculate_md5, min_max_scaling


def enrich_paragraph_or_sentence(token, platform_out, type_of_text: str):
    text = platform_out["content"]
    if type_of_text == "paragraph":
        paragraphs = platform_out["paragraphs"]
        
        #Individuazione paragraph
        paragraph_idx = token["paragraph"]
        paragraph_start = paragraphs[paragraph_idx]["start"]
        paragraph_end = paragraphs[paragraph_idx]["end"]
        paragraph = text[paragraph_start:paragraph_end]

        # Arricchimento paragraph con testo precedente fino al punto/accapo
        prev_text_reversed = []
        reversed_prev_text_full = list(reversed(text[:paragraph_start]))
        for idx, char in enumerate(reversed_prev_text_full):
            two_chars = reversed_prev_text_full[idx] + reversed_prev_text_full[idx+1] 
            if not two_chars in [" .", "\n.", "\n\n"]:
                prev_text_reversed.append(char)
            else:
                break
        prev_text = "".join(reversed(prev_text_reversed))
        paragraph = prev_text + paragraph

        # Arricchimento paragraph con testo successivo fino al punto/accapo
        next_text = []
        next_text_full = text[paragraph_end:]
        for idx, char in enumerate(next_text_full):
            two_chars = next_text_full[idx] + next_text_full[idx+1]
            if not two_chars in [". ", ".\n", "\n\n"]:
                next_text.append(char)
            else:
                break
        next_text = "".join(next_text)
        paragraph = paragraph + next_text + "."

        enriched_paragraph_start = text.find(paragraph)
        enriched_paragraph_end = enriched_paragraph_start + len(paragraph)

        return paragraph, enriched_paragraph_start, enriched_paragraph_end
    
    
    if type_of_text == "sentence":
        sentences = platform_out["sentences"]
        
        #Individuazione paragraph
        sentence_idx = token["sentence"]
        sentence_start = sentences[sentence_idx]["start"]
        sentence_end = sentences[sentence_idx]["end"]
        sentence = text[sentence_start:sentence_end]

        # Arricchimento paragraph con testo precedente fino al punto/accapo
        prev_text_reversed = []
        reversed_prev_text_full = list(reversed(text[:sentence_start]))
        for idx, char in enumerate(reversed_prev_text_full):
            two_chars = reversed_prev_text_full[idx] + reversed_prev_text_full[idx+1] 
            if not two_chars in [" .", "\n.", "\n\n"]:
                prev_text_reversed.append(char)
            else:
                break
        prev_text = "".join(reversed(prev_text_reversed))
        sentence = prev_text + sentence

        # Arricchimento paragraph con testo successivo fino al punto/accapo
        next_text = []
        next_text_full = text[sentence_end:]
        for idx, char in enumerate(next_text_full):
            try:
                two_chars = next_text_full[idx] + next_text_full[idx+1]
            except IndexError:
                two_chars = next_text_full[idx]
            if not two_chars in [". ", ".\n", "\n\n"]:
                next_text.append(char)
            else:
                break
        next_text = "".join(next_text)
        sentence = sentence + next_text + "."

        enriched_sentence_start = text.find(sentence)
        enriched_sentence_end = enriched_sentence_start + len(sentence)

        return sentence, enriched_sentence_start, enriched_sentence_end


def process_platform_output(platform_out):
    platform_out = platform_out["document"]
    text = platform_out["content"]
    extractions = platform_out["extractions"]
    extradata = platform_out["extraData"]
    tokens = platform_out["tokens"]
    paragraphs = platform_out["paragraphs"]
    main_sentences = platform_out["mainSentences"]
    patient_data_full = []
    patient_data_for_vectorstore = []  # Non contiene data point con estratti uguali in cui si verificano più estrazione, ma contiene solo estratti diversi
    
    topics = [i for i in platform_out["topics"] if i["score"] >= 0.8]
    scores = [entry['score'] for entry in topics]
    min_value = min(scores)
    max_value = max(scores)
    for entry in topics:
        entry['normalized_score'] = min_max_scaling(entry['score'], min_value, max_value, 0, 100)


    # #  Inserimento codici icd9 affianco estrazioni
    # added_text = 0
    # sorted_extractions = sorted(extractions, key=lambda x: x['fields'][0]['positions'][0]['end'])
    # uris_for_position = {}
    # for extraction in sorted_extractions:
    #     concept_value = extraction['fields'][0]['value']
    #     if concept_value in extradata['thesaurusData']:
    #         extradata_item = extradata['thesaurusData'][concept_value]
    #         uri = extradata_item.get('uri', 0).split("/")[-1]
    #         icd9_str = f'(Codice ICD-9: {uri})'
    #         positions = extraction['fields'][0]['positions']
    #         for p in positions:
    #             if not uris_for_position.get(p['end']):
    #                 uris_for_position[p['end']] = [uri]
    #             else:
    #                 uris_for_position[p['end']].append(uri)

    # for k, v in uris_for_position.items():
    #     icd9_codes = [f"{i};" for i in v]
    #     icd9_codes = f" (Codici ICD9: {' '.join(icd9_codes)})"
    #     text = f"{text[:k + added_text]}{icd9_codes}{text[k + added_text:]}"
    #     added_text += len(icd9_codes)


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

            if not label.lower() == "date":
                positions = extraction["fields"][0]["positions"]
                extraction_paragraphs = []
                extraction_sentences = []
                for pos in positions:
                    for t in tokens:
                        if pos["start"] == t["start"]:
                            if len(paragraphs) > 1:
                                paragraph, paragraph_start, paragraph_end = enrich_paragraph_or_sentence(t, platform_out, "paragraph")
                                extraction_paragraphs.append(paragraph)
                            else:
                                sentence, sentence_start, sentence_end = enrich_paragraph_or_sentence(t, platform_out, "sentence")
                                extraction_sentences.append(sentence)
                
                if len(paragraphs) > 1:
                    data_point = {
                            "icd9": icd9code,
                            "hierarchy": hierarchy,
                            "extract": "\n".join(extraction_paragraphs),
                            "extract_start": paragraph_start,
                            "extract_end": paragraph_end,
                            "label": label
                        }
                elif len(paragraphs) <= 1:
                    data_point = {
                            "icd9": icd9code,
                            "hierarchy": hierarchy,
                            "extract": "\n".join(extraction_sentences),
                            "extract_start": sentence_start,
                            "extract_end": sentence_end,
                            "label": label
                        }

                if patient_data_for_vectorstore:
                    if data_point["extract"] not in [i["extract"] for i in patient_data_for_vectorstore]:
                        patient_data_for_vectorstore.append(data_point)
                else:
                    patient_data_for_vectorstore.append(data_point)
                    
                patient_data_full.append(data_point)
                # print(f"CODICE ICD-9: {data_point['icd9']}\nGERARCHIA ICD-9: {data_point['hierarchy']}\nESTRATTO:\n {data_point['extract']} \n\n##################\n ")
        else:
            print(f"Concept {concept_value} not found in extradata")

    patient_data_full = sorted(patient_data_full, key=lambda x: x["extract_start"])
    patient_data_for_vectorstore = sorted(patient_data_for_vectorstore, key=lambda x: x["extract_start"])
    md5 = calculate_md5(text)

    full_processed = {
        "text": text,
        "patient_data_full": patient_data_full,
        "patient_data_for_vectorstore": patient_data_for_vectorstore,
        "main_sentences": main_sentences,
        "topics": topics,
        "md5": md5
    }

    with open("processed_platform_output.json", "w", encoding="UTF8") as f:
        json.dump(full_processed, f, indent=4)

    return full_processed


def get_retriever(full_processed_platform_out):
    # full_processed = process_platform_output(platform_out)
    docs = vecstore.create_doc_list(full_processed_platform_out["patient_data_for_vectorstore"])
    retriever = vecstore.create_retriever(docs, vs_identifier=full_processed_platform_out["md5"])
    return retriever


if __name__ == "__main__":
    
    # domanda = "Quali interventi chirurgici ha subito questo paziente?"
    # full_processed = process_platform_output(platform_out)
    # retriever = get_retriever(full_processed)
    # # response = gpt.ask_chatGPT(retriever, domanda)
    # response = gpt.ask_ELMI(retriever, domanda, k=10)


    # print(response.choices[0].message.content)
    # print(response["content"])

    # with open('../icd9-demo/dummy-output-farmaci.json', 'r', encoding="UTF8") as file:
    with open('output.json', 'r', encoding="UTF8") as file:
        platform_out = json.load(file)
    process_platform_output(platform_out)

