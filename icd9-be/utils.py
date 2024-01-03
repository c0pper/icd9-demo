from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import hashlib


def get_cosine_similarities(question: str, texts: list):
    # Calculate TF-IDF vectors for question and content values
    vectorizer = TfidfVectorizer()
    tfidf_matrix = vectorizer.fit_transform([question] + texts)

    # Calculate cosine similarity
    cosine_similarities = cosine_similarity(tfidf_matrix[0], tfidf_matrix[1:])
    sim_answ_pair = [{"text": text, "similarity": sim} for text, sim in zip(texts, cosine_similarities[0])]

    return sim_answ_pair


def get_most_similar_text(sim_answ_pair):
    return max(sim_answ_pair, key=lambda x: x.get("similarity", 0))["text"]


def get_input_context(retriever, domanda, k):
    retrieved = retriever.similarity_search_with_relevance_scores(domanda, k=k)
    sources = [{"text": i[0].page_content, "metadata": i[0].metadata, "score": i[1]} for i in retrieved]

    prompt_data = []
    for i in retrieved:
        data_string = f"ESTRATTO:\n {i[0].page_content}"
        prompt_data.append(data_string)
    input_context = "\n##################\n".join(prompt_data)

    return input_context, sources


def calculate_md5(input_string):
    md5_hash = hashlib.md5()
    input_bytes = input_string.encode('utf-8')
    md5_hash.update(input_bytes)
    return md5_hash.hexdigest()


def min_max_scaling(value, min_value, max_value, new_min, new_max):
    return ((value - min_value) / (max_value - min_value)) * (new_max - new_min) + new_min
