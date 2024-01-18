import json
import re
from utils import replace_date
from dateutil import parser
from langchain.text_splitter import RecursiveCharacterTextSplitter


text_splitter = RecursiveCharacterTextSplitter(
    separators= [".\n", "\n\n", ". ", "\n", " ", ""],
    chunk_size=5000,
    chunk_overlap=0,
    length_function=len,
    is_separator_regex=False,
)


with open("icd9-be/test_sanita_sandbox2.json", "r", encoding="UTF8") as f:
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

    #     for r in extradata_item["relations"]:
    #         if r["uri"] == "http://www.expertsystem.com/cogito-schema#hasDate":
    #             # print(label, r["concept_uri"], "\n\n\n")
    #             pass

    # date_node = "2514616"
    # if concept_value == date_node:
    #     for p in extraction['fields'][0]["positions"]:
    #         print(text[p["start"]:p["end"]+1])
    #     print("\n\n")

if __name__ == "__main__":
    # split testing

    splits = text_splitter.split_text(text)
    splits



    # Place mock dates

    # nuovo_testo = re.sub(r'n data \*\*\*\*\*\*\*\*\*\*', replace_date, text, flags=re.IGNORECASE)
    # print(nuovo_testo.replace("\"", "\'").replace("\n", " "))

    # events_text = """
    #     intervento chirurgico di: 'Endoarteriectomia polmonare' - 2008
    #     intervento per cataratta bilaterale - 2005
    #     frattura basicervicale femorale sinistra e frattura XII costa destra - data non specificata
    #     embolia polmonare acuta complicata da ematoma sottodurale cronico - 14/10/2020
    #     insorgenza di edema polmonare acuto - data non specificata
    #     trauma cranico non commotivo con fibrillo-flutter atriale - data non specificata
    #     intervento chirurgico per cataratta bilaterale - data non specificata
    #     exeresi gozzo tiroideo - a 17 anni (data non specificata)
    #     intervento chirurgico per tunnel carpale destro - in giovane età (data non specificata)
    #     pregressa emorragia oculare occhio destro - data non specificata
    #     tonsillectomia - età giovanile (data non specificata)
    #     appendicectomia - età giovanile (data non specificata)
    #     comparsa di dispnea ingravescente a riposo - data non specificata
    #     ricovero presso il reparto di Cardiologia dell'Ospedale di Voghera - data non specificata
    #     TC del torace con riscontro di embolia polmonare bilaterale - data non specificata
    #     terapia anticoagulante orale con dicumarolico - data non specificata
    #     TC encefalo con riscontro di ematoma sottodurale cronico - 13/12/2021
    #     evacuazione dell'ematoma sottodurale - 13/12/2021
    #     valutazione specialistica in Malattie Tromboemboliche - data non specificata
    #     controllo Ecocolordoppler arti inferiori con presenza di trombosi instabile bilaterale - data non specificata
    #     reintroduzione terapia eparinica - data non specificata
    #     trasferimento presso il reparto di Neurologia dell'Ospedale di Voghera - data non specificata
    #     TC encefalo con permanenza di lieve falda ipodensa frontale sinistra - data non specificata
    #     edema polmonare acuto con successivo trasferimento presso il reparto di Rianimazione - data non specificata
    #     trasferimento presso la Casa di Cura di Villa Esperia (PV) per trattamento riabilitativo - data non specificata
    #     buon recupero della forza muscolare dell'emisoma destro e deficit funzionale spalla destra - data non specificata
    #     controlli seriati TC encefalo con permanenza di aree iperdense - data non specificata
    #     caduta accidentale con frattura basicervicale femorale sinistra e frattura XII costa destra - data non specificata
    #     Osteosintesi della frattura femorale sinistra - data non specificata
    #     trasferimento presso il reparto di Riabilitazione dell'Istituto 'Don Gnocchi' - data non specificata
    #     comparsa di dispnea ingravescente a riposo - data non specificata
    #     TC del torace con riscontro di occlusione completa dell'arteria polmonare - data non specificata
    #     terapia anticoagulante orale e persistenza di dispnea per sforzi lievi - data non specificata
    #     ricovero presso il reparto di Cardiologia dell'Ospedale di Voghera - data non specificata
    #     ripetizione TC del torace e Ecocardiogramma con evidenziazione di pressioni polmonari elevate - data non specificata
    #     trasferimento presso la Divisione per le cure del caso - data non specificata
    #     esame obiettivo con dispnea a riposo (classe funzionale WHO IV) - data non specificata
    #     episodi di tachiaritmie e fibrillazione atriale - data non specificata
    #     intervento chirurgico di 'Endoarteriectomia polmonare bilaterale' - 18/03/2007
    #     rimozione dei fili di stimolazione epicardica - 28/02/2015
    #     positività del tampone rettale per Klebsiella Pneumoniae - 17/07/2023
    # """.replace("\"", "\'")

    # events_list = [line.strip() for line in events_text.split('\n') if line.strip()]

    # events_with_year = []
    # events_no_year = []
    # for event in events_list:
    #     event_dict = {}
    #     parts = event.split(' - ')
    #     if len(parts) == 2:
    #         key, date_str = parts
    #         try:
    #             year = parser.parse(date_str).year
    #             event_dict["event"] = key
    #             event_dict["year"] = year
    #             events_with_year.append(event_dict)
    #         except ValueError:
    #             event_dict["event"] = key
    #             event_dict["year"] = date_str
    #             events_no_year.append(event_dict)
    #     else:
    #         event_dict["event"] = key
    #         event_dict["year"] = 'Formato non valido'
    #         events_no_year.append(event_dict)

    # sorted_events_with_year = sorted(events_with_year, key=lambda x: x['year'])
    # print(sorted_events_with_year)
    # print("\n\n\n")
    # print(events_no_year)