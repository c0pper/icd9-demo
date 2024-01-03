import { Label } from "../ui/label"
import { useSelector } from "react-redux"
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie, Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);


const Topics = () => {
    const { topics } = useSelector((state) => state.processedPlatformOutput.value)
    const topicLabels = topics.map((topic) => topic.label)
    const topicScores = topics.map((topic) => topic.normalized_score)
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
    
    const data = {
        labels: topicLabels,
        datasets: [
          {
            label: '% of text regarding this topic',
            data: topicScores,
            backgroundColor: colors.map((color) => color + bgAlpha),
            borderColor: colors.map((color) => color + borderAlpha),
            borderWidth: 1,
          },
        ],
    };


  return (
    <div>
        <Label>Main Topics from the text</Label>
        {
        topics != null ? (
            <div className="border rounded-md p-2 my-4 flex justify-center">
                {/* <div className="w-[60%]">
                    <Pie 
                        data={data}
                    />
                </div> */}
                <div className="w-[60%]">
                    <Doughnut 
                        data={data}
                    />
                </div>
            </div>
        ) : undefined
        } 
    </div>
  )
}

export default Topics