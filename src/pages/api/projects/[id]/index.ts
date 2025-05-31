import replicateClient from "@/core/clients/replicate";
import s3Client from "@/core/clients/s3";
import db from "@/core/db";
import { DeleteObjectCommand,ListObjectsV2Command} from "@aws-sdk/client-s3";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { createTransport } from "nodemailer"

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const projectId = req.query.id as string;
  const session = await getSession({ req });
  let modelStatus = "not_created";

  if (!session?.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  const project = await db.project.findFirstOrThrow({
    where: { id: projectId, userId: session.userId },
  });

  if (req.method === "GET") {
    if (project?.replicateModelId) {
      const response = await replicateClient.get(
        `/v1/trainings/${project.replicateModelId}`
      );

      modelStatus = response?.data?.status || modelStatus;
    }

    return res.json({ project, modelStatus });
  } else if (req.method === "DELETE") {
    const { imageUrls, id } = project;

    // Delete training image
    for (const imageUrl of imageUrls) {
      const key = imageUrl.split(
        `https://${process.env.S3_UPLOAD_BUCKET}.s3.${process.env.S3_UPLOAD_REGION}.amazonaws.com/`
      )[1];
      console.log("delete key",key)

    let delimg=  await s3Client.send(
        new DeleteObjectCommand({
          Bucket: process.env.S3_UPLOAD_BUCKET,
          Key: key,
        })
      );
      console.log(delimg)
    }

    // Delete zip
  const delZSip=  await s3Client.send(
      new DeleteObjectCommand({
        Bucket: process.env.S3_UPLOAD_BUCKET,
        Key: `${project.id}.zip`,
      })
    );
    console.log(delZSip)
    try{
      const listObjectsInFolder=  await s3Client.send(
        new ListObjectsV2Command({
          Bucket: process.env.S3_UPLOAD_BUCKET,
          Prefix: project.id,
        })
      );
      console.log("list",listObjectsInFolder)
 const folderContent:any= listObjectsInFolder.Contents
 if(folderContent.length>1)

 for(let i=0;i<folderContent?.length;i++){
  let delProjFolder=  await s3Client.send(
    new DeleteObjectCommand({
      Bucket: process.env.S3_UPLOAD_BUCKET,
      Key: folderContent[i].Key,
    })
  );
  console.log("delete project",delProjFolder)

 }
}
catch(e){
  console.log(e)
}

   
    sendDeletedMail(session.user.email)

    // Delete shots and project
    await db.shot.deleteMany({ where: { projectId: id } });
    await db.project.delete({ where: { id } });

    return res.json({ success: true });
  }

  return res.status(405).json({ message: "Method not allowed" });
};

async function sendDeletedMail(email:any) {
  const transporter =  createTransport(process.env.EMAIL_SERVER);
    
   
  
 const info = await transporter.sendMail({
   from: process.env.EMAIL_FROM,
   to: email,
   subject: "All clear—your images have been deleted!",
   text: "All clear—your images have been deleted!", // plain‑text body
   html: deleteMailhtml({email}),
  //  attachments:[{
  //   filename:"invoice.pdf",
  //   path:pdffile,
  //   //encoding:"base64"
  // }]
 })

 console.log("newuser mail data",info)
 return "success"
}

function deleteMailhtml(params: { email: string }) {
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
      All clear—your images have been deleted!
      <div>
         ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿
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
              Just a quick note to let you know we’ve given your images the
              boot—your photos are now fully scrubbed from our servers. 🔥✨
            </p>
            <p
              style="font-size:15px;line-height:26.25px;margin-bottom:16px;margin-top:16px;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;color:#374151;margin:0 0 20px 0">
              Don’t worry, we still remember you (in a totally non-creepy,
              AI-friendly way), but we no longer hold onto any of your pictures.
            </p>
            <p
              style="font-size:15px;line-height:26.25px;margin-bottom:16px;margin-top:16px;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;color:#374151;margin:0 0 20px 0">
              If you ever need a fresh batch of pro headshots, you know where to
              find us:
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
                        >Start a new session</span
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
              Thanks for hanging out with ⚡️Superrshots! We’ve enjoyed creating
              with you and can’t wait for round two.
            </p>
            <p
              style="font-size:15px;line-height:26.25px;margin-bottom:16px;margin-top:16px;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;color:#374151;margin:0 0 20px 0">
              Catch you later,<br /><strong>Team Superrshots</strong> ❤️
            </p>
            <p
              style="font-size:15px;line-height:26.25px;margin-bottom:16px;margin-top:16px;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;color:#374151;margin:0 0 20px 0">
              <em
                >P.S. We respect your privacy—your pics live for 7 days, then
                poof!</em
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


export default handler;
