import Razorpay from 'razorpay';
import { NextApiRequest, NextApiResponse } from "next";
import DodoPayments from 'dodopayments';
import { getSession ,useSession} from "next-auth/react";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import process from 'process';
import db from "@/core/db";
import { createTransport } from "nodemailer";

import fs from "fs"

import { jsPDF } from "jspdf";
import { autoTable } from 'jspdf-autotable'


const client =  new DodoPayments({
    bearerToken: process.env.DODO_API_KEY,
    environment:"test_mode"
  });


export default async function handler(request:NextApiRequest,response:NextApiResponse) {


    const session= await getServerSession(request,response,authOptions)
    console.log(session?.user?.email)
    const email = session?.user?.email as string
    let pdfData:any=""
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
    // const amount = request.body.amount/100
    // const planName= request.body.plan
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
      try {
        
        let x=   Math.floor((Math.random() * 100000));
        const invoiceNumber= "ST"+x
        const date = new Date();
 const day = date.getDate();
 const month = date.getMonth() + 1; // Month is 0-indexed, so add 1
 const year = date.getFullYear();
 const todayDate = day+"/"+month+"/"+year
         var data:any = {
 
           // Let's add a recipient
           "client": {
               "company": "Client Corp",
               "address": "Clientstreet 456",
               "zip": "4567 CD",
               "city": "Clientcity",
               "country": "Clientcountry"
           },
       
           // Now let's add our own sender details
           "sender": {
               "company": "SUPERRSHOTS TECHNOLOGIES",
               "address": "39C, Ashtalakshmi Nagar, Karanai Puducherry, Perumattunallur, Chengalpattu Dt",
               "zip": "603202",
               "city": "Chennai,Tamil Nadu",
               "country": "India",
               "GST NO" :"hasdhasdh213"
           },
       
           // Of course we would like to use our own logo and/or background on this invoice. There are a few ways to do this.
           "images": {
               //      Logo:
               // 1.   Use a url
               logo: "https://superrshotslogo.s3.ap-south-1.amazonaws.com/Layer_4.png",
               /*
                  2.   Read from a local file as base64
                       logo: fs.readFileSync('logo.png', 'base64'),
                  3.   Use a base64 encoded image string
                      \
                */
           },
       
           // Let's add some standard invoice data, like invoice number, date and due-date
           "information": {
               // Invoice number
               "number": invoiceNumber,
               // Invoice data
               "date":todayDate,
               // Invoice due date
              
           },
       
           // Now let's add some products! Calculations will be done automatically for you.
           "products": [
               {
                   "quantity": "1",
                   "description": `Superrshots ${project.plan}`,
                  
                   "price": project.amount
               },
 
           ],
         }

         const doc = new jsPDF();

         autoTable(doc, {
           body: [
             [
               {
                 content: 'SUPERRSHOTS TECHNOLOGIES',
                 
                 styles: {
                   halign: 'left',
                   fontSize: 20,
                  
                 }
               },
               {
                 content: 'Invoice',
                 styles: {
                   halign: 'right',
                   fontSize: 20,
                 
                 }
               }
             ],
           ],
           theme: 'plain',
 
         });
     
         autoTable(doc, {
           body: [
             [
               {
                 content: 'Reference: #INV0001'
                 +`\nDate: ${todayDate}`
                 +`\nInvoice number: ${invoiceNumber}`,
                 styles: {
                   halign: 'right'
                 }
               }
             ],
           ],
           theme: 'plain'
         });
     
         autoTable(doc, {
           body: [
             [
              
               {
                 content: 'From:'
                 +'\nSuperrshot technologies'
                 +'\n39C, Ashtalakshmi Nagar, Karanai Puducherry, Perumattunallur, Chengalpattu Dt'
                 +'\nChennai,Tamil Nadu,India'
                 +'\n603202'
                 +'\n"GST NO" :"hasdhasdh213"',
                 styles: {
                   halign: 'right'
                 }
               }
             ],
           ],
           theme: 'plain'
         });
     
 
     
         autoTable(doc, {
           body: [
             [
               {
                 content: 'Service Purchased',
                 styles: {
                   halign:'left',
                   fontSize: 14
                 }
               }
             ]
           ],
           theme: 'plain'
         });
     
         autoTable(doc, {
           head: [['Item',  'Quantity',  'Amount']],
           body: [
             [`Superrshots ${project.plan}`,  '1', "USD "+project.amount],
  
           ],
           theme: 'striped',
           headStyles:{
             fillColor: '#343a40'
           }
         });
     
         autoTable(doc, {
           body: [
             [
               {
                 content: 'Subtotal:',
                 styles:{
                   halign:'right'
                 }
               },
               {
                 content:"USD "+project.amount,
                 styles:{
                   halign:'right'
                 }
               },
             ],
             [
               {
                 content: 'Total tax:',
                 styles:{
                   halign:'right'
                 }
               },
               {
                 content: '0',
                 styles:{
                   halign:'right'
                 }
               },
             ],
             [
               {
                 content: 'Total amount:',
                 styles:{
                   halign:'right'
                 }
               },
               {
                 content: "USD "+project.amount,
                 styles:{
                   halign:'right'
                 }
               },
             ],
           ],
           theme: 'plain'
         });
     
 
 
 
 //doc.save("a4.pdf");
 const pdffile =doc.output("datauristring")
 console.log(pdffile)
         
         
         //  4.    Let's use the EasyInvoice library and call the "createInvoice" function

         const transporter =  createTransport(process.env.EMAIL_SERVER);
    
   
          const projectName= project.name
         const info = await transporter.sendMail({
           from: process.env.EMAIL_FROM,
           to: email,
           subject: "Payment Successful",
           text: "Payment successful", // plain‑text body
           html: html({projectName,email}),
          //  attachments:[{
          //   filename:"invoice.pdf",
          //   path:pdffile,
          //   //encoding:"base64"
          // }]
         })
         console.log(info)
       }
       catch(e){
         console.log(e)
       }
      return response.status(200).json({status:"success"})
    }
    else{
      return response.json({staus:"failed"})
    }
//  return NextResponse.json({ orderId: order.id }, { status: 200 });

}

function html(params: { projectName: string, email: string }) {
  const {  projectName, email } = params

  //const escapedHost = host.replace(/\./g, "&#8203;.")

  const brandColor =  "#346df1"
  const color = {
    background: "#f9f9f9",
    text: "#444",
    mainBackground: "#fff",
    buttonBackground: brandColor,
    buttonBorder: brandColor,
    buttonText:  "#fff",
  }

//   return `
// <body style="background: ${color.background};">
//   <table width="100%" border="0" cellspacing="20" cellpadding="0"
//     style="background: ${color.mainBackground}; max-width: 600px; margin: auto; border-radius: 10px;">
//     <tr>
//       <td align="center"
//         style="padding: 10px 0px; font-size: 22px; font-family: Helvetica, Arial, sans-serif; color: ${color.text};">
//         Sign in to <strong>${escapedHost}</strong>
//       </td>
//     </tr>
//     <tr>
//       <td align="center" style="padding: 20px 0;">
//         <table border="0" cellspacing="0" cellpadding="0">
//           <tr>
//             <td align="center" style="border-radius: 5px;" bgcolor="${color.buttonBackground}"><a href="${url}"
//                 target="_blank"
//                 style="font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: ${color.buttonText}; text-decoration: none; border-radius: 5px; padding: 10px 20px; border: 1px solid ${color.buttonBorder}; display: inline-block; font-weight: bold;">Sign
//                 in</a></td>
//           </tr>
//         </table>
//       </td>
//     </tr>
//     <tr>
//       <td align="center"
//         style="padding: 0px 0px 10px 0px; font-size: 16px; line-height: 22px; font-family: Helvetica, Arial, sans-serif; color: ${color.text};">
//         If you did not request this email you can safely ignore it kindly....
//       </td>
//     </tr>
//   </table>
// </body>
// `


return  `

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html dir="ltr" lang="en">
  <head>
    <meta name="viewport" content="width=device-width" />
    <link
      rel="preload"
      as="image"
      href="https://superrshotslogo.s3.ap-south-1.amazonaws.com/Group-6-2x.jpg" />
    <meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
    <meta name="x-apple-disable-message-reformatting" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="x-apple-disable-message-reformatting" />
    <meta
      name="format-detection"
      content="telephone=no,address=no,email=no,date=no,url=no" />
    <meta name="color-scheme" content="light" />
    <meta name="supported-color-schemes" content="light" />
    <!--$-->
    <style>
      @font-face {
        font-family: 'Inter';
        font-style: normal;
        font-weight: 400;
        mso-font-alt: 'sans-serif';
        src: url(https://rsms.me/inter/font-files/Inter-Regular.woff2?v=3.19) format('woff2');
      }

      * {
        font-family: 'Inter', sans-serif;
      }
    </style>
    <style>
      blockquote,h1,h2,h3,img,li,ol,p,ul{margin-top:0;margin-bottom:0}@media only screen and (max-width:425px){.tab-row-full{width:100%!important}.tab-col-full{display:block!important;width:100%!important}.tab-pad{padding:0!important}}
    </style>
  </head>
  <body style="margin:0">
    <div
      style="display:none;overflow:hidden;line-height:1px;opacity:0;max-height:0;max-width:0"
      id="__react-email-preview">
      Payment confirmed—your headshot magic is underway!
      <div>
         ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿
      </div>
    </div>
    <table
      align="center"
      width="100%"
      border="0"
      cellpadding="0"
      cellspacing="0"
      role="presentation"
      style="max-width:600px;min-width:300px;width:100%;margin-left:auto;margin-right:auto;padding:0.5rem">
      <tbody>
        <tr style="width:100%">
          <td>
            <table
              align="center"
              width="100%"
              border="0"
              cellpadding="0"
              cellspacing="0"
              role="presentation"
              style="max-width:37.5em;height:64px">
              <tbody>
                <tr style="width:100%">
                  <td></td>
                </tr>
              </tbody>
            </table>
            <table
              align="center"
              width="100%"
              border="0"
              cellpadding="0"
              cellspacing="0"
              role="presentation"
              style="margin-top:0px;margin-bottom:32px">
              <tbody style="width:100%">
                <tr style="width:100%">
                  <td align="left" data-id="__react-email-column">
                    <a
                      href="https://superrshotslogo.s3.ap-south-1.amazonaws.com/Group-6-2x.jpg"
                      rel="noopener noreferrer"
                      style="display:block;max-width:100%;text-decoration:none"
                      target="_blank"
                      ><img
                        title="Image"
                        alt="Image"
                        src="https://superrshotslogo.s3.ap-south-1.amazonaws.com/Group-6-2x.jpg"
                        style="display:block;outline:none;border:none;text-decoration:none;width:326.25px;height:40px;max-width:100%;border-radius:0"
                    /></a>
                  </td>
                </tr>
              </tbody>
            </table>
            <p
              style="font-size:15px;line-height:26.25px;margin-bottom:16px;margin-top:16px;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;color:#374151;margin:0 0 20px 0">
              Hey there,
            </p>
            <p
              style="font-size:15px;line-height:26.25px;margin-bottom:16px;margin-top:16px;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;color:#374151;margin:0 0 20px 0">
              We’ve received your payment—thanks a bunch! 🎉 Your uploaded
              selfies are now in our AI lab coat, getting trained to craft those
              flawless, studio-quality headshots.
            </p>
            <p
              style="font-size:15px;line-height:26.25px;margin-bottom:16px;margin-top:16px;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;color:#374151;margin:0 0 20px 0">
              <br /><strong>ETA:</strong> In about 30 minutes, your fresh new
              headshots will land in your inbox.
            </p>
            <p
              style="font-size:15px;line-height:26.25px;margin-bottom:16px;margin-top:16px;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;color:#374151;margin:0 0 20px 0">
              Sit back, grab a coffee, and we’ll let you know the moment they’re
              ready to shine.
            </p>
            <p
              style="font-size:15px;line-height:26.25px;margin-bottom:16px;margin-top:16px;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;color:#374151;margin:0 0 20px 0">
              Got questions? Just hit reply—we’re here for you.
            </p>
            <p
              style="font-size:15px;line-height:26.25px;margin-bottom:16px;margin-top:16px;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;color:#374151;margin:0 0 20px 0">
              Catch you soon,<br /><strong>Team Superrshots</strong> ❤️
            </p>
          </td>
        </tr>
      </tbody>
    </table>
    <!--/$-->
  </body>
</html>


`

}