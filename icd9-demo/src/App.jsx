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
import Topics from '@/components/Topics/Topics';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"


function App() {
  const processedPlatformOutput = useSelector((state) => state.processedPlatformOutput.value)


  return (
    <>
      <div>
        <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
          <div className=' absolute top-4 right-4'>
            <ModeToggle />
          </div>
          {
            processedPlatformOutput != null ? (
            <div className='grid grid-cols-2 gap-4'>
              <div className='flex-1 main-areas'>
                <Tabs defaultValue="icd9-concepts" className="w-auto">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="icd9-concepts">ICD9 Concepts</TabsTrigger>
                    <TabsTrigger value="main-sentences">Main Sentences</TabsTrigger>
                    <TabsTrigger value="topics">Topics</TabsTrigger>
                  </TabsList>
                  <TabsContent value="icd9-concepts">
                    <EntitiesDisplay processedPlatformOutput={processedPlatformOutput} />
                  </TabsContent>
                  <TabsContent value="main-sentences">
                    <MainSentences />
                  </TabsContent>
                  <TabsContent value="topics">
                    <Topics />
                  </TabsContent>
                </Tabs>
                <hr />
                <QuestionArea />
              </div>
              <div className='flex-1 main-areas'>
                <TextRenderer />
              </div>
            </div>
            )
            :
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
