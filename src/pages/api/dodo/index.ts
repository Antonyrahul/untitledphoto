import Razorpay from 'razorpay';
import { NextApiRequest, NextApiResponse } from "next";
import DodoPayments from 'dodopayments';
import { getSession ,useSession} from "next-auth/react";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import process from 'process';
import db from "@/core/db";
import { userAgent } from 'next/server';
const client =  new DodoPayments({
    bearerToken: "44Z5CWzCwJCbTcq1.CtfDSiDmiF7f-ezmIqNhRr4UOYhZLr74uuEV8JgpOSZLRimP",
    environment:"test_mode"
  });


export default async function handler(request:NextApiRequest,response:NextApiResponse) {

    const session = await getServerSession(request,response,authOptions)
    console.log("in else for not india",session)
    const user = await db.user.findFirstOrThrow({
      where: { email: session?.user?.email },
    });
    let customer_id=""
    if(!user.dodoCustId){
      const customer = await client.customers.create({ email: session?.user?.email as string, name: 'antony' });

      console.log(customer);
      const userupdate = await db.user.update({
        where: { id: user.id },
        data:{dodoCustId:customer.customer_id}
      });
      customer_id=customer.customer_id

    }
    else{
      customer_id=user.dodoCustId
    }


    const payment = await client.payments.create({
        billing: { city: 'city', country: 'SG', state: 'state', street: 'street', zipcode: 'zipcode' },
        customer: { customer_id: customer_id },
        product_cart: [{ product_id: 'pdt_o2dk8mR3Z4DM95VpCkPxK', quantity: 1 }],
        payment_link:true,
        return_url:process.env.NEXTAUTH_URL+"/payment"
      });
      console.log(payment)
      const project = await db.project.update({
        where: { id: request.body.project_id },
        data: { dodoPaymentId: payment.payment_id },
      });
//  return NextResponse.json({ orderId: order.id }, { status: 200 });
return response.status(200).json({payment})
}