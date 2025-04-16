import { formatStudioPrice } from "@/core/utils/prices";
import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  List,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Project } from "@prisma/client";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { CheckedListItem } from "../home/Pricing";
import Script from 'next/script';


const FormPayment = ({
  project,
  handlePaymentSuccess,
}: {
  project: Project;
  handlePaymentSuccess: () => void;
}) => {
  const [waitingPayment, setWaitingPayment] = useState(false);
  const { query } = useRouter();
  const [amount,setAmount]=useState("1000")

  useQuery(
    "check-payment",
    () =>
      axios.get(`/api/checkout/check/${query.ppi}/${query.session_id}/studio`),
    {
      cacheTime: 0,
      refetchInterval: 10,
      enabled: waitingPayment,
      onSuccess: () => {
        handlePaymentSuccess();
      },
    }
  );

  useEffect(() => {
    setWaitingPayment(query.ppi === project.id);
  }, [query, project]);

  const createOrderId = async () => {
    try {
     const response = await fetch('/api/order/', {
      method: 'POST',
      headers: {
       'Content-Type': 'application/json',
      },
      body: JSON.stringify({
       amount: parseFloat(amount)*100,
       currency:"INR"
      })
     });
  
     if (!response.ok) {
      throw new Error('Network response was not ok');
     }
  
     const data = await response.json();
     return data.orderId;
    } catch (error) {
     console.error('There was a problem with your fetch operation:', error);
    }
   };


   const processPayment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("in payment")
    try {
     const orderId: string = await createOrderId();
     const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: parseFloat(amount) * 100,
      currency: "INR",
      name: 'UntitiledOne',
      description: 'Payment for image genration',
      order_id: orderId,
      // callback_url: `${process.env.NEXTAUTH_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}&ppi=${project.id}`,
      handler: async function (response: any) {
       const data = {
        orderCreationId: orderId,
        razorpayPaymentId: response.razorpay_payment_id,
        razorpayOrderId: response.razorpay_order_id,
        razorpaySignature: response.razorpay_signature,
        ppi:project.id
       };
  
       const result = await fetch('/api/verify', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' },
       });
       const res = await result.json();
       if (res.isOk) {alert("payment succeed");
       handlePaymentSuccess()
      
      }
       else {
        alert(res.message);
       }
      },
      prefill: {
       name: "dfsdfsdfsd",
       email: "dfsfd@eds.sdfsdf",
      },
      theme: {
       color: '#3399cc',
      },
     };
     const paymentObject = new (window as any).Razorpay(options);
     paymentObject.on('payment.failed', function (response: any) {
      alert(response.error.description);
     });
     paymentObject.open();
    } catch (error) {
     console.log(error);
    }
   };

  return (
    
    <Box textAlign="center" width="100%">
      <Script
    id="razorpay-checkout-js"
    src="https://checkout.razorpay.com/v1/checkout.js"
   />
      {waitingPayment ? (
        <Box>
          <Spinner speed="1s" size="xl" />
          <Text mt={2} size="sm">
            Validating payment
          </Text>
        </Box>
      ) : (
        <VStack spacing={4}>
          <Box fontWeight="black" fontSize="3.5rem">
            {formatStudioPrice()}
            <Box
              ml={1}
              as="span"
              fontWeight="500"
              color="coolGray.400"
              fontSize="1.2rem"
            >
              / studio
            </Box>
          </Box>
          <Box fontWeight="bold" fontSize="xl">
            Your Studio is ready to be trained!
          </Box>
          <List textAlign="left" spacing={1}>
            <CheckedListItem>
              <b>1</b> Studio with a <b>custom trained model</b>
            </CheckedListItem>
            <CheckedListItem>
              <b>{process.env.NEXT_PUBLIC_STUDIO_SHOT_AMOUNT}</b> avatars 4K
              generation
            </CheckedListItem>
            <CheckedListItem>
              <b>30</b> AI prompt assists
            </CheckedListItem>
            <CheckedListItem>
              Your Studio will be deleted 24 hours after your credits are
              exhausted
            </CheckedListItem>
          </List>
          <Button
            //as={Link}
            variant="brand"
            //href={`/api/checkout/session?ppi=${project.id}`}
            onClick={processPayment}
          >
            Unlock Now - {formatStudioPrice()}
          </Button>
          <Box pt={4}>
            <AvatarGroup size="md" max={10}>
              {project.imageUrls.map((url) => (
                <Avatar key={url} src={url} />
              ))}
            </AvatarGroup>
          </Box>
        </VStack>
      )}
    </Box>
  );
};

export default FormPayment;
