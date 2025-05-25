import { PrismaAdapter } from "@next-auth/prisma-adapter";
import NextAuth, { NextAuthOptions } from "next-auth";
import EmailProvider from "next-auth/providers/email";
import db from "@/core/db";
import { createTransport } from "nodemailer"

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
           subject: `Sign in to ${host}`,
           text: text({ url, host }),
           html: html({ url, host, email }),
        });
     },
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      console.log("session is auth is ",session)
      console.log("user in nextauth is",user)
      session.userId = user.id;
      return session;
    },
    // async signIn({ user, account, profile, email, credentials }) {
      
    //   const isNewUser = await db.user.findFirstOrThrow({ where: { email: user.email }},)



    //  console.log("NEWWWWWWWWW",isNewUser)

    //   return true
    // },
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

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <title>Sign In to Your Account</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <style type="text/css">
    /* Client-specific resets */
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; } /* Outlook-specific spacing reset */
    img { -ms-interpolation-mode: bicubic; } /* Improves image rendering in Outlook */

    /* General Resets */
    img { border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
    table { border-collapse: collapse!important; }
    body { height: 100%!important; margin: 0!important; padding: 0!important; width: 100%!important; }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f4;">
  <table border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation">
    <tr>
      <td align="center" style="padding: 20px 0 30px 0; background-color: #f4f4f4;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="border-collapse: collapse; max-width: 600px; background-color: #ffffff;" role="presentation">
          <tr>
            <td align="center" style="padding: 40px 0 30px 0;">
              // <img src="/favicon.png" alt="superrshots Logo" width="150" style="display: block; width: 150px; max-width: 150px; min-width: 150px; font-family: Arial, sans-serif; color: #333333; font-size: 18px;" border="0">
              <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="135" height="42">
              <path d="M0 0 C0 3.96 0 7.92 0 12 C1.02480469 11.30132812 2.04960938 10.60265625 3.10546875 9.8828125 C4.46597921 8.96329509 5.8266656 8.04403793 7.1875 7.125 C7.86103516 6.66480469 8.53457031 6.20460938 9.22851562 5.73046875 C12.72029983 3.37990182 15.97897575 1.35855965 20 0 C19.74729106 4.67511546 19.40474133 9.33560296 19 14 C18.93554688 14.89847656 18.87109375 15.79695313 18.8046875 16.72265625 C18.31045444 20.41673156 17.74389498 22.32232295 14.9375 24.87890625 C8.97099768 29 8.97099768 29 6 29 C6 26.36 6 23.72 6 21 C4.98679688 21.68707031 3.97359375 22.37414062 2.9296875 23.08203125 C1.57825068 23.99237411 0.22668112 24.90251992 -1.125 25.8125 C-1.79015625 26.26431641 -2.4553125 26.71613281 -3.140625 27.18164062 C-6.98018558 29.76016905 -10.8001225 32.03089855 -15 34 C-14.85915204 32.20793453 -14.71216299 30.41635083 -14.5625 28.625 C-14.48128906 27.62726562 -14.40007813 26.62953125 -14.31640625 25.6015625 C-14 23 -14 23 -13 21 C-14.04454346 21.39904541 -15.08908691 21.79809082 -16.1652832 22.20922852 C-20.03627338 23.68525207 -23.91179632 25.14903259 -27.78881836 26.60913086 C-29.46716768 27.2431595 -31.14426392 27.88051547 -32.82006836 28.52124023 C-35.22709748 29.4408835 -37.63835839 30.34852247 -40.05078125 31.25390625 C-40.80087967 31.54342667 -41.55097809 31.83294708 -42.32380676 32.13124084 C-47.65838488 34.11387171 -47.65838488 34.11387171 -51 33 C-50.46208832 32.64556824 -49.92417664 32.29113647 -49.3699646 31.92596436 C-43.75676946 28.22736634 -38.14372301 24.52854275 -32.53076172 20.82958984 C-30.43770069 19.45030052 -28.34460212 18.07106815 -26.25146484 16.69189453 C-23.23785623 14.70620563 -20.22438396 12.72030997 -17.2109375 10.734375 C-15.81371964 9.81383331 -15.81371964 9.81383331 -14.38827515 8.87469482 C-13.50781525 8.29439514 -12.62735535 7.71409546 -11.72021484 7.11621094 C-10.90188171 6.57734253 -10.08354858 6.03847412 -9.24041748 5.48327637 C-7.29310408 4.1940506 -5.35755314 2.88926214 -3.42431641 1.57910156 C-1 0 -1 0 0 0 Z " fill="#000000" transform="translate(51,7)"/>
              <path d="M0 0 C-1 3 -1 3 -3 4 C-2.34 4.33 -1.68 4.66 -1 5 C-1.33 5.99 -1.66 6.98 -2 8 C-3.65 8 -5.3 8 -7 8 C-7 8.66 -7 9.32 -7 10 C-5.35 10 -3.7 10 -2 10 C-2 10.99 -2 11.98 -2 13 C-6.455 13.495 -6.455 13.495 -11 14 C-11 12.02 -11 10.04 -11 8 C-11.66 8.66 -12.32 9.32 -13 10 C-14.32 10 -15.64 10 -17 10 C-17.33 11.32 -17.66 12.64 -18 14 C-18.99 14 -19.98 14 -21 14 C-20.85966889 12.02043559 -20.7125877 10.04134859 -20.5625 8.0625 C-20.48128906 6.96035156 -20.40007812 5.85820312 -20.31640625 4.72265625 C-20 2 -20 2 -19 1 C-15.5625 0.8125 -15.5625 0.8125 -12 1 C-11.34 1.66 -10.68 2.32 -10 3 C-9.649375 2.505 -9.29875 2.01 -8.9375 1.5 C-6.05625711 -0.73063966 -3.52990974 -0.19980621 0 0 Z M-16 4 C-16.33 4.99 -16.66 5.98 -17 7 C-16.01 7 -15.02 7 -14 7 C-14 6.01 -14 5.02 -14 4 C-14.66 4 -15.32 4 -16 4 Z " fill="#000000" transform="translate(115,1)"/>
              <path d="M0 0 C1.86785156 0.01353516 1.86785156 0.01353516 3.7734375 0.02734375 C5.18496094 0.04474609 5.18496094 0.04474609 6.625 0.0625 C5.965 1.3825 5.305 2.7025 4.625 4.0625 C3.965 4.0625 3.305 4.0625 2.625 4.0625 C3.615 4.7225 4.605 5.3825 5.625 6.0625 C5.25 9 5.25 9 4.625 12.0625 C1.91620665 13.41689668 -0.38433268 13.12751451 -3.375 13.0625 C-3.045 11.7425 -2.715 10.4225 -2.375 9.0625 C-1.385 9.0625 -0.395 9.0625 0.625 9.0625 C-1.17357668 6.5015706 -1.17357668 6.5015706 -3.375 4.0625 C-4.365 4.0625 -5.355 4.0625 -6.375 4.0625 C-6.705 7.0325 -7.035 10.0025 -7.375 13.0625 C-8.365 13.3925 -9.355 13.7225 -10.375 14.0625 C-10.5 7.4375 -10.5 7.4375 -9.375 4.0625 C-10.695 4.0625 -12.015 4.0625 -13.375 4.0625 C-13.375 3.0725 -13.375 2.0825 -13.375 1.0625 C-8.85684719 0.17972245 -4.59987306 -0.04339503 0 0 Z " fill="#000000" transform="translate(119.375,14.9375)"/>
              <path d="M0 0 C2.8125 1 2.8125 1 4.8125 4 C4.61930255 7.09115927 4.33545608 9.24171368 2.5625 11.8125 C0.24347898 13.3861214 -1.38374839 13.86323163 -4.1875 14 C-6.5 12.9375 -6.5 12.9375 -8.1875 11 C-8.75 8.125 -8.75 8.125 -8.1875 5 C-5.61479531 1.44361411 -4.47724784 0 0 0 Z M-3.1875 4 C-3.8475 5.65 -4.5075 7.3 -5.1875 9 C-3.29570797 9.6814823 -3.29570797 9.6814823 -1.1875 10 C-0.5275 9.34 0.1325 8.68 0.8125 8 C0.8125 6.68 0.8125 5.36 0.8125 4 C-0.5075 4 -1.8275 4 -3.1875 4 Z " fill="#000000" transform="translate(101.1875,16)"/>
              <path d="M0 0 C1.32 0.33 2.64 0.66 4 1 C3.34 4.96 2.68 8.92 2 13 C1.01 13 0.02 13 -1 13 C-1 11.68 -1 10.36 -1 9 C-2.32 9 -3.64 9 -5 9 C-5.33 10.65 -5.66 12.3 -6 14 C-6.99 14 -7.98 14 -9 14 C-8.67 9.71 -8.34 5.42 -8 1 C-6.68 1 -5.36 1 -4 1 C-4 2.32 -4 3.64 -4 5 C-2.68 5 -1.36 5 0 5 C0 3.35 0 1.7 0 0 Z " fill="#000000" transform="translate(89,17)"/>
              <path d="M0 0 C2.64 0 5.28 0 8 0 C9.17786568 4.12252986 8.67628118 6.12359977 7 10 C7.33 10.66 7.66 11.32 8 12 C4.57015811 12.94616328 1.55824425 13 -2 13 C-1.85915204 11.20793453 -1.71216299 9.41635083 -1.5625 7.625 C-1.48128906 6.62726562 -1.40007812 5.62953125 -1.31640625 4.6015625 C-1 2 -1 2 0 0 Z M3 3 C3 3.66 3 4.32 3 5 C3.66 5 4.32 5 5 5 C5 4.34 5 3.68 5 3 C4.34 3 3.68 3 3 3 Z " fill="#000000" transform="translate(116,1)"/>
              <path d="M0 0 C6.15234375 -0.09765625 6.15234375 -0.09765625 8 0 C9 1 9 1 9.1875 3.9375 C9 7 9 7 7 9 C7.3185177 11.10820797 7.3185177 11.10820797 8 13 C6.68 13 5.36 13 4 13 C3.67 12.34 3.34 11.68 3 11 C2.67 11.66 2.34 12.32 2 13 C1.01 13 0.02 13 -1 13 C-0.67 8.71 -0.34 4.42 0 0 Z M3 3 C3 3.99 3 4.98 3 6 C3.99 5.67 4.98 5.34 6 5 C6 4.34 6 3.68 6 3 C5.01 3 4.02 3 3 3 Z " fill="#000000" transform="translate(126,0)"/>
              <path d="M0 0 C1.98 0.495 1.98 0.495 4 1 C3.67 3.97 3.34 6.94 3 10 C6.29922197 7.80051868 6.42809901 7.49675855 7.1875 3.875 C7.455625 2.59625 7.72375 1.3175 8 0 C8.99 0 9.98 0 11 0 C10.91266424 1.60517097 10.80447776 3.20921662 10.6875 4.8125 C10.62949219 5.70582031 10.57148437 6.59914063 10.51171875 7.51953125 C9.92779341 10.35000906 9.32015842 11.31761024 7 13 C3.9375 13.3125 3.9375 13.3125 1 13 C0.34 12.34 -0.32 11.68 -1 11 C-0.9765625 8.3984375 -0.9765625 8.3984375 -0.625 5.375 C-0.51414062 4.37210937 -0.40328125 3.36921875 -0.2890625 2.3359375 C-0.19367188 1.56507812 -0.09828125 0.79421875 0 0 Z " fill="#000000" transform="translate(83,3)"/>
              <path d="M0 0 C-1 3 -1 3 -3 4 C-2.34 4.66 -1.68 5.32 -1 6 C-1.25 9.0625 -1.25 9.0625 -2 12 C-4.70879335 13.35439668 -7.00933268 13.06501451 -10 13 C-9.6875 11.0625 -9.6875 11.0625 -9 9 C-8.01 8.67 -7.02 8.34 -6 8 C-6.99 7.34 -7.98 6.68 -9 6 C-8.75 3.625 -8.75 3.625 -8 1 C-5.12800349 -1.17875597 -3.33791789 -1.19211353 0 0 Z " fill="#000000" transform="translate(82,4)"/>
              <path d="M0 0 C1.4540625 0.0309375 1.4540625 0.0309375 2.9375 0.0625 C2.6075 1.3825 2.2775 2.7025 1.9375 4.0625 C0.9475 3.7325 -0.0425 3.4025 -1.0625 3.0625 C-1.0625 3.7225 -1.0625 4.3825 -1.0625 5.0625 C-0.0725 5.3925 0.9175 5.7225 1.9375 6.0625 C2.0625 8.4375 2.0625 8.4375 1.9375 11.0625 C-0.0625 13.0625 -0.0625 13.0625 -3.1875 13.1875 C-4.610625 13.125625 -4.610625 13.125625 -6.0625 13.0625 C-5.7325 11.7425 -5.4025 10.4225 -5.0625 9.0625 C-4.0725 9.3925 -3.0825 9.7225 -2.0625 10.0625 C-2.0625 9.4025 -2.0625 8.7425 -2.0625 8.0625 C-3.3825 7.4025 -4.7025 6.7425 -6.0625 6.0625 C-3.76028481 0.07674051 -3.76028481 0.07674051 0 0 Z " fill="#000000" transform="translate(77.0625,17.9375)"/>
              </svg>
              
              </td>
          </tr>
          <tr>
            <td bgcolor="#ffffff" style="padding: 20px 30px 20px 30px;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;" role="presentation">
                <tr>
                  <td align="centre" style="color: #153643; font-family: Arial, sans-serif; font-size: 24px; font-weight: bold; padding-bottom: 10px;">
                    Welcome!
                  </td>
                </tr>
                <tr>
                  <td style="color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 24px; padding-bottom: 20px;">
                    Please click the button below to sign in to your account. If you did not request this email, please ignore it.
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td bgcolor="#ffffff" align="center" style="padding: 0px 30px 40px 30px;">
              <table border="0" cellspacing="0" cellpadding="0" role="presentation">
                <tr>
                  <td align="center" bgcolor="#007bff" style="border-radius: 5px;">
                    <a href=${url} target="_blank" style="font-size: 16px; font-family: Arial, sans-serif; font-weight: bold; color: #ffffff; text-decoration: none; padding: 15px 25px; border-radius: 5px; display: inline-block; border: 1px solid #007bff;"> Sign In
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td bgcolor="#f0f0f0" style="padding: 30px 30px 30px 30px;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;" role="presentation">
                <tr>
                  <td style="color: #666666; font-family: Arial, sans-serif; font-size: 14px; line-height: 18px; text-align: center;">
                    &copy; 2025 Superrshots. All rights reserved.<br>
                   
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
        </td>
    </tr>
  </table>
  </body>
</html>

`

}

/** Email Text body (fallback for email clients that don't render HTML, e.g. feature phones) */
function text({ url, host }: { url: string, host: string }) {
  return `Sign in to ${host}\n${url}\n\n`
}

export default NextAuth(authOptions);
