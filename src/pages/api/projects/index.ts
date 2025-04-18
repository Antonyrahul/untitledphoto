import { NextApiRequest, NextApiResponse } from "next";
import { getSession} from "next-auth/react";
import { getToken } from "next-auth/jwt";
import db from "@/core/db";
import { createZipFolder } from "@/core/utils/assets";
import s3Client from "@/core/clients/s3";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import replicateClient from "@/core/clients/replicate";
import  { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  //const session = await getSession({ req });
  const token= await getToken({req})
  //const session = await getSession({req});
  const session= await getServerSession(req,res,authOptions)
  //console.log("serversession is ",serverSession)
  console.log("the session in index is",session)
  console.log("the token is",token)


  if (!session?.user) {
    console.log("ther user json is",session?.user)
    return res.status(401).json({ message: "Not authenticated" });
  }

  if (req.method === "POST") {
    const urls = req.body.urls as string[];
    const studioName = req.body.studioName as string;
    const instanceClass = req.body.instanceClass as string;
    console.log("instance class in create",instanceClass)
    
  console.log("inga vandachu")
    const project = await db.project.create({
      data: {
        imageUrls: urls,
        name: studioName,
        userId: session?.userId,
        modelStatus: "not_created",
        instanceClass: instanceClass || "person",
        instanceName: process.env.NEXT_PUBLIC_REPLICATE_INSTANCE_TOKEN!,
        credits: Number(process.env.NEXT_PUBLIC_STUDIO_SHOT_AMOUNT) || 50,
      },
    });
    console.log("in here")
    const buffer = await createZipFolder(urls, project);
    console.log("buffer is ",buffer)

//     const accessKeyId=process.env.S3_UPLOAD_KEY ?? ""
//     const secretAccessKey=process.env.S3_UPLOAD_SECRET ?? ""
//  const s3Client:any = new S3Client({
//   region: 'ap-south-1',
//   credentials: {
//     accessKeyId: accessKeyId,
//     secretAccessKey: secretAccessKey
//   }
// });


//   const command:any = new GetObjectCommand({
//     Bucket: "photoshotut1",
//     Key: "next-s3-uploads/03eacfb6-bfb1-4145-96cf-9a99811f4f85/m3hi17i2.jpeg"
//   })
  
  
//   const sigedurl= await getSignedUrl(s3Client, command, { expiresIn: 3600 }); // URL expires in 1 hour
//   console.log("signed url bha",sigedurl)

    const s3Resp=await s3Client.send(
      new PutObjectCommand({
        Bucket: process.env.S3_UPLOAD_BUCKET!,
        Key: `${project.id}.zip`,
        Body: buffer,
      })
    );
    console.log("response from s3 is",s3Resp)

    return res.json({ project });
  }

  if (req.method === "GET") {
    const projects = await db.project.findMany({
      where: { userId: session.userId },
      include: { shots: { take: 10, orderBy: { createdAt: "desc" } } },
      orderBy: { createdAt: "desc" },
    });

    for (const project of projects) {
      if (project?.replicateModelId && project?.modelStatus !== "succeeded") {
        const { data } = await replicateClient.get(
          `/v1/trainings/${project.replicateModelId}`
        );
        console.log(data)

        await db.project.update({
          where: { id: project.id },
          data: { modelVersionId: data.version, modelStatus: data?.status },
        });
      }
    }

    return res.json(projects);
  }
};

export default handler;
