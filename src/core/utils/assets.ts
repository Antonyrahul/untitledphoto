import { Project } from "@prisma/client";
import axios, { AxiosResponse } from "axios";
import JSZip from "jszip";
import sharp from "sharp";
import smartcrop from "smartcrop-sharp";
import  { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';


const WIDTH = 512;
const HEIGHT = 512;

export const createZipFolder = async (urls: string[], project: Project) => {
  const zip = new JSZip();
  const requests = [];
  console.log(urls)

  const accessKeyId=process.env.S3_UPLOAD_KEY ?? ""
  const secretAccessKey=process.env.S3_UPLOAD_SECRET ?? ""

const s3Client:any = new S3Client({
  region: 'ap-south-1',
  credentials: {
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey
  }
});


  // const command:any = new GetObjectCommand({
  //   Bucket: "photoshotut1",
  //   Key: "next-s3-uploads/03eacfb6-bfb1-4145-96cf-9a99811f4f85/m3hi17i2.jpeg"
  // })
  
  
  //const sigedurl= await getSignedUrl(s3Client, command, { expiresIn: 3600 }); // URL expires in 1 hour
  //console.log("signed url bha",sigedurl)


  for (let i = 0; i < urls.length; i++) {

    var objKey = urls[i].split("amazonaws.com/")[1];

    var command:any = new GetObjectCommand({
      Bucket: "photoshotut1",
      Key: objKey
    })
    var sigedurl= await getSignedUrl(s3Client, command, { expiresIn: 3600 }); // URL expires in 1 hour
    requests.push(axios(sigedurl, { responseType: "arraybuffer" }));
  }

  const responses = await Promise.all<AxiosResponse<Buffer>>(requests);
  const buffersPromises = responses.map((response) => {
    const buffer = response.data;
    return smartcrop
      .crop(buffer, { width: WIDTH, height: HEIGHT })
      .then(function (result) {
        const crop = result.topCrop;
        return sharp(buffer)
          .extract({
            width: crop.width,
            height: crop.height,
            left: crop.x,
            top: crop.y,
          })
          .resize(WIDTH, HEIGHT)
          .toBuffer();
      });
  });

  const buffers = await Promise.all(buffersPromises);
  const folder = zip.folder(project.id);

  buffers.forEach((buffer, i) => {
    const filename = urls[i].split("/").pop();
    folder!.file(filename!, buffer, { binary: true });
  });

  const zipContent = await zip.generateAsync({ type: "nodebuffer" });

  return zipContent;
};
