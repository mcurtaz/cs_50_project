import { Star } from "lucide-react";

type RatingProps = {
    ratingValue: number, 
    onClick: (value: number) => void, 
    size: "sm" | "lg"
}

const Rating: React.FC<RatingProps> = ({ratingValue, onClick, size}) => {
    const values = [1,2,3,4,5];

    let icon_size = size == "sm" ? 20 : 25;

    return (
        <div className="w-full flex items-center justify-between">
        {
            values.map(value => {
                return <Star key={value} size={icon_size} fill={ratingValue >= value ? "yellow" : ""} onClick={() => onClick(value == 1 && ratingValue == 1 ? 0 : value)}/>
            })
        }
        </div>
        
    )
}

export default Rating;