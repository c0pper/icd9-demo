import axios from 'axios'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useState, useEffect } from 'react';
import { Label } from '../ui/label';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );

const BodyParts = () => {
    const [bodyParts, setBodyParts] = useState(null);
    // const [mappedBodyParts, setMappedBodyParts] = useState(null);

    const processBodyPartsOutput = async () => {
        const url = "http://127.0.0.1:5000/api/process_body_parts"
    
        console.log(url)
    
        const rawBodyPartsOutput = {}
    
        try {
          const response = await axios.post(
            url, 
            rawBodyPartsOutput, 
            {headers: {"Content-Type": "application/json"}}
          )
          setBodyParts(response.data)
        } catch (error) {
          console.log(error)
        }
    }
    
    // const mapBodyPartsCGPT = async () => {
    //     const url = "http://127.0.0.1:5000/api/map_body_parts_to_body"
    
    //     console.log(url)
    
    
    //     try {
    //       const response = await axios.post(
    //         url, 
    //         {}, // ci va output di parti del corpo
    //         {headers: {"Content-Type": "application/json"}}
    //       )
    //       setMappedBodyParts(response.data)
    //     } catch (error) {
    //       console.log(error)
    //     }
    // }
    
    useEffect(() => {
        processBodyPartsOutput();
        // mapBodyPartsCGPT();
    }, []);


    
    if (bodyParts === null) {
        return <p>Loading...</p>;
    }

    
    const bodyPartLabels = bodyParts.map((part) => part.field_value)
    const bodyPartInstances = bodyParts.map((part) => part.instances)
    const colors = [
        'rgba(212,77,77,',
        'rgba(234,145,52,',
        'rgba(252,229,205,',
        'rgba(41,144,166,',
        'rgba(15,52,87,',
        'rgba(88,134,84,',
        'rgba(255,103,0,',
        'rgba(92,80,73,',
        'rgba(207,189,164,',
        'rgba(81,64,219,',
    ]
    const bgAlpha = "0.2)"
    const borderAlpha = "1)"
    

    const options = {
        indexAxis: 'y',
        elements: {
          bar: {
            borderWidth: 3,
          },
        },
        responsive: true,
        scaleShowValues: true,
        scales: {
            y: {
                ticks: {
                    autoSkip: false
                }
            }
        },
        plugins: {
           legend: {
              display: false
           }
        }
    };

    const graphData = {
        labels: bodyPartLabels,
        datasets: [
            {
            label: ' # of body part mentions',
            data: bodyPartInstances,
            backgroundColor: colors.map((color) => color + bgAlpha),
            borderColor: colors.map((color) => color + borderAlpha),
            },
        ],
    };

    


  return (
    <div>
    <Label>Affected body parts</Label>
    {
    bodyParts != null ? (
        <div className="border rounded-md p-2 my-4 flex justify-center">
            {/* <div className="w-[60%]">
                <Doughnut 
                    data={graphData}
                />
            </div> */}
            <div className="w-[100%]">
                <Bar 
                    data={graphData}
                    options={options}
                />
            </div>
        </div>
    ) : undefined
    } 

    {/* {
    mappedBodyParts == null ? (
        <>
            <div className="border rounded-md p-2 my-4 flex justify-center">
                <div className="w-[100%]">
                    {bodyPartLabels.map((part, index) => (
                        <div key={index}>
                            <p>Field Value: {mappedBodyParts[part]}</p>
                        </div>
                    ))}
                </div>
            </div>
        </>
    ) : undefined
    }  */}
    </div>
  )
}

export default BodyParts