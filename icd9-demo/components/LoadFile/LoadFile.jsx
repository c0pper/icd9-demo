import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useDispatch, useSelector } from 'react-redux'
import { useState } from 'react'
import { setInputText } from '@slices/input-text/InputTextSlice'
import { 
  setPlatformOutput, 
  selectPlatformOutput, 
  getPlatformOutputStatus, 
  getPlatformOutputError, 
  getPlatformOutput } from '@slices/platform-output/platformOutputSlice'
import { 
  setProcessedPlatformOutput,
  selectProcessedPlatformOutput,
  getProcessedPlatformOutputStatus,
  getProcessedPlatformOutputError,
  processPlatformOutput } from "@slices/processed-platform-output/processedPlatformOutputSlice"

import dummyOutput from '../../dummy-output.json';
import dummyOutputCristina from '../../5508 Di Nunzio Cristina.json';
import dummyOutputFarmaci from '../../dummy-output-farmaci.json';
import dummyDateExtractionOutput from '../../dummy_date_extraction_output.json'
// import dummyProcessedPlatformOutput from '../../dummy-processed-platform-output.json'


const LoadFile = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const dispatch = useDispatch()

  const platformOutput = useSelector(selectPlatformOutput)
  const platformOutputStatus = useSelector(getPlatformOutputStatus)
  const platformOutputError = useSelector(getPlatformOutputError)

  const processedPlatformOutput = useSelector(selectPlatformOutput)
  const processedPlatformOutputStatus = useSelector(getPlatformOutputStatus)
  const processedPlatformOutputError = useSelector(getPlatformOutputError)


  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);

    if (file) {
      // Read the content of the file
      const reader = new FileReader();
      reader.onload = async () => {
        const fileContent = reader.result;
        dispatch(setProcessedPlatformOutput(null))
        dispatch(setInputText(fileContent))

        // call funzionante all'api platform
        try {
          const result = await dispatch(getPlatformOutput(fileContent));
          console.log("processing", result.payload);
          await dispatch(processPlatformOutput(result.payload));
        } catch (error) {
          console.log(error);
        }
        

        // Set platform output da locale per risparmiare tempo

        // await dispatch(setPlatformOutput(dummyOutput))
        // await processPlatformOutput(dummyOutput);


        // await dispatch(setPlatformOutput(dummyOutputFarmaci))
        // await processPlatformOutput(dummyOutputFarmaci);
        
        
        // await dispatch(setPlatformOutput(dummyOutputCristina))
        // await processPlatformOutput(dummyOutputCristina);

      };
      reader.readAsText(file);
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