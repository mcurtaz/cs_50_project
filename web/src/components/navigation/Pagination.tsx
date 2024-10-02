import { useNavigation, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight } from 'lucide-react';

import { Pagination as PaginationModel } from "@/models/pagination.model";

const Pagination: React.FC<{
    pagination: PaginationModel
}> = ({pagination}) => {
  const {has_prev, has_next, page, pages} = pagination;
  let [searchParams, setSearchParams] = useSearchParams();

  const navigation = useNavigation();

  return (
    <div className="flex flex-row gap-2">
        <Button disabled={!has_prev || navigation.state === "loading"} size={"sm_icon"} onClick={()=> setSearchParams((prev) => {return {...prev, page: page - 1}})}>
          <ArrowLeft size={22} />
        </Button>
        <h4>{page}/{pages}</h4>
        <Button disabled={!has_next || navigation.state === "loading"} size={"sm_icon"} onClick={()=> setSearchParams((prev) => {return {...prev, page: page + 1}})}>
          <ArrowRight size={22} />
        </Button>
    </div>
  )
}

export default Pagination;