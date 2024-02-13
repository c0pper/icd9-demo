from langchain_core.documents.base import Document
from langchain.embeddings import OpenAIEmbeddings
from langchain.vectorstores import Chroma
import os

persist_directory = "db"

def create_retriever(docs, vs_identifier, embedding_function=OpenAIEmbeddings()):
    vs_directory = f"{persist_directory}/{vs_identifier}"

    if os.path.exists(vs_directory):
        print(f"Directory {vs_directory} exists. Using existing vectordb")
        db = Chroma(persist_directory=vs_directory, embedding_function=embedding_function)

    else:
        # pass
        print(f"Directory {vs_directory} does not exist. Creating new vectordb")
        db = Chroma.from_documents(docs, embedding_function, persist_directory=vs_directory)
        db.persist()

    return db

def create_doc_list(collections):
    all_extracts = []
    for c in collections:
        v_inst = c["vectorestore_instances"]
        icd9 = c["icd9"]
        label = c["label"]
        hierarchy = c["hierarchy"]
        for v in v_inst:
            start = v["extract_start"]
            end = v["extract_end"]
            all_extracts.append({
                'icd9': icd9, 
                'hierarchy': hierarchy, 
                'label': label, 
                'extract_start': start,
                'extract_end': end,
                "extract": v["extract"]
            })

    doc_list = [Document(page_content=i["extract"], metadata={
        'icd9': i['icd9'], 
        'hierarchy': i['hierarchy'], 
        'label': i['label'], 
        'extract_start': i['extract_start'],
        'extract_end': i['extract_end']
    }) for i in all_extracts]
    return doc_list



