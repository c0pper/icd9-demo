import { Chrono } from 'react-chrono';

const Timeline = () => {
    const datedItems = [{'event': 'intervento per cataratta bilaterale', 'year': 2005}, {'event': "intervento chirurgico di 'Endoarteriectomia polmonare bilaterale'", 'year': 2007}, {'event': "intervento chirurgico di: 'Endoarteriectomia polmonare'", 'year': 2008}, {'event': 'rimozione dei fili di stimolazione epicardica', 'year': 2015}, {'event': 'embolia polmonare acuta complicata da ematoma sottodurale cronico', 'year': 2020}, {'event': 'TC encefalo con riscontro di ematoma sottodurale cronico', 'year': 2021}, {'event': "evacuazione dell'ematoma sottodurale", 'year': 2021}, {'event': 'positività del tampone rettale per Klebsiella Pneumoniae', 'year': 2023}]
    const nonDatedItems = [{'event': 'frattura basicervicale femorale sinistra e frattura XII costa destra', 'year': 'data non specificata'}, {'event': 'insorgenza di edema polmonare acuto', 'year': 'data non specificata'}, {'event': 'trauma cranico non commotivo con fibrillo-flutter atriale', 'year': 'data non specificata'}, {'event': 'intervento chirurgico per cataratta bilaterale', 'year': 'data non specificata'}, {'event': 'exeresi gozzo tiroideo', 'year': 'a 17 anni (data non specificata)'}, {'event': 'intervento chirurgico per tunnel carpale destro', 'year': 'in giovane età (data non specificata)'}, {'event': 'pregressa emorragia oculare occhio destro', 'year': 'data non specificata'}, {'event': 'tonsillectomia', 'year': 'età giovanile (data non specificata)'}, {'event': 'appendicectomia', 'year': 'età giovanile (data non specificata)'}, {'event': 'comparsa di dispnea ingravescente a riposo', 'year': 'data non specificata'}, {'event': "ricovero presso il reparto di Cardiologia dell'Ospedale di Voghera", 'year': 'data non specificata'}, {'event': 'TC del torace con riscontro di embolia polmonare bilaterale', 'year': 'data non specificata'}, {'event': 'terapia anticoagulante orale con dicumarolico', 'year': 'data non specificata'}, {'event': 'valutazione specialistica in Malattie Tromboemboliche', 'year': 'data non specificata'}, {'event': 'controllo Ecocolordoppler arti inferiori con presenza di trombosi instabile bilaterale', 'year': 'data non specificata'}, {'event': 'reintroduzione terapia eparinica', 'year': 'data non specificata'}, {'event': "trasferimento presso il reparto di Neurologia dell'Ospedale di Voghera", 'year': 'data non specificata'}, {'event': 'TC encefalo con permanenza di lieve falda ipodensa frontale sinistra', 'year': 'data non specificata'}, {'event': 'edema polmonare acuto con successivo trasferimento presso il reparto di Rianimazione', 'year': 'data non specificata'}, {'event': 'trasferimento presso la Casa di Cura di Villa Esperia (PV) per trattamento riabilitativo', 'year': 'data non specificata'}, {'event': "buon recupero della forza muscolare dell'emisoma destro e deficit funzionale spalla destra", 'year': 'data non specificata'}, {'event': 'controlli seriati TC encefalo con permanenza di aree iperdense', 'year': 'data non specificata'}, {'event': 'caduta accidentale con frattura basicervicale femorale sinistra e frattura XII costa destra', 'year': 'data non specificata'}, {'event': 'Osteosintesi della frattura femorale sinistra', 'year': 'data non specificata'}, {'event': "trasferimento presso il reparto di Riabilitazione dell'Istituto 'Don Gnocchi'", 'year': 'data non specificata'}, {'event': 'comparsa di dispnea ingravescente a riposo', 'year': 'data non specificata'}, {'event': "TC del torace con riscontro di occlusione completa dell'arteria polmonare", 'year': 'data non specificata'}, {'event': 'terapia anticoagulante orale e persistenza di dispnea per sforzi lievi', 'year': 'data non specificata'}, {'event': "ricovero presso il reparto di Cardiologia dell'Ospedale di Voghera", 'year': 'data non specificata'}, {'event': 'ripetizione TC del torace e Ecocardiogramma con evidenziazione di pressioni polmonari elevate', 'year': 'data non specificata'}, {'event': 'trasferimento presso la Divisione per le cure del caso', 'year': 'data non specificata'}, {'event': 'esame obiettivo con dispnea a riposo (classe funzionale WHO IV)', 'year': 'data non specificata'}, {'event': 'episodi di tachiaritmie     e fibrillazione atriale', 'year': 'data non specificata'}]
    const timelineItems = datedItems.map((item) =>{
        return {
            title: item.year,
            cardTitle: " ",
            cardSubtitle: " ",
            cardDetailedText: item.event,
            timelineContent: <div className='capitalize'>{item.event}</div>
          };
      })

  return (
    <div>
        <Chrono
            items={timelineItems}
            cardHeight={70}
            mode="VERTICAL"
            theme={{
              primary: '#68c4af',
              secondary: 'white',
              cardBgColor: '#fdfbfb',
              titleColor: '#202020',
              titleColorActive: '#68c4af',
            }}
        />
        {/* {
            nonDatedItems.map((item, key) => (
                <h4 key={key}>{item.event}</h4>
            ))
        } */}
    </div>
  )
}

export default Timeline