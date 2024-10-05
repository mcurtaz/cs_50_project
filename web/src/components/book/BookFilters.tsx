import { useSearchParams } from "react-router-dom";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { BookStatus } from "@/models/book.model";

const BookFilters: React.FC = () => {
  let [searchParams, setSearchParams] = useSearchParams();

  const setSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    const old_value = searchParams.get("q");

    if(value.length > 2){
        searchParams.set("q", value);
        setSearchParams(searchParams);
    }else{
        searchParams.delete("q");

        if(old_value){
            setSearchParams(searchParams);
        }
    }
  }

  const setStatus = (value: string) => {
    if(value === "all"){
        searchParams.delete("status");
    }else{
        searchParams.set("status", value);
    }
    
    setSearchParams(searchParams);
  }

  return (
    <div className="flex flex-row gap-6 mt-5">
        <div>
            <Label htmlFor="status">Search</Label>
            <Input type="text" name="search" onChange={setSearch} placeholder="Author/Description/Title" defaultValue={""}/>
            <small className="text-gray-500 ml-1">Minimum 3 character</small>
        </div>
        <div>
            <Label htmlFor="status">Status</Label>
            <Select name="status" defaultValue={"all"} onValueChange={setStatus}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value={"all"} className="text-gray-300">All</SelectItem>
                    {Object.keys(BookStatus).map((key) => <SelectItem value={key}>{BookStatus[key as keyof typeof BookStatus]}</SelectItem>)}
                </SelectContent>
            </Select>
        </div>
    </div>
  )
}

export default BookFilters;