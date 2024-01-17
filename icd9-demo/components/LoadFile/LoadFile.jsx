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
import axios from "axios";


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
        dispatch(setInputText(fileContent))

        
        try {
          const result = await dispatch(getPlatformOutput(fileContent));
          console.log("processing", result.payload);
          await dispatch(processPlatformOutput(result.payload));
        } catch (error) {
          console.log(error);
        }
        
        // await dispatch(getPlatformOutput(fileContent))
        // console.log(platformOutput)
        // console.log("processing", platformOutput)
        // await dispatch(processPlatformOutput(platformOutput));

        // await dispatch(setPlatformOutput(dummyOutput))
        // await dispatch(setPlatformOutput(dummyOutputFarmaci))
        // await dispatch(setPlatformOutput(dummyOutputCristina))
        
        // console.log("date", dummyDateExtractionOutput)
        // await dispatch(setDateExtractionOutput(dummyDateExtractionOutput))
        
        // await processPlatformOutput(dummyOutput);
        // await processPlatformOutput(dummyOutputFarmaci);
        // await processPlatformOutput(dummyOutputCristina);

        // if (platformOutputStatus === "succeded") {
          // console.log("succeded", platformOutput)
        // }

        // dispatch(setProcessedPlatformOutput(dummyProcessedPlatformOutput))
      };
      reader.readAsText(file);

      // const getPlatformOutput = async () => {
      //   dispatch(setPlatformOutput(dummyOutput))
      // }

      // const processPlatformOutput = async (platformOutput) => {
      //   const processUrl = "http://127.0.0.1:5000/api/process_platform_output"
      //   const request = {
      //     "platform_out": platformOutput
      //   }
      //   console.log(request.platform_out)
      //   try {
      //     const { data } = await axios.post(
      //       processUrl, 
      //       request, 
      //       {headers: {"Content-Type": "application/json"}}
      //     )
      //     dispatch(setProcessedPlatformOutput(data))
      //   } catch (error) {
      //     console.log(error)
      //   }
      // }

    }
  };



// const LoadFile = () => {
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [platformOutput, setPlatformOutput] = useState(null);
//   const dispatch = useDispatch()
//   const { toast } = useToast()

//   const handleFileChange = (event) => {
//     const file = event.target.files[0];
//     setSelectedFile(file);

//     if (file) {
//       // Read the content of the file
//       const reader = new FileReader();
//       reader.onload = async () => {
//         const fileContent = reader.result;
//         dispatch(setInputText(fileContent))
        
        
//         // try {
//         //   await dispatch(getAndProcessPlatformOutput(fileContent));

//         //   // console.log("gettin platform out")
//         //   // const platformOutputResponse = await getPlatformOutput(fileContent);
//         //   // setPlatformOutput(platformOutputResponse)
//         //   // console.log(platformOutputResponse)
//         //   // console.log("processing platform out")
//         //   // await processPlatformOutput(platformOutput);
//         // } catch (error) {
//         //   console.log(error);
//         // }

//         // await getPlatformOutput(fileContent)
//         await dispatch(setPlatformOutput(dummyOutput))
//         // await dispatch(setPlatformOutput(dummyOutputFarmaci))
//         // await dispatch(setPlatformOutput(dummyOutputCristina))
        
//         await processPlatformOutput(dummyOutput);
//         // await processPlatformOutput(dummyOutputFarmaci);

//         // await processPlatformOutput(dummyOutputCristina);
        
//         // console.log("date", dummyDateExtractionOutput)
//         // await dispatch(setDateExtractionOutput(dummyDateExtractionOutput))
//         // dispatch(setProcessedPlatformOutput(dummyProcessedPlatformOutput))
//       };
//       reader.readAsText(file);


//       const processPlatformOutput = async (platformOutput) => {
//         const processUrl = "http://127.0.0.1:5000/api/process_platform_output"
//         const request = {
//           "platform_out": platformOutput
//         }
//         console.log(request.platform_out)
//         try {
//           const { data } = await axios.post(
//             processUrl, 
//             request, 
//             {headers: {"Content-Type": "application/json"}}
//           )
//           dispatch(setProcessedPlatformOutput(data))
//         } catch (error) {
//           console.log(error)
//         }
//       }
//       // const getPlatformOutput = async () => {
//       //   dispatch(setPlatformOutput(dummyOutput))
//       // }
      
//   //     const getPlatformOutput = (text) => async (dispatch) => {
//   //       const url = "http://127.0.0.1:5000/api/get_platform_output"
//   //       const body = {
//   //         "body": {
//   //           "text": text,
//   //           "options":
//   //           {
//   //               "custom":
//   //               {
//   //                   "normalizeToConceptId": true
//   //               }
//   //           }
//   //         }
//   //       }

//   //       try {
//   //         const { data } = await axios.post(
//   //           url, 
//   //           body, 
//   //           {headers: {"Content-Type": "application/json"}}
//   //         )
//   //         dispatch(setPlatformOutput(data))
//   //       } catch (error) {
//   //         console.log(error)
//   //       }
//   //     }

//   //     const processPlatformOutput = async (platformOutput) => {
//   //       const processUrl = "http://127.0.0.1:5000/api/process_platform_output"
//   //       const request = {
//   //         "platform_out": platformOutput
//   //       }
//   //       console.log(request.platform_out)
//   //       try {
//   //         const { data } = await axios.post(
//   //           processUrl, 
//   //           request, 
//   //           {headers: {"Content-Type": "application/json"}}
//   //         )
//   //         dispatch(setProcessedPlatformOutput(data))
//   //       } catch (error) {
//   //         console.log(error)
//   //       }
//   //     }
//     }
//   };


  // const getPlatformOutput = createAsyncThunk(
  //   'platformOutput/getPlatformOutput',
  //   async (text, { dispatch }) => {
  //     const url = "http://127.0.0.1:5000/api/get_platform_output";
  //     const body = {
  //       "body": {
  //         "text": text,
  //         "options": {
  //           "custom": {
  //             "normalizeToConceptId": true
  //           }
  //         }
  //       }
  //     };
  
  //     try {
  //       const { data } = await axios.post(
  //         url,
  //         body,
  //         { headers: { "Content-Type": "application/json" } }
  //       );
  
  //       // Dispatch the success action
  //       dispatch(setPlatformOutput(data));
  
  //       return data; // Return the platform output for chaining
  //     } catch (error) {
  //       console.log(error);
  //       // Dispatch the failure action (optional)
  //       // dispatch(setPlatformOutputError(error));
  //       throw error; // Re-throw the error for handling in the parent function
  //     }
  //   }
  // );
  
  // const processPlatformOutput = async (platformOutput) => {
  //   const processUrl = "http://127.0.0.1:5000/api/process_platform_output";
  //   const request = {
  //     "platform_out": platformOutput
  //   };
  
  //   try {
  //     const { data } = await axios.post(
  //       processUrl,
  //       request,
  //       { headers: { "Content-Type": "application/json" } }
  //     );
  //     return data;
  //   } catch (error) {
  //     console.log(error);
  //     throw error;
  //   }
  // };
  
  // const getAndProcessPlatformOutput = (text) => async (dispatch) => {
  //   try {
  //     // Dispatch the first thunk and get the platform output
  //     const platformOutput = await dispatch(getPlatformOutput(text));
      
  //     // Dispatch the second thunk to process the platform output
  //     const processedOutput = await dispatch(processPlatformOutput(platformOutput));
  
  //     // Optionally, you can do something with the processed output here
  //     console.log('Processed Output:', processedOutput);
  //   } catch (error) {
  //     console.log(error);
  //     // Handle errors as needed
  //   }
  // };


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