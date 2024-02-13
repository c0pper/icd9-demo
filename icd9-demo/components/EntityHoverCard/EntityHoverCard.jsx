import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { useDispatch } from 'react-redux'
import { setTextHighlighting } from '@slices/text-highlighting/textHighlightingSlice'
import { Badge } from '../ui/badge'
import { setCurrentEntity } from '@slices/current-entity/currentEntity'

const EntityHoverCard = ({ item }) => {
    const dispatch = useDispatch()

    const handleClick = () => {
        // dispatch(setTextHighlighting({ start: item.extract_start, end: item.extract_end }));
        const instancesList = item.frontend_instances.map(instance => ({
            start: instance.extract_start,
            end: instance.extract_end
          }));
        dispatch(setTextHighlighting(instancesList));
        dispatch(setCurrentEntity(item));
        console.log(instancesList)
    }

  return (
    <HoverCard>
        <HoverCardTrigger asChild>
        <span 
            onClick={handleClick}
            className=' cursor-pointer'
        >
            <Badge variant={item.hierarchy.startsWith("B") ? "diagnosis" : "procedure"} className="capitalize">{item.label}</Badge>
        </span>
        </HoverCardTrigger>
        <HoverCardContent className="w-auto">
        <div className="flex justify-between space-x-4">
            <div className="space-y-1">
            <h4 className="text-sm font-semibold">ICD9 Hierarchy</h4>
            <span className="text-xs">
                {item.hierarchy.split('/').map((element, index) => (
                    <span key={index}>
                        <p>
                            <Badge>{index+1}</Badge>
                            <Badge variant="outline" className="capitalize">{element}</Badge>
                        </p>
                    </span>
                ))}
            </span>
            <div className="items-start pt-2 flex-col">
                <h4 className="text-sm font-semibold">ICD9 Code</h4>
                {item.hierarchy.startsWith("B") ?
                <a href={`http://www.icd9data.com/getICD9Code.ashx?icd9=${item.icd9}`} target="_blank">
                    <Badge variant="secondary">{item.icd9}</Badge>
                </a>
                :
                <Badge variant="secondary">{item.icd9}</Badge>
                }
            </div>
            </div>
        </div>
        </HoverCardContent>
    </HoverCard>
  )
}

export default EntityHoverCard