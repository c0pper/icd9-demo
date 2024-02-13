import { ScrollArea } from "@/components/ui/scroll-area"
import { useSelector } from 'react-redux'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { Badge } from '../ui/badge'
import { Label } from '../ui/label'
// import dummyProcessedPlatformOutput from '../../dummy-processed-platform-output.json'

const TextRenderer = () => {
    const platformOutput = useSelector((state) => state.platformOutput.value)
    const highlightIndexes = useSelector((state) => state.textHighlighting.value)
    const currentEntity = useSelector((state) => state.currentEntity.value)
    // const { extractions } = dummyProcessedPlatformOutput
    // const matchingItem = extractions.find((item) => highlightIndexes && item.paragraph_start === highlightIndexes.start && item.icd9 === currentEntity.icd9); 
    
    // const { patient_data_full } = useSelector((state) => state.processedPlatformOutput.value)
    // const matchingItem = patient_data_full.find((item) => highlightIndexes && item.extract_start === highlightIndexes.start && item.icd9 === currentEntity.icd9); 
    // console.log("matching", matchingItem)
    
    // const { collections } = useSelector((state) => state.processedPlatformOutput.value)
    // const matchingItem = collections.find((item) => highlightIndexes && item.extract_start === highlightIndexes.start && item.icd9 === currentEntity.icd9); 
    // console.log("matching", matchingItem)   

    const renderTextWithHighlights = () => {
        if (!highlightIndexes) {
          return platformOutput.content;
        }
    
        const parts = [];
    
        // Sort the highlightIndexes by start index
        const sortedIndexes = [...highlightIndexes].sort((a, b) => a.start - b.start);
    
        // Iterate through the sortedIndexes and create parts of the text
        sortedIndexes.forEach((index, i) => {
          // Add the text between the current and previous indexes
          if (i === 0) {
            parts.push(platformOutput.content.slice(0, index.start));
          } else {
            parts.push(platformOutput.content.slice(sortedIndexes[i - 1].end + 1, index.start));
          }
    
          // Add the highlighted text
          const highlightedText = platformOutput.content.slice(index.start, index.end + 1);
          parts.push(
            <HoverCard>
                <HoverCardTrigger asChild>
                    <span className={currentEntity.hierarchy.startsWith("B") ? "highlighted-text-diagnosis" : "highlighted-text-procedure"}>
                        {highlightedText}
                    </span>
                </HoverCardTrigger>
                <HoverCardContent className="w-auto">
                <div className="flex justify-between space-x-4">
                    <div className="space-y-1">
                    <h4 className="text-sm font-semibold">ICD9 Label</h4>
                    <p className="text-xs capitalize">
                        {currentEntity.label}
                    </p>
                    <h4 className="text-sm font-semibold">ICD9 Hierarchy</h4>
                    <p className="text-xs">
                    {currentEntity.hierarchy.split('/').map((element, index) => (
                        <span key={index}>
                            <p>
                                <Badge>{index+1}</Badge>
                                <Badge variant="outline" className="capitalize">{element}</Badge>
                            </p>
                        </span>
                    ))}
                    </p>
                    <div className="items-start pt-2 flex-col">
                        <h4 className="text-sm font-semibold">ICD9 Code</h4>
                        {currentEntity.hierarchy.includes("ICD9CM") ?
                        <a href={`http://www.icd9data.com/getICD9Code.ashx?icd9=${currentEntity.icd9}`} target="_blank">
                            <Badge variant="secondary">{currentEntity.icd9}</Badge>
                        </a>
                        :
                        <Badge variant="secondary">{currentEntity.icd9}</Badge>
                        }
                    </div>
                    </div>
                </div>
                </HoverCardContent>
            </HoverCard>
          
          );
    
          // Add the remaining text if it's the last index
          if (i === sortedIndexes.length - 1) {
            parts.push(platformOutput.content.slice(index.end + 1));
          }
        });
    
        return parts;
      };
    
    return (
        <div className="h-[80vh]">
            <Label>Document Text</Label>  
            <ScrollArea className="rounded-md border p-4 h-full my-4">
                {renderTextWithHighlights()}
            </ScrollArea>

            {/* <ScrollArea className="rounded-md border p-4 h-full my-4">
                {
                    highlightIndexes ? 
                    (
                        <>
                            {platformOutput.content.slice(0, highlightIndexes.start)}

                            <HoverCard>
                                <HoverCardTrigger asChild>
                                    <span className={matchingItem.hierarchy.includes("ICD9CM") ? "highlighted-text-diagnosis" : "highlighted-text-procedure"}>
                                        {platformOutput.content.slice(highlightIndexes.start, highlightIndexes.end + 1)}
                                    </span>
                                </HoverCardTrigger>
                                <HoverCardContent className="w-auto">
                                <div className="flex justify-between space-x-4">
                                    <div className="space-y-1">
                                    <h4 className="text-sm font-semibold">ICD9 Label</h4>
                                    <p className="text-xs capitalize">
                                        {matchingItem.label}
                                    </p>
                                    <h4 className="text-sm font-semibold">ICD9 Hierarchy</h4>
                                    <p className="text-xs">
                                    {matchingItem.hierarchy.split('/').map((element, index) => (
                                        <span key={index}>
                                            <p>
                                                <Badge>{index+1}</Badge>
                                                <Badge variant="outline" className="capitalize">{element}</Badge>
                                            </p>
                                        </span>
                                    ))}
                                    </p>
                                    <div className="items-start pt-2 flex-col">
                                        <h4 className="text-sm font-semibold">ICD9 Code</h4>
                                        {matchingItem.hierarchy.includes("ICD9CM") ?
                                        <a href={`http://www.icd9data.com/getICD9Code.ashx?icd9=${matchingItem.icd9}`} target="_blank">
                                            <Badge variant="secondary">{matchingItem.icd9}</Badge>
                                        </a>
                                        :
                                        <Badge variant="secondary">{matchingItem.icd9}</Badge>
                                        }
                                    </div>
                                    </div>
                                </div>
                                </HoverCardContent>
                            </HoverCard>

                            {platformOutput.content.slice(highlightIndexes.end + 1)}
                        </>
                    )
                    : (
                        platformOutput.content
                    )
                }
            </ScrollArea> */}
            
        </div>
    )
}

export default TextRenderer