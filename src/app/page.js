"use client";

import { UserCard } from "@/components/UserCard";
import { cleanUser } from "@/libs/cleanUser";
import axios from "axios";
import { useEffect, useState } from "react";

export default function RandomUserPage() {
  //user = null or array of object
  const [users, setUsers] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [genAmount, setGenAmount] = useState(1);
  const [isFirstLoad, setFirstLoad] = useState(true);

  useEffect(()=>{
    if(isFirstLoad){
      setFirstLoad(false)
      return;
    }
    const strUsers = JSON.stringify(genAmount);
    localStorage.setItem("genAmount",strUsers);

  }, [genAmount]);

  useEffect(()=>{
    const strAmount = localStorage.getItem("genAmount");
    if(strAmount === null){
      setGenAmount([]);
      return;
    }
    const loadedAmount = JSON.parse(strAmount);
    setGenAmount(loadedAmount);
  } ,[]);

  const generateBtnOnClick = async () => {
    setIsLoading(true);
    const resp = await axios.get(
      `https://randomuser.me/api/?results=${genAmount}`
    );
    setIsLoading(false);
    const users = resp.data.results;
    //Your code here
    //Process result from api response with map function. Tips use function from /src/libs/cleanUser
    //Then update state with function : setUsers(...)
    const cleanedUser = users.map((n) =>cleanUser(n));
    console.log(cleanUser);
    setUsers(cleanedUser);
  };

  return (
    <div style={{ maxWidth: "700px" }} className="mx-auto">
      <p className="display-4 text-center fst-italic m-4">Users Generator</p>
      <div className="d-flex justify-content-center align-items-center fs-5 gap-2">
        Number of User(s)
        <input
          className="form-control text-center"
          style={{ maxWidth: "100px" }}
          type="number"
          onChange={(e) => setGenAmount(e.target.value)}
          value={genAmount}
        />
        <button className="btn btn-dark" onClick={generateBtnOnClick}>
          Generate
        </button>
      </div>
      {isLoading && (
        <p className="display-6 text-center fst-italic my-4">Loading ...</p>
      )}
      {users && !isLoading && users.map((n)=> (
      <UserCard 
      key = {n.email}
      name ={n.name} 
      imgUrl={n.imgUrl} 
      address={n.address} 
      email={n.email}/> ))}
    </div>
  );
}
