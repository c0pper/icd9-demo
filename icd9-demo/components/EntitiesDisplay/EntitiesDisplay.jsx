import EntityHoverCard from '../EntityHoverCard/EntityHoverCard'
import { Label } from '../ui/label'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

const EntitiesDisplay = ({ processedPlatformOutput }) => {
  // const { extractions } = useSelector((state) => state.processedPlatformOutput.value)
  // const extractions = processedPlatformOutput?.extractions || []
  // const extractions = processedPlatformOutput?.patient_data_full || []
  let extractions;
  let diagnosisItems;
  let procedureItems;
  if (processedPlatformOutput) {
    extractions = processedPlatformOutput.patient_data_full;
    extractions = processedPlatformOutput.collections;
    diagnosisItems = extractions.filter((item) => item.hierarchy.startsWith("B"));
    procedureItems = extractions.filter((item) => item.hierarchy.startsWith("A"));
  } else {
    extractions = [];
  }


  return (
    <>
    {
      processedPlatformOutput != null ? (
        <>
          <Label >ICD9 Concepts found in the document</Label>  
            <div className="border rounded-md p-2 my-4">
              
              <Tabs defaultValue="procedure" className=' w-full'>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="procedure">Procedure</TabsTrigger>
                  <TabsTrigger value="diagnosis">Diagnosis</TabsTrigger>
                </TabsList>
                <TabsContent value="procedure" className="flex flex-wrap capitalize">
                {
                    procedureItems.map((item, index) => (
                      <div key={index} className="mr-1 my-0.5">
                        <EntityHoverCard item={item}/>
                      </div>
                    ))
                }
                </TabsContent>
                <TabsContent value="diagnosis" className="flex flex-wrap capitalize">
                {
                    diagnosisItems.map((item, index) => (
                      <div key={index} className="mr-1 my-0.5">
                        <EntityHoverCard item={item} />
                      </div>
                    ))
                }
                </TabsContent>
              </Tabs>
            </div>
        </>
      ) : undefined
    } 
    </>
  )
}

export default EntitiesDisplay