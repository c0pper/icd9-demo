import { useState, useEffect } from 'react'
import 'regenerator-runtime/runtime'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { useSelector, useDispatch } from 'react-redux'
import { setGenerativeAnswer } from '@slices/generative-answer/generativeAnswerSlice';
import axios from 'axios'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { setTextHighlighting } from "@slices/text-highlighting/textHighlightingSlice";
import { setCurrentEntity } from '@slices/current-entity/currentEntity'
import { Label } from '@/components/ui/label'
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { MdSettings, MdSend, MdMic, MdMicOff, MdMicNone, MdOutlineVolumeUp   } from "react-icons/md";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { FaHighlighter } from "react-icons/fa";
import { SayButton } from 'react-say';



const QuestionArea = () => {
    const { toast } = useToast()
    const dispatch = useDispatch()
    const processedPlatformOutput = useSelector((state) => state.processedPlatformOutput.value)
    const [question, setQuestion] = useState("")
    const [answer, setAnswer] = useState("")
    const [LLM, setLLM] = useState("elmi")
    const [contextsNumber, setContextsNumber] = useState(10)

    const handleLLMChange = (value) => {
      setLLM(value);
    };

    const handleContextsNumberChange = (value) => {
      setContextsNumber(value);
    };

    const askLLM = async () => {
      const llmUrl = "http://127.0.0.1:5000/api/ask_question"
  
      console.log(llmUrl)
  
      const request = {
        // "question": nlQuestion
        "question": question,
        "llm": LLM,
        "full_processed_platform_out": processedPlatformOutput,
        "number_of_contexts": contextsNumber
      }
      console.log("LLM input: " + request.question)
      console.log(request)
  
      try {
        const { data } = await axios.post(
          llmUrl, 
          request, 
          {headers: {"Content-Type": "application/json"}}
        )
        dispatch(setGenerativeAnswer(data))
        console.log(data)
        setAnswer(data)
      } catch (error) {
        console.log(error)
      }
    }
 
    const handleSourceClick = (source) => {
      dispatch(setCurrentEntity({
        "extract": source.text,
        "hierarchy": source.metadata.hierarchy,
        "icd9": source.metadata.icd9,
        "label": source.metadata.label,
        "paragraph_end": source.metadata.paragraph_start,
        "paragraph_start":source.metadata.paragraph_end
      }));
      dispatch(setTextHighlighting({ start: source.metadata.paragraph_start, end: source.metadata.paragraph_end }));
  }
  
  const {
    transcript,
    listening,
    // resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();
  
  useEffect(() => {
    if (transcript !== '') {
      console.log('ue:', transcript);
      setQuestion(transcript);
    }
  }, [transcript]);

  const handleStartListening = async () => {
    await SpeechRecognition.startListening({ language: 'it-IT' });
    console.log(transcript)
  };

  const handleStopListening = () => {
    SpeechRecognition.stopListening();
    console.log("stop " + transcript)
  };

  return (
    <div className="my-4">
        <Label>Ask a question about the document</Label>
        <div className="grid grid-cols-12 gap-4 items-center justify-center">
          <div className="col-span-1">
            {
            !browserSupportsSpeechRecognition ?
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger>
                      <Button variant="outline">
                        <MdMicOff />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                    <p>Recording not available on your browser</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            :
            listening ?
              <Button variant="outline" onClick={handleStopListening}>
                <MdMicNone />
              </Button>
            :
              <Button variant="outline" onClick={handleStartListening}>
                <MdMic />
              </Button>
            }
          </div>
          <div className="col-span-9">
            <Textarea 
            placeholder='Fai una domanda...'
            value={question}  // Use userInput for manual input
            onChange={({ currentTarget: input }) => {
              if (!listening) {
                setQuestion(input.value);
                console.log("onchange " + question)
              }
            }}
              className="my-4"
            />
          </div>
          <div className="col-span-1 flex items-center justify-center">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline"><MdSettings /></Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto">
                <div className="grid grid-cols-2 gap-6 items-center">
                  <div>LLM:</div>
                  <Select onValueChange={(selectedValue) => handleLLMChange(selectedValue)}>
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="ELMI" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="elmi">ELMI</SelectItem>
                          <SelectItem value="chatgpt">ChatGPT</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <div>Contexts Number:</div>
                    <Input 
                      className="w-[120px]" 
                      type="number"
                      max="15"
                      min="5"
                      value={contextsNumber}
                      onChange={({currentTarget: input}) => handleContextsNumberChange(input.value)}
                    />
                </div>
              </PopoverContent>
            </Popover>
          </div>
          <div className="col-span-1 flex items-center justify-center">
            <Button
            variant="outline"
            size="icon"
            onClick={() => {
                askLLM()
            }}
            >
                <MdSend className="h-4 w-4" />
            </Button>
          </div>
        </div>
        {/* Q: {question}
        T: {transcript} */}
        
        { answer ?
        <div className=' border rounded-md p-4 my-4'>
          <div className='grid grid-cols-12 gap-2 items-center'>
            <div className='col-span-11'>
              {answer.content}
            </div>
            <div>
              <Button
              variant="outline"
              size="icon"
              >
                <SayButton
                  onClick={ event => console.log(event) }
                  text={answer.content}
                  pitch={ 0.8 }
                  rate={1.1}
                >
                  <MdOutlineVolumeUp className="h-4 w-4" />
                </SayButton>
              </Button>
            </div>
          </div>
          <hr />
        </div>
        : undefined
        }
        
        { answer.sources ?
        <>
          <Label>Sources</Label>
          {
            answer.sources.map((source, index) => (
              <div key={index} className='my-4'>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-md">Source {index+1}</CardTitle>
                    <CardDescription>
                      <div className='grid grid-cols-8'>
                        <span className=' col-span-7'>Relevance score: {(source.score*100).toFixed(2)}</span>
                        <Progress value={source.score*100}/>
                      </div>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className='grid grid-cols-8 items-center'>
                      <span onClick={() => handleSourceClick(source)} className="cursor-pointer col-span-7">
                        {source.text}
                      </span>
                      <div className='flex justify-end'>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleSourceClick(source)}
                        >
                          <FaHighlighter />
                        </Button>

                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))
          }
        </>
        :
        undefined
        }
    </div>
  )
}

export default QuestionArea