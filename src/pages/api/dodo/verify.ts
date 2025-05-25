import Razorpay from 'razorpay';
import { NextApiRequest, NextApiResponse } from "next";
import DodoPayments from 'dodopayments';
import { getSession ,useSession} from "next-auth/react";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import process from 'process';
import db from "@/core/db";

const client =  new DodoPayments({
    bearerToken: "44Z5CWzCwJCbTcq1.CtfDSiDmiF7f-ezmIqNhRr4UOYhZLr74uuEV8JgpOSZLRimP",
    environment:"test_mode"
  });


export default async function handler(request:NextApiRequest,response:NextApiResponse) {

    const session = await getServerSession(request,response,authOptions)
    console.log("in else for not india",session)
    // const customer = await client.customers.create({ email: session?.user?.email as string, name: 'antony' });

    // console.log(customer);
    // const payment = await client.payments.create({
    //     billing: { city: 'city', country: 'SG', state: 'state', street: 'street', zipcode: 'zipcode' },
    //     customer: { customer_id: customer.customer_id },
    //     product_cart: [{ product_id: 'pdt_o2dk8mR3Z4DM95VpCkPxK', quantity: 1 }],
    //     payment_link:true,
    //     return_url:process.env.NEXTAUTH_URL+"/payment"
    //   });
    //   console.log(payment)
    console.log("in verify")
    console.log(request.body)
    const payment = await client.payments.retrieve(request.body.payment_id);

    console.log(payment);
    if(payment.status=="succeeded"){
      const project = await db.project.findFirstOrThrow({
        where: { dodoPaymentId: request.body.payment_id },
      });
      console.log(project)

      const projectupdate = await db.project.update({
        where: { id: project.id },
        data: { stripePaymentId: request.body.payment_id },
      });
      console.log(projectupdate)
      return response.status(200).json({status:"success"})
    }
    else{
      return response.json({staus:"failed"})
    }
//  return NextResponse.json({ orderId: order.id }, { status: 200 });

}