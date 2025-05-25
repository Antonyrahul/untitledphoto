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
  Stack,
  Heading,
  Divider,
  ListItem,
  ListIcon,
  Grid
} from "@chakra-ui/react";
import { Project } from "@prisma/client";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { CheckedListItem } from "../home/Pricing";
import Script from 'next/script';
import PricingBox from './PricingBox'
//import { prices } from "./data";
import { HiBadgeCheck } from "react-icons/hi";

import { getSession ,useSession} from "next-auth/react";

const FormPayment = ({
  project,
  handlePaymentSuccess,
}: {
  project: Project;
  handlePaymentSuccess: () => void;
}) => {
  const [waitingPayment, setWaitingPayment] = useState(false);
  const { query } = useRouter();
  const [amount,setAmount]=useState("4800")
  const [plan,setPlan] =useState("noplan")

  useQuery(
    "check-payment",
    () =>
      axios.get(`/api/checkout/check/${query.ppi}/${query.session_id}/plan/studio`),
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

  const natcur = localStorage.getItem("natcur")
  const session = useSession()
  console.log("the seesion in dashboarsd is",session)
const prices:any = [
  // {
  //   name: "Starter",
  //   features: new Array(3).fill(null).map((e) => "Lorem iptsum dolor"),
  //   info: "Fusce purus tellus, tristique quis libero sit amet..."
  // },
  {
    name: "pro",
    price: natcur=="IN"?"₹2999":"$40",
    amount:natcur=="IN"?"2999":"40",
    //popular: true,
    features: ["40 Professional Headshots","Ready in 90 minutes"],
    info: "Fusce purus tellus, tristique quis libero sit amet..."
  },
  {
    name: "business",
    price: natcur=="IN"?"₹5999":"$70",
    amount:natcur=="IN"?"5999":"70",
    features:["100 Professional Headshots","Ready in 60 minutes"],
    info: "Fusce purus tellus, tristique quis libero sit amet..."
  },
  {
    name: "special",
    price: natcur=="IN"?"₹9999":"$100",
    amount:natcur=="IN"?"9999":"100",
    features: ["200 Professional Headshots","Ready in 15 minutes"],
    info: "Fusce purus tellus, tristique quis libero sit amet..."
  }
];

  const createOrderId = async (price:any) => {
    try {
     const response = await fetch('/api/order/', {
      method: 'POST',
      headers: {
       'Content-Type': 'application/json',
      },
      body: JSON.stringify({
       amount: parseFloat(price)*100,
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


   const processPayment:any = async (e: React.FormEvent<HTMLFormElement>,price:any) => {
    e.preventDefault();
    console.log("in payment",price)
    if(localStorage.getItem("natcur")=="IN")
    {
    try {
     const orderId: string = await createOrderId(price);
     const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: parseFloat(price) * 100,
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
        ppi:project.id,
        projectName:project.name
        
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
  }
  else{
    const project_id=project.id

        const dodoPay = await axios.post("/api/dodo",{project_id})
        console.log(dodoPay)
        window.open(dodoPay.data.payment.payment_link,"_self")

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
          {/* <Box fontWeight="black" fontSize="3.5rem">
            {"₹4800"}
            <Box
              ml={1}
              as="span"
              fontWeight="500"
              color="coolGray.400"
              fontSize="1.2rem"
            >
              / studio
            </Box>
          </Box> */}
          <Box fontWeight="bold" fontSize="xl">
            Your Studio is ready to be trained!
          </Box>
          {/* <List textAlign="left" spacing={1}>
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
          </List> */}
          {/* <Button
            //as={Link}
            variant="brand"
            //href={`/api/checkout/session?ppi=${project.id}`}
            onClick={processPayment}
          >
            Unlock Now - {formatStudioPrice()}
          </Button> */}

<Grid
        w="full"
        gap={5}
        justifyContent="center"
        templateColumns={{
          base: "inherit",
          md: "repeat( auto-fit, 250px )"
        }}
      >
        {prices.map((price:any) => (
          
                <Stack key={price.name}
                //spacing={2}
                border="3px solid"
                borderColor={price.popular ? "teal.300" : "gray.300"}
                borderRadius="0.7rem"
                p={4}
                h="350px"
                backgroundColor="white"
                position="relative"
              >
                {price.popular && (
                  <Box
                    position="absolute"
                    top="0"
                    right="0"
                    backgroundColor="teal.300"
                    color="white"
                    paddingX={2}
                    paddingY={1}
                    borderRadius="0 0 0 0.7rem"
                    fontSize="0.8rem"
                  >
                    POPULAR
                  </Box>
                )}
                <Text textTransform="uppercase">{price.name}</Text>
                
                  <Heading>{price.price ?? "Free"}</Heading>
                  
              
                <Divider borderColor="blackAlpha.500" />
                <List flex="1">
                  {price.features.map((feat:any) => (
                    <ListItem textAlign={"left"} key={Math.random()}>
                       {/* <ListIcon as={CheckCircleIcon} color="gray.400" />  */}
                       <ListIcon fontSize="xl" as={HiBadgeCheck} />
                      {feat}
                    </ListItem>
                  ))}
                </List>
                <Box>
                  <Button
                  
                    variant="solid"
                    size="sm"
                    width="100%"
                    // rightIcon={<ArrowForwardIcon />}
                    borderRadius={0}
                    display=""
                    justifyContent="space-between"
                    backgroundColor={price.popular ? "teal.300" : "black"}
                    _hover={{
                      backgroundColor: price.popular ? "teal.500" : "gray.300",
                      color:"black"
                    }}
                    color=" white"
                     onClick={(e:any)=>processPayment(e,price.amount)}
                  >
                    Buy
                  </Button>
                  
                </Box>
              </Stack>
        ))}
      </Grid>
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
