import Razorpay from 'razorpay';
import { NextApiRequest, NextApiResponse } from "next";

const razorpay = new Razorpay({
 key_id: process.env.RAZORPAY_KEY_ID!,
 key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export default async function handler(request:NextApiRequest,response:NextApiResponse) {
    console.log(request.body)
//  const { amount, currency } = (await request.json()) as {
//   amount: string;
//   currency: string;
//  };
const amount =  request.body.amount as string
const currency= request.body.currency as string
 var options = {
  amount: amount,
  currency: currency,
  receipt: 'rcp2',
 };
 const order = await razorpay.orders.create(options);
 console.log(order);
//  return NextResponse.json({ orderId: order.id }, { status: 200 });
return response.status(200).json({orderId: order.id})
}