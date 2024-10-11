import { useSearchParams } from "react-router-dom";
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { SeriesStatus } from "@/models/series.model";

const SeriesFilters: React.FC = () => {
  let [searchParams, setSearchParams] = useSearchParams();

  const setSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    const old_value = searchParams.get("q");

    if(value.length > 2){
        searchParams.set("q", value);
        searchParams.set("page", "1");
        setSearchParams(searchParams);
    }else{
        searchParams.delete("q");

        if(old_value){
            searchParams.set("page", "1");
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
    searchParams.set("page", "1");
    
    setSearchParams(searchParams);
  }

  return (
    <div className="w-full flex flex-row justify-end mt-5 gap-3">
        <div className="lg:w-80">
            <Input type="text" name="search" onChange={setSearch} placeholder="Search" defaultValue={""}/>
            <small className="text-gray-500 ml-1">Minimum 3 character</small>
        </div>
        <div>
            <Select name="status" defaultValue={""} onValueChange={setStatus}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value={"all"} className="text-gray-300">All</SelectItem>
                    {Object.keys(SeriesStatus).map((key) => <SelectItem value={key}>{SeriesStatus[key as keyof typeof SeriesStatus]}</SelectItem>)}
                </SelectContent>
            </Select>
        </div>
    </div>
  )
}

export default SeriesFilters;