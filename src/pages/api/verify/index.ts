import { NextApiRequest, NextApiResponse } from "next";
import crypto from 'crypto';
import db from "@/core/db";
import { createTransport } from "nodemailer";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

import fs from "fs"

import { jsPDF } from "jspdf";
import { autoTable } from 'jspdf-autotable'





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

  const session= await getServerSession(request,response,authOptions)
  console.log(session?.user?.email)
  const email = session?.user?.email as string
    console.log(request.body)
 const  orderCreationId= request.body.orderCreationId as string
 const razorpayPaymentId=  request.body.razorpayPaymentId as string
 const razorpaySignature = request.body.razorpaySignature as string  
 const ppi=request.body.ppi as string
 const projectName= request.body.projectName as string
 const amount = request.body.amount/100
 const planName= request.body.plan
 let pdfData:any=""
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

      try {
        
       let x=   Math.floor((Math.random() * 100000));
       const invoiceNumber= "ST"+x
       const date = new Date();
const day = date.getDate();
const month = date.getMonth() + 1; // Month is 0-indexed, so add 1
const year = date.getFullYear();
const todayDate = day+"/"+month+"/"+year

const invoice = {
	shipping: {
		name: 'John Doe',
		address: '1234 Main Street',
		city: 'San Francisco',
		state: 'CA',
		country: 'US',
		postal_code: 94111,
	},
	items: [
		{
			item: 'TC 100',
			description: 'Toner Cartridge',
			quantity: 2,
			amount: 6000,
		},
		{
			item: 'USB_EXT',
			description: 'USB Cable Extender',
			quantity: 1,
			amount: 2000,
		},
	],
	subtotal: 8000,
	paid: 0,
	invoice_nr: 1234,
};
        var data:any = {

          // Let's add a recipient
          // "client": {
          //     "company": "Client Corp",
          //     "address": "Clientstreet 456",
          //     "zip": "4567 CD",
          //     "city": "Clientcity",
          //     "country": "Clientcountry"
          // },
      
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
                  "description": `Superrshots ${planName}`,
                 
                  "price": "₹"+amount
              },

          ],
        }
        
        //  4.    Let's use the EasyInvoice library and call the "createInvoice" function
        // await easyinvoice.createInvoice(data, function (result) {
        //     /*  
        //         5.  The 'result' variable will contain our invoice as a base64 encoded PDF
        //             Now let's save our invoice to our local filesystem so we can have a look!
        //             We will be using the 'fs' library we imported above for this.
                    
        //     */
        //     fs.writeFileSync("invoice.pdf", result.pdf, 'base64');
        //     pdfData=result.pdf
        //   });

         
        //  getStream.

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
            [`Superrshots ${planName}`,  '1', "RS "+amount],
 
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
                content:"RS "+amount,
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
                content: "RS "+amount,
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
        
        const transporter =  createTransport(process.env.EMAIL_SERVER);
   
  
  
        const info = await transporter.sendMail({
          from: process.env.EMAIL_FROM,
          to: email,
          subject: "Payment confirmed—your headshot magic is underway!",
          text: "Payment confirmed—your headshot magic is underway!", // plain‑text body
          html: html({razorpayPaymentId,projectName,email}),
          attachments:[{
            filename:"invoice.pdf",
            path:pdffile,
            //encoding:"base64"
          }]
        })
        console.log(info)
      }
      catch(e){
        console.log(e)
      }
 return response.status(200).json(
  { message: 'payment verified successfully', isOk: true },

 );
 }
}

function html(params: { razorpayPaymentId: string, projectName: string, email: string }) {
  const { razorpayPaymentId, projectName, email } = params

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


// return  `

// <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
// <html xmlns="http://www.w3.org/1999/xhtml" lang="en">
// <head>
//   <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
//   <title>Sign In to Your Account</title>
//   <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
//   <style type="text/css">
//     /* Client-specific resets */
//     body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
//     table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; } /* Outlook-specific spacing reset */
//     img { -ms-interpolation-mode: bicubic; } /* Improves image rendering in Outlook */

//     /* General Resets */
//     img { border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
//     table { border-collapse: collapse!important; }
//     body { height: 100%!important; margin: 0!important; padding: 0!important; width: 100%!important; }
//   </style>
// </head>
// <body style="margin: 0; padding: 0; background-color: #FFF9ED;">
//   <table border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation">
//     <tr>
//       <td align="center" style="padding: 20px 0 30px 0; background-color: #FFF9ED;">
//         <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="border-collapse: collapse; max-width: 600px; background-color: #FFF9ED;" role="presentation">
//           <tr>
//             <td align="center" style="padding: 40px 0 30px 0;">
//                <img src="https://superrshotslogo.s3.ap-south-1.amazonaws.com/Layer_4.png" width="150" style="display: block; width: 150px; max-width: 150px; min-width: 150px; font-family: Arial, sans-serif; color: #333333; font-size: 18px;" border="0">

              
//               </td>
//           </tr>
//           <tr>
//             <td bgcolor="#FFF9ED" style="padding: 20px 30px 20px 30px;">
//               <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;" role="presentation">
//                 <tr align="centre>
//                   <td align="centre" style="color: #153643; font-family: Arial, sans-serif; font-size: 24px; font-weight: bold; padding-bottom: 10px;">
//                     HELLO
//                   </td>
//                 </tr>
//                 <tr align= "centre">
//                   <td style="color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 24px; padding-bottom: 20px;">
//                     Your payment is successful for project <b>${projectName}</b>
//                   </td>
//                 </tr>
//                 <tr align= "centre">
//                 <td style="color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 24px; padding-bottom: 20px;">
//                   You can return to the project and start training using this link
//                 </td>
//               </tr>
//               <tr align= "centre">
//               <td style="color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 24px; padding-bottom: 20px;">
//                 <a href=${process.env.NEXTAUTH_URL}/dashboard>SUPERRSHOTS DASHBOARD</a>
//               </td>
//             </tr>
//               </table>
//             </td>
//           </tr>
 
//           <tr>
//             <td bgcolor="#000000" style="padding: 30px 30px 30px 30px;">
//               <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;" role="presentation">
//                 <tr>
//                   <td style="color: #FFFFFF; font-family: Arial, sans-serif; font-size: 14px; line-height: 18px; text-align: center;">
//                     &copy; 2025 Superrshots Technologies. All rights reserved.<br>
                   
//                   </td>
//                 </tr>
//               </table>
//             </td>
//           </tr>
//         </table>
//         </td>
//     </tr>
//   </table>
//   </body>
// </html>

// `

return `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html dir="ltr" lang="en">
  <head>
    <meta name="viewport" content="width=device-width" />
    <link
      rel="preload"
      as="image"
      href="https://i.ibb.co/35M5YtmS/Group-6-2x.jpg" />
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
                      href="https://i.ibb.co/35M5YtmS/Group-6-2x.jpg"
                      rel="noopener noreferrer"
                      style="display:block;max-width:100%;text-decoration:none"
                      target="_blank"
                      ><img
                        title="Image"
                        alt="Image"
                        src="https://i.ibb.co/35M5YtmS/Group-6-2x.jpg"
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