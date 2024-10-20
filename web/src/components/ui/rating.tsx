import { Star } from "lucide-react";

type RatingProps = {
    ratingValue: number, 
    onClick: (value: number) => void, 
    size: "sm" | "lg",
    readonly?: boolean
}

const Rating: React.FC<RatingProps> = ({ratingValue, onClick, size, readonly}) => {
    const values = [1,2,3,4,5];

    let icon_size = size == "sm" ? 15 : 25;

    return (
        <div className="w-full flex items-center justify-between">
        {
            values.map(value => {
                return <Star className={readonly === true ? "" : "hover:cursor-pointer"} key={value} size={icon_size} fill={ratingValue >= value ? "yellow" : ""} onClick={() => onClick(value === ratingValue ? 0 : value)}/>
            })
        }
        </div>
        
    )
}

export default Rating;