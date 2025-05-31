import { PrismaAdapter } from "@next-auth/prisma-adapter";
import NextAuth, { NextAuthOptions } from "next-auth";
import EmailProvider from "next-auth/providers/email";
import db from "@/core/db";
import { createTransport } from "nodemailer"
import s3Client from "@/core/clients/s3";
import { DeleteObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";

import {
  Mjml,
  
  MjmlBody,
  MjmlButton,
  MjmlColumn,
  MjmlImage,
  MjmlSection,
  MjmlText,
  MjmlWrapper,
} from "mjml-react";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  providers: [
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
      async sendVerificationRequest({
        identifier: email,
        url,
        provider: { server, from },
     }) {
        const { host } = new URL(url);
        const transport = createTransport(server);
        await transport.sendMail({
           to: email,
           from,
           subject: `Welcome to ⚡ Superrshots — your magic link inside!`,
           text: "Welcome to ⚡ Superrshots — your magic link inside!",
           html: html({ url, host, email }),
        });
     },
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      console.log("session is auth is ",session)
      console.log("user in nextauth is",user)
      checkNewUser(user.id)
      
      
      
      session.userId = user.id;
      return session;
    },

    
  },
  pages: {
    signIn: "/login",
    verifyRequest: "/login?verifyRequest=1",
  },
  secret: process.env.SECRET,
};

function html(params: { url: string, host: string, email: string }) {
  const { url, host, email } = params

  const escapedHost = host.replace(/\./g, "&#8203;.")

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
      Sign in to Superrshots. You are one step closer in creating perfect
      headshots
      <div>
         ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿
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
            <h2
              style="margin-left:0px;margin-right:0px;margin-top:0px;margin-bottom:12px;text-align:left;color:#111827;font-size:30px;line-height:36px;font-weight:700">
              <span style="color:#000000">Sign in to </span
              ><span style="color:rgb(0, 0, 0)">⚡️</span
              ><span style="color:#000000">Superrshots</span>
            </h2>
            <p
              style="font-size:15px;line-height:26.25px;margin-bottom:16px;margin-top:16px;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;color:#374151;margin:0 0 20px 0">
               
            </p>
            <p
              style="font-size:15px;line-height:26.25px;margin-bottom:16px;margin-top:16px;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;color:#374151;margin:0 0 20px 0">
              Hey there,
            </p>
            <p
              style="font-size:15px;line-height:26.25px;margin-bottom:16px;margin-top:16px;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;color:#374151;margin:0 0 20px 0">
              Welcome to Superrshots—where AI meets pro photography to craft
              natural, artifact-free headshots you’ll actually want to use.
            </p>
            <p
              style="font-size:15px;line-height:26.25px;margin-bottom:16px;margin-top:16px;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;color:#374151;margin:0 0 20px 0">
              Just click your magic link to sign in and get started
            </p>
            <table
              align="center"
              width="100%"
              border="0"
              cellpadding="0"
              cellspacing="0"
              role="presentation"
              style="max-width:100%;text-align:left;margin-bottom:20px">
              <tbody>
                <tr style="width:100%">
                  <td>
                    <a
                      href=${url}
                      style="line-height:100%;text-decoration:none;display:inline-block;max-width:100%;mso-padding-alt:0px;color:#ffffff;background-color:#FF6534;border-color:#FF6534;border-width:2px;border-style:solid;font-size:14px;font-weight:500;border-radius:6px;padding:12px 32px 12px 32px"
                      target="_blank"
                      ><span
                        ><!--[if mso]><i style="mso-font-width:400%;mso-text-raise:18" hidden>&#8202;&#8202;&#8202;&#8202;</i><![endif]--></span
                      ><span
                        style="max-width:100%;display:inline-block;line-height:120%;mso-padding-alt:0px;mso-text-raise:9px"
                        >Sign me in</span
                      ><span
                        ><!--[if mso]><i style="mso-font-width:400%" hidden>&#8202;&#8202;&#8202;&#8202;&#8203;</i><![endif]--></span
                      ></a
                    >
                  </td>
                </tr>
              </tbody>
            </table>
            <p
              style="font-size:15px;line-height:26.25px;margin-bottom:16px;margin-top:16px;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;color:#374151;margin:0 0 20px 0">
              Once you’re in, upload 8–12 of your favorite selfies and our
              custom-trained model will spin out studio-quality headshots in
              about 30 minutes—no awkward AI glitches, no hefty studio fees,
              just pure, human-looking magic at a fraction of the cost.
            </p>
            <p
              style="font-size:15px;line-height:26.25px;margin-bottom:16px;margin-top:16px;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;color:#374151;margin:0 0 20px 0">
              Can’t wait to see what you’ll create!
            </p>
            <p
              style="font-size:15px;line-height:26.25px;margin-bottom:16px;margin-top:16px;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;color:#374151;margin:0 0 20px 0">
              Cheers,<br /><strong>Team Superrshots</strong> ❤️
            </p>
            <p
              style="font-size:15px;line-height:26.25px;margin-bottom:16px;margin-top:16px;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;color:#374151;margin:0 0 20px 0">
               
            </p>
            <p
              style="font-size:15px;line-height:26.25px;margin-bottom:16px;margin-top:16px;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;color:#374151;margin:0 0 20px 0">
              <em>P.S. Pro tip:</em><em><strong> </strong></em
              ><em
                >the more varied your selfies (angles, outfits, expressions),
                the more our AI can play—so don’t hold back!</em
              >
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

function newMailhtml(params: { email: string }) {
  const {  email } = params

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
      Welcome to Superrshots! Your AI headshot journey starts now
      <div>
         ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿
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
            <h2
              style="margin-left:0px;margin-right:0px;margin-top:0px;margin-bottom:12px;text-align:left;color:#111827;font-size:30px;line-height:36px;font-weight:700">
              <span style="color:#000000">Welcome❤️</span>
            </h2>
            <p
              style="font-size:15px;line-height:26.25px;margin-bottom:16px;margin-top:16px;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;color:#374151;margin:0 0 20px 0">
              Hey there,
            </p>
            <p
              style="font-size:15px;line-height:26.25px;margin-bottom:16px;margin-top:16px;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;color:#374151;margin:0 0 20px 0">
              You’re in—welcome to ⚡️Superrshots! Here’s the lowdown on what
              you can do and what to expect:
            </p>
            <table
              align="center"
              width="100%"
              border="0"
              cellpadding="0"
              cellspacing="0"
              role="presentation"
              style="max-width:37.5em;margin-top:0px;margin-bottom:20px">
              <tbody>
                <tr style="width:100%">
                  <td>
                    <ol style="padding-left:26px;list-style-type:decimal">
                      <li
                        style="margin-bottom:8px;margin-top:8px;padding-left:6px;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale">
                        <p
                          style="font-size:15px;line-height:26.25px;margin-bottom:16px;margin-top:16px;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;color:#374151;margin:0 0 0px 0">
                          <strong>Upload your selfies</strong><br />Pick 8–12
                          clear shots (different angles &amp; expressions work
                          best).
                        </p>
                      </li>
                      <li
                        style="margin-bottom:8px;margin-top:8px;padding-left:6px;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale">
                        <p
                          style="font-size:15px;line-height:26.25px;margin-bottom:16px;margin-top:16px;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;color:#374151;margin:0 0 0px 0">
                          <strong>We work our magic</strong><br />Our
                          custom-trained AI model learns you, using pro-grade
                          prompts.
                        </p>
                      </li>
                      <li
                        style="margin-bottom:8px;margin-top:8px;padding-left:6px;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale">
                        <p
                          style="font-size:15px;line-height:26.25px;margin-bottom:16px;margin-top:16px;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;color:#374151;margin:0 0 0px 0">
                          <strong>Download your headshots</strong><br />In about
                          30 minutes, you’ll get natural, studio-quality
                          shots—no weird artifacts, just you at your best.
                        </p>
                      </li>
                    </ol>
                  </td>
                </tr>
              </tbody>
            </table>
            <p
              style="font-size:15px;line-height:26.25px;margin-bottom:16px;margin-top:16px;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;color:#374151;margin:0 0 20px 0">
              <strong>Who we are:</strong><br />A small but mighty team on a
              mission to make stunning headshots affordable (think 1/10th of
              studio costs) and utterly human-looking. We built Superrshots
              because we couldn’t find any AI tool that didn’t scream
              “computer-generated.” So, we made our own.
            </p>
            <p
              style="font-size:15px;line-height:26.25px;margin-bottom:16px;margin-top:16px;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;color:#374151;margin:0 0 20px 0">
              <strong>Next step:</strong><br />Ready to see the magic?
            </p>
            <table
              align="center"
              width="100%"
              border="0"
              cellpadding="0"
              cellspacing="0"
              role="presentation"
              style="max-width:100%;text-align:left;margin-bottom:20px">
              <tbody>
                <tr style="width:100%">
                  <td>
                    <a
                      href=${process.env.NEXTAUTH_URL}/dashboard
                      style="line-height:100%;text-decoration:none;display:inline-block;max-width:100%;mso-padding-alt:0px;color:#ffffff;background-color:#FF6534;border-color:#FF6534;border-width:2px;border-style:solid;font-size:14px;font-weight:500;border-radius:6px;padding:12px 32px 12px 32px"
                      target="_blank"
                      ><span
                        ><!--[if mso]><i style="mso-font-width:400%;mso-text-raise:18" hidden>&#8202;&#8202;&#8202;&#8202;</i><![endif]--></span
                      ><span
                        style="max-width:100%;display:inline-block;line-height:120%;mso-padding-alt:0px;mso-text-raise:9px"
                        >Upload your selfies</span
                      ><span
                        ><!--[if mso]><i style="mso-font-width:400%" hidden>&#8202;&#8202;&#8202;&#8202;&#8203;</i><![endif]--></span
                      ></a
                    >
                  </td>
                </tr>
              </tbody>
            </table>
            <p
              style="font-size:15px;line-height:26.25px;margin-bottom:16px;margin-top:16px;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;color:#374151;margin:0 0 20px 0">
              Need anything? Just hit reply—we’re here for you.
            </p>
            <p
              style="font-size:15px;line-height:26.25px;margin-bottom:16px;margin-top:16px;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;color:#374151;margin:0 0 20px 0">
              Catch you soon,<br /><strong>Team Superrshots</strong> ❤️
            </p>
            <p
              style="font-size:15px;line-height:26.25px;margin-bottom:16px;margin-top:16px;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;color:#374151;margin:0 0 20px 0">
              <em
                >P.S. Pro tip: the more varied your selfies, the more our AI can
                flex its creative muscles!</em
              >
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

/** Email Text body (fallback for email clients that don't render HTML, e.g. feature phones) */
function text({ url, host }: { url: string, host: string }) {
  return `Sign in to ${host}\n${url}\n\n`
}

async function checkNewUser(userId:any){
    const userDetails=   await db.user.findFirstOrThrow({where:{id:userId}})
    console.log("in check new user",userDetails)
    if(userDetails.isNewUser!="no"){
      const sendmail = sendNewUserMail(userDetails.email)
      console.log("send mail retyun",sendmail)
    }
    const update = await db.user.update({
    where:{id:userId},
    data:{isNewUser:"no"}
    })
    console.log("is new user update",update)
}
async function sendNewUserMail(email:any) {
  const transporter =  createTransport(process.env.EMAIL_SERVER);
    
   
  
 const info = await transporter.sendMail({
   from: process.env.EMAIL_FROM,
   to: email,
   subject: "Welcome aboard! Your AI headshot journey starts",
   text: "Welcome aboard! Your AI headshot journey starts", // plain‑text body
   html: newMailhtml({email}),
  //  attachments:[{
  //   filename:"invoice.pdf",
  //   path:pdffile,
  //   //encoding:"base64"
  // }]
 })

 console.log("newuser mail data",info)
 return "success"
}

export default NextAuth(authOptions);
