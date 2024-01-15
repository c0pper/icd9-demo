import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { useDispatch } from 'react-redux'
import { useState } from 'react'
import { setInputText } from '@slices/input-text/InputTextSlice'
import { setPlatformOutput } from '@slices/platform-output/platformOutputSlice'
import { setDateExtractionOutput } from "@slices/date-extraction-output/DateExtractionOutputSlice"
import { setProcessedPlatformOutput } from "@slices/processed-platform-output/processedPlatformOutputSlice"
import dummyOutput from '../../dummy-output.json';
import dummyOutputFarmaci from '../../dummy-output-farmaci.json';
import dummyDateExtractionOutput from '../../dummy_date_extraction_output.json'
// import dummyProcessedPlatformOutput from '../../dummy-processed-platform-output.json'
import axios from "axios";

const LoadFile = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const dispatch = useDispatch()
  const { toast } = useToast()

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);

    if (file) {
      // Read the content of the file
      const reader = new FileReader();
      reader.onload = async () => {
        const fileContent = reader.result;
        dispatch(setInputText(fileContent))
        toast({
            title: "Loaded file",
            description: file.name,
        });

        await dispatch(setPlatformOutput(dummyOutput))
        // await dispatch(setPlatformOutput(dummyOutputFarmaci))
        
        console.log("date", dummyDateExtractionOutput)
        await dispatch(setDateExtractionOutput(dummyDateExtractionOutput))
        // const platformOutput = dummyOutput
        await processPlatformOutput(dummyOutput);
        // await processPlatformOutput(dummyOutputFarmaci);
        // dispatch(setProcessedPlatformOutput(dummyProcessedPlatformOutput))
      };
      reader.readAsText(file);

      // const getPlatformOutput = async () => {
      //   dispatch(setPlatformOutput(dummyOutput))
      // }

      const processPlatformOutput = async (platformOutput) => {
        const processUrl = "http://127.0.0.1:5000/api/process_platform_output"
        const request = {
          "platform_out": platformOutput
        }
        console.log(request.platform_out)
        try {
          const { data } = await axios.post(
            processUrl, 
            request, 
            {headers: {"Content-Type": "application/json"}}
          )
          dispatch(setProcessedPlatformOutput(data))
        } catch (error) {
          console.log(error)
        }
      }

    }
  };


  return (
    <div>
        {
            selectedFile === null ? 
                (
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger>
                                <Button variant="outline" asChild>
                                    <label htmlFor="fileInput" className="custom-file-input">
                                    {selectedFile ? selectedFile.name : "Choose file"}
                                    </label>
                                </Button>
                                <Input 
                                    id="fileInput" 
                                    type="file" 
                                    className="hidden"
                                    onChange={handleFileChange}
                                />
                            </TooltipTrigger>
                            <TooltipContent>
                            <p>Add to library</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                )
            :
            undefined
        }
    </div>
    
  )
}

export default LoadFile