import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

function Completion(props) {
    
    const [status, setStatus] = useState("Processing")
    const [currentCredits,setCurrentCredits] = useState(0)
    const { state } = useLocation()
    
    useEffect(()=>{
      console.log("In Status")
      setTimeout(() => {
        console.log("Transaction Id")
      var transaction = state.transaction_id;
      console.log(transaction)

      console.log("API status")
      var stat = state.payment_status;
      console.log(stat)
      setStatus(stat)
      verifyFromDaptin(transaction)
    }, 3000);
    })

    const verifyFromDaptin = (transaction)=> {

        fetch("http://localhost:6336/action/payment/get_transaction_status", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ transaction_id: transaction }),
      }).then(async (result) => {
        if (!result.ok) {
          throw new Error(`Response status: ${result.status}`)
        }
        var json = await result.json()
        console.log("RETURN JSON 1")
        console.log(json)
        var customerId = json[0].Attributes[0].customer_id
        fetch("http://localhost:6336/action/credits/calc_credit_v2", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ customer_id: customerId }),
        }).then(async (result) => {
            json = await result.json()
            console.log("RETURN JSON 2")
            console.log(json)
            var creditCount = json[0].Attributes.value2
            setCurrentCredits(creditCount)
        
          }, async(error)=>{
            console.log("Exception returned 2")
            console.log(error)
          });
        }, async(error)=>{
          console.log("Exception returned 1")
          console.log(error)
        });
    }

    return (
      <div>
        <h3>Status : {status}</h3>
        <p>Your current credits : {currentCredits}</p>
      </div>
    
  );

  }
  
  export default Completion;