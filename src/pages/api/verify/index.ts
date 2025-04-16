import { NextApiRequest, NextApiResponse } from "next";
import crypto from 'crypto';
import db from "@/core/db";

const generatedSignature = (
 razorpayOrderId: string,
 razorpayPaymentId: string
) => {
 const keySecret = process.env.RAZORPAY_KEY_SECRET;
 if (!keySecret) {
  throw new Error(
   'Razorpay key secret is not defined in environment variables.'
  );
 }
 const sig = crypto
  .createHmac('sha256', keySecret)
  .update(razorpayOrderId + '|' + razorpayPaymentId)
  .digest('hex');
 return sig;
};


export default async function handler(request: NextApiRequest,response:NextApiResponse) {
    console.log(request.body)
 const  orderCreationId= request.body.orderCreationId as string
 const razorpayPaymentId=  request.body.razorpayPaymentId as string
 const razorpaySignature = request.body.razorpaySignature as string  
 const ppi=request.body.ppi as string
  //await request.json();

 const signature = generatedSignature(orderCreationId, razorpayPaymentId);
 if (signature !== razorpaySignature) {
  return response.status(400).json(
   { message: 'payment verification failed', isOk: false }
   
  );
 }
 else{

    await db.project.update({
        where: { id: ppi },
        data: { stripePaymentId: orderCreationId },
      });
 return response.status(200).json(
  { message: 'payment verified successfully', isOk: true },

 );
 }
}