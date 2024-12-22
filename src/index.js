import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import StarRating from "./star";
import './index.css';
import App from './App';
import App2 from "./App2";
// import Challenge from "./challenge";

function Test() {
  const[mov,setMov] = useState(0)
  return(
    <>
    
    <StarRating maxRating={10} color="blue" onsetMove={setMov} />
    <p> its very nice good job {mov} </p>
    </>
  )
}



const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
 
 {/* <Challenge/> */}
 
     {/* <App2  /> */}
    {/* <StarRating
      maxRating={5}
      massages={["veryBad", "bad", "norm", "good", "veryGood"]}
      defaultRating ={3}
      
    />
    <StarRating size={20} color="green" /> */}
    {/* < Test/> */}
  </React.StrictMode>
);
