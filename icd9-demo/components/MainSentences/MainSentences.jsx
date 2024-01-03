import { Label } from "../ui/label"
import { useSelector } from "react-redux"
import { Badge } from "../ui/badge"

const MainSentences = () => {
    const { main_sentences } = useSelector((state) => state.processedPlatformOutput.value)

  return (
    <div>
        <Label>Main Sentences from the text</Label>
        
        {
        main_sentences != null ? (
            <div className="border rounded-md p-2 my-4">
            {
                main_sentences.map((item, index) => (
                <div key={index}>
                    <Badge variant="secondary" className="mr-2">{index+1}</Badge>{item.value}
                </div>
                ))
            }
            </div>
        ) : undefined
        } 
    </div>
  )
}

export default MainSentences