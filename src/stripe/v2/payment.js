import { useEffect, useState } from "react";
import './payment.css';
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./checkoutform";
import { loadStripe } from "@stripe/stripe-js";

//pk_test_51Pq6bEKwzyQ722nbJecUnqMxPJjUegLhBKp77XVS9GyfLJg0t8y9SHDfJGMkO4np7iXBak6x1joCWEibP2hmmM4f00jCX5ITqn

function Payment() {
  const [stripePromise, setStripePromise] = useState(null);
  const [clientSecret, setClientSecret] = useState("");
  const [transactionId, setTransactionId] = useState(null)

  // const {customer_id, package_id} = useLocation()

  useEffect(()=>{
    const queryParameters = new URLSearchParams(window.location.search)
    const customer_id = queryParameters.get("customer_id")
    const package_id = queryParameters.get("package_id")

    console.log("Customer ID")
    console.log(customer_id)

    console.log("Package ID")
    console.log(package_id)
    if(clientSecret==="" && stripePromise==null)
    {
      prepareAndInitiatePayment(customer_id,package_id)
    }
  })

  const prepareAndInitiatePayment = (customerId, packageId)=>
  {
    fetch("http://localhost:6336/action/payment/pay_config").then(async (r) => {
      const raw_data = await r.json();
      console.log("Raw data [key] :")
      console.log(raw_data)
      const pk = raw_data[0].Attributes.pkey;
      setStripePromise(loadStripe(pk));
    });
    
    var transaction="";
    if(transactionId == null)
    {
      transaction = generateNewTransactionId();
      setTransactionId(transaction);

      fetch("http://localhost:6336/action/payment/initiate_transaction", {
        method: "POST",
        body: JSON.stringify({ 
          transaction_id : transaction, 
          currency: "usd", 
          customer_id : customerId, 
          package_id: packageId}),
      }).then(async (result) => {
        console.log("Status code")
        var response = await result.status
        console.log(response)
        if(result.ok)
        {
        var resp = await result.json();
        console.log("Raw data init :")
        console.log(resp)
        const secretKey = resp[0].Attributes.render_cs;
        console.log(secretKey)
        setClientSecret(secretKey);
        }
      }, async(error)=>{
        console.log("Exception returned")
        console.log(error)
      });
    }
  }

  // http://localhost:6336/action/payment/cpi

  const generateNewTransactionId = ()=> {
    return Math.random().toString(36).slice(2)
}

  // useEffect(() => {
    
  // }, []);

  return (
    <>
      <h1>React Stripe and the Payment Element</h1>
      <div className="payform">
      {clientSecret && stripePromise && (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <CheckoutForm transactionId={transactionId}/>
        </Elements>
      )}
      </div>
    </>
  );
}

export default Payment;