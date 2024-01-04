import { Label } from "../ui/label"
import { useSelector } from "react-redux"
import { Badge } from "../ui/badge"
import {
Card,
CardContent,
CardDescription,
CardFooter,
CardHeader,
CardTitle,
} from "@/components/ui/card"
import {
Carousel,
CarouselContent,
CarouselItem,
CarouselNext,
CarouselPrevious,
} from "@/components/ui/carousel"

const MainSentences = () => {
    const { main_sentences } = useSelector((state) => state.processedPlatformOutput.value)

  return (
    <div>
        <Label>Main Sentences from the text</Label>

        
    {
    main_sentences != null ? (
        <div className=" p-2 my-4">
            {
            <Carousel>
                <CarouselContent className="flex items-center">
                    {main_sentences.map((item, index) => (
                    <CarouselItem key={index}>
                        <div className="m-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle><Badge variant="secondary" className="mr-2">{index+1}</Badge></CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p>{item.value}</p>
                                </CardContent>
                            </Card>
                        </div>
                    </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel>
            }
        </div>) : undefined
        }
        
        {/* {
        main_sentences != null ? (
            <div className=" p-2 my-4">
            {
                main_sentences.map((item, index) => (
                <div key={index} className="m-4">
                    <Card>
                        <CardHeader>
                            <CardTitle><Badge variant="secondary" className="mr-2">{index+1}</Badge></CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>{item.value}</p>
                        </CardContent>
                    </Card>
                    
                </div>
                ))
            }
            </div>
        ) : undefined
        }  */}
    </div>
  )
}

export default MainSentences