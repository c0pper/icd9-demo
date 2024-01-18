import './App.css'
import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from '@/components/mode-toggle'
import TextRenderer from '@/components/TextRenderer/TextRenderer'
import LoadFile from '@/components/LoadFile/LoadFile'
import EntitiesDisplay from '@/components/EntitiesDisplay/EntitiesDisplay'
import QuestionArea from '@/components/QuestionArea/QuestionArea';
import { useSelector } from 'react-redux'
// import 'dotenv/config'
import MainSentences from '@/components/MainSentences/MainSentences';
// import Topics from '@/components/Topics/Topics';
import BodyParts from '@/components/BodyParts/BodyParts';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import Timeline from '@/components/Timeline/Timeline';
import { Skeleton } from '@/components/ui/skeleton';


function App() {
  const processedPlatformOutput = useSelector((state) => state.processedPlatformOutput.value)
  const inputText = useSelector((state) => state.inputText.value)

  return (
    <>
      <div>
        <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
          <div className=' fixed bottom-4 right-4'>
            <ModeToggle />
          </div>

          {/* Loading screen */}
          {
            inputText != null && processedPlatformOutput === null ? (
              <div className='h-screen'>
                <div className="grid w-full grid-cols-2 gap-4 h-[80%]">
                  <div className=' col-span-1'>
                    <Skeleton className="h-72 w-full m-4" />
                    <Skeleton className="h-72 w-full m-4" />
                  </div>
                  <div className=' col-span-1'>
                    <Skeleton className="h-full w-full m-4" />
                  </div>
                </div>
              </div>
            ) :
            undefined
          }

          {/* Loaded data */}
          {
            processedPlatformOutput != null ? (
            <div>
              <Tabs defaultValue="overview" className="w-auto">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="timeline">Timeline</TabsTrigger>
                </TabsList>

                <TabsContent value="overview">
                  <div className='grid grid-cols-2 gap-4'>
                    <div className='flex-1 main-areas'>
                      <Tabs defaultValue="icd9-concepts" className="w-auto">
                        <TabsList className="grid w-full grid-cols-3">
                          <TabsTrigger value="icd9-concepts">ICD9 Concepts</TabsTrigger>
                          <TabsTrigger value="main-sentences">Main Sentences</TabsTrigger>
                          <TabsTrigger value="body-parts">Body Parts</TabsTrigger>
                          {/* <TabsTrigger value="topics">Topics</TabsTrigger> */}
                        </TabsList>
                        <TabsContent value="icd9-concepts">
                          <EntitiesDisplay processedPlatformOutput={processedPlatformOutput} />
                        </TabsContent>
                        <TabsContent value="main-sentences">
                          <MainSentences />
                        </TabsContent>
                        <TabsContent value="body-parts">
                          <BodyParts />
                        </TabsContent>
                      </Tabs>
                      <QuestionArea />
                    </div>
                    <div className='flex-1 main-areas'>
                      <TextRenderer />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="timeline" className="">
                  <div className=' grid grid-cols-12'>
                    <div className=' col-span-12  col-start-2 col-end-12'>
                      <Timeline />
                    </div>

                  </div>
                </TabsContent>
              </Tabs>
            </div>
            )
            :

            // Input file
            <div className='flex items-center justify-center'>
              <LoadFile />
            </div>
          }
        </ThemeProvider>
      </div>
    </>
  )
}

export default App
