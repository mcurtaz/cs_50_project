import { useContext } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { UserContext } from "@/store/UserContext"

const Profile: React.FC = () => {
    const navigate = useNavigate();
    const {user} = useContext(UserContext);

    return (
      <div className="w-full h-full flex flex-col px-6 pt-6 pb-3">
        <h1 className="text-center text-3xl font-semibold">PROFILE</h1>
        <div className="mt-12 flex flex-col items-center">
          <div className="grid w-full max-w-sm gap-1.5 mb-8">
            <Label htmlFor="email">Email</Label>
            <Input className="bg-gray-200" readOnly type="email" name="email" value={user.email!}/>
          </div>
          <div className="grid w-full max-w-sm gap-1.5 mb-10">
            <Label htmlFor="email">User ID</Label>
            <Input className="bg-gray-200" readOnly type="text" name="id" value={user.id!}/>
          </div>
          <Button className="bg-pink-500" type="button" onClick={()=> {navigate("/logout")}}>Logout</Button>
        </div>
      </div>
    )
}

export default Profile;