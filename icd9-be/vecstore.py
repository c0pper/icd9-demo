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

def create_doc_list(text_list):
    doc_list = [Document(page_content=i["extract"], metadata={
        'icd9': i['icd9'], 
        'hierarchy': i['hierarchy'], 
        'label': i['label'], 
        'extract_start': i['extract_start'],
        'extract_end': i['extract_end']
    }) for i in text_list]
    return doc_list



