import db from "@/core/db";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import replicateClient from "@/core/clients/replicate";
import { getRefinedInstanceClass } from "@/core/utils/predictions";
const Replicate = require("replicate");
import * as fal from "@fal-ai/serverless-client";
import  { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Shot } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";

fal.config({
  credentials: process.env.FAL_KEY,
})

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const projectId = req.query.id as string;
  //const session = await getSession({ req });
  const session= await getServerSession(req,res,authOptions)

  console.log("the session in train ts is ",session)

  if (!session?.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  let project = await db.project.findFirstOrThrow({
    where: {
      id: projectId,
      //userId: session.userId,
      userId:session.userId,
      modelStatus: "not_created",
      NOT: { stripePaymentId: null },
    },
  });

  const instanceClass = getRefinedInstanceClass(project.instanceClass);
  console.log('the instance class is ',instanceClass)
  // const replicate = new Replicate({
  //   // get your token from https://replicate.com/account/api-tokens
  //   auth: process.env.REPLICATE_API_TOKEN, // defaults to process.env.REPLICATE_API_TOKEN
  //   baseURl:"https://api.replicate.com/v1"
  // });

  //const response = await replicate.models.versions.list("magicofspade","photoshottest1");
  const accessKeyId=process.env.S3_UPLOAD_KEY ?? ""
  const secretAccessKey=process.env.S3_UPLOAD_SECRET ?? ""

const s3Client:any = new S3Client({
  region: 'ap-south-1',
  credentials: {
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey
  }
});

var objKey =`${project.id}.zip` ;

var command:any = new GetObjectCommand({
  Bucket: "photoshotut1",
  Key: objKey
})
var sigedurl= await getSignedUrl(s3Client, command, { expiresIn: 3600 }); // URL expires in 1 hour
console.log(sigedurl)
  //console.log(response)
  const result = await fal.queue.submit("fal-ai/flux-lora-fast-training", {
    input: {
      images_data_url: sigedurl,
      steps: 1000,
      rank: 16,
      learning_rate: 0.0004,
      caption_dropout_rate: 0.05,
      experimental_optimizers: "adamw8bit",
      experimental_multi_checkpoints_count: 1,
      trigger_word: "sksrr"
    },
    webhookUrl: process.env.NEXTAUTH_URL+"/api/webhook",
  });
  //const result= request_id
  console.log(result)

  project = await db.project.update({
    where: { id: project.id },
    data: { falReqIDT: result.request_id , modelStatus: "inprogress" },
  });



  // const result:any = await fal.subscribe("fal-ai/flux-lora-fast-training", {
  //   input: {
  //     images_data_url: sigedurl,
  //     steps: 1000,
  //     rank: 16,
  //     learning_rate: 0.0004,
  //     caption_dropout_rate: 0.05,
  //     experimental_optimizers: "adamw8bit",
  //     experimental_multi_checkpoints_count: 1,
  //     trigger_word: "sksrr"
  //   },
  //   logs: true,
  //   onQueueUpdate: (update) => {
  //     if (update.status === "IN_PROGRESS") {
  //       update.logs.map((log) => log.message).forEach(console.log);
  //     }
  //   },
  // });
  // console.log(result)
  // console.log(result.diffusers_lora_file.url)
  var imgArr:any=[]
  
  
  // const promprttArr=["a portrait photo of sksrr man, wearing a black tuxedo, emmy background, fit, detailed face, clean and clear face,(flirty smile)+, (looking at the camera)++",
  // "a portrait photo of sksrr man, wearing a black polo tshirt, gym background, fit, detailed face, clean and clear face,(flirty smile)+, (looking at the camera)++",
  // "a portrait photo of sksrr man, wearing a white tuxedo, emmy background, fit, detailed face, clean and clear face,(flirty smile)+, (looking at the camera)++",
  // "a portrait photo of sksrr man, wearing a white tshirt, village background, fit, detailed face, clean and clear face,(flirty smile)+, (looking at the camera)++",
  // "a portrait photo of sksrr man, wearing a sherwani, emmy background, fit, detailed face, clean and clear face,(flirty smile)+, (looking at the camera)++",
  // "a portrait photo of sksrr man, wearing a cool tshirt, emmy background, fit, detailed face, clean and clear face,(flirty smile)+, (looking at the camera)++"
  // ]

 
 
 
  const promprttArr=["A noble Victorian sksrr gentleman standing in an opulent 19th-century study, dressed in a tailored dark navy frock coat, a gold pocket watch hanging from his vest, and a silk cravat. Sunlight streams through the tall windows, illuminating the fine details of the room’s antique furniture. Hyper-realistic, ultra-HD, photorealistic textures",
  "A rugged sksrr cowboy standing in the middle of a vast desert, dressed in a weathered brown leather jacket, cowboy hat, and boots. His revolver holstered at his side, he looks into the distance as the sun sets behind him, casting a golden glow over the dunes. 16K resolution, ultra-sharp detail, cinematic Western style",
  "A powerful Norse sksrr warrior in a frozen landscape, wearing detailed battle armor made of steel and fur. His long hair flows in the wind as he grips a massive axe, snowflakes falling around him. Behind him, a towering Viking ship rests on icy waters. Epic fantasy realism, ultra-HD, 8K textures",
  "A modern sksrr businessman in a sleek, tailored black suit walking confidently through a futuristic glass cityscape at sunset. The reflection of the skyline glows on the skyscrapers as he adjusts his cufflinks. The scene captures motion and elegance with a shallow depth of field. Photorealistic, ultra-HD, stylish",
  "A mysterious sksrr samurai in a misty bamboo forest, wearing a traditional dark blue kimono with golden embroidery. His katana is drawn slightly, reflecting the dim moonlight filtering through the leaves. The atmosphere is serene yet tense, capturing ancient warrior spirit. 8K ultra-realistic, cinematic",
  "A heroic sksrr firefighter emerging from the smoke, wearing a soot-covered yellow fire-resistant suit and helmet with a reflective visor. The glow of embers illuminates his determined expression as water sprays from a nearby hose. Ultra-realistic, high-action shot, 12K resolution, dramatic lighting."
  ]

  
  
  // var imgResult:any = await fal.subscribe("fal-ai/flux-lora", {
  //   input: {
  //     prompt: "a portrait photo of sksrr man, wearing a black tuxedo, emmy background, fit, detailed face, clean and clear face,(flirty smile)+, (looking at the camera)++",
  //     image_size: "landscape_4_3",
  //     num_inference_steps: 28,
  //     guidance_scale: 3.5,
  //     num_images: 1,
  //     enable_safety_checker: true,
  //     output_format: "jpeg",
  //     loras: [{
  //       path: result.diffusers_lora_file.url
  //     }]
  //   },
  //   logs: true,
  //   onQueueUpdate: (update) => {
  //     if (update.status === "IN_PROGRESS") {
  //       update.logs.map((log) => log.message).forEach(console.log);
  //     }
  //   },
  // });
  // console.log(imgResult)
  
  
  
 
 
  // var shot:any;
  // for(var i=0;i<promprttArr.length;i++){
  //   var imgResult:any =await fal.subscribe("fal-ai/flux-lora", {
  //       input: {
  //         prompt: promprttArr[i],
  //         image_size: "landscape_4_3",
  //         num_inference_steps: 28,
  //         guidance_scale: 3.5,
  //         num_images: 1,
  //         enable_safety_checker: true,
  //         output_format: "jpeg",
  //         loras: [{
  //           path: result.diffusers_lora_file.url
  //         }]
  //       },
  //       logs: true,
  //       onQueueUpdate: (update) => {
  //         if (update.status === "IN_PROGRESS") {
  //           update.logs.map((log) => log.message).forEach(console.log);
  //         }
  //       },
  //     });
  //     console.log(imgResult)
    
  //       shot = await db.shot.create({
  //        data: {
  //          prompt:promprttArr[i],
         
  //          replicateId: "adichividuuu",
  //          status: "starting",
  //          projectId: project.id,
  //          outputUrl:imgResult.images[0].url
  //        },
  //      });
  //      console.log(shot)
     

  //     imgArr.push(imgResult)
  // }

  
  
  
  
  
  
  
  
  
  
  
  
  // const response = await replicate.hardware.list()
  // console.log(response)

//   const model = await replicate.models.create(
//     "magicofspade",
//     "photoshottest1",
//     {visibility:"private",hardware:"gpu-t4",description:"A fine-tuned FLUX.1 model"}

  
// )
// console.log(model)
// const training = await replicate.trainings.create(
//   "ostris",
//   "flux-dev-lora-trainer",
//   "885394e6a31c6f349dd4f9e6e7ffbabd8d9840ab2559ab78aed6b2451ab2cfef",
//   {
//     // You need to create a model on Replicate that will be the destination for the trained version.
//     destination: "magicofspade/photoshottest1",
//     input: {
//       steps: 1000,
//       lora_rank: 16,
//       optimizer: "adamw8bit",
//       batch_size: 1,
//       resolution: "512,768,1024",
//       autocaption: true,
//       input_images: "https://hedshottempbucket.s3.ap-south-1.amazonaws.com/rahulsample.zip",
//       trigger_word: "sksrr",
//       learning_rate: 0.0004,
//       wandb_project: "flux_train_replicate",
//       wandb_save_interval: 100,
//       caption_dropout_rate: 0.05,
//       cache_latents_to_disk: false,
//       wandb_sample_interval: 100
//     }
//   }
// );

//  console.log(training)

// const response1 = await replicate.trainings.get("emkzzwhh8srm00cj3tdr3eb738");
// console.log(response1)

// const input = {
//   prompt: "a portrait photo of sksrr man, wearing a black tuxedo, emmy background, fit, detailed face, clean and clear face,(flirty smile)+, (looking at the camera)++",
//   go_fast: true,
//   guidance: 3.5,
//   num_outputs: 1,
//   aspect_ratio: "1:1",
//   output_format: "webp",
//   output_quality: 80,
//   prompt_strength: 0.8,
//   num_inference_steps: 28
// };

// const output = await replicate.run("magicofspade/photoshottest1:f2c7486adb24f5880be0308af7ad4f3e2df5b8793c5de9c2fc88283fc2a42a15", { input });
// console.log(output);



  // const responseReplicate = await replicateClient.post(
  //   "/v1/trainings",
  //   {
  //     input: {
  //       instance_prompt: `a photo of a ${process.env.NEXT_PUBLIC_REPLICATE_INSTANCE_TOKEN} ${instanceClass}`,
  //       class_prompt: `a photo of a ${instanceClass}`,
  //       instance_data: `https://${process.env.S3_UPLOAD_BUCKET}.s3.amazonaws.com/${project.id}.zip`,
  //       max_train_steps: Number(process.env.REPLICATE_MAX_TRAIN_STEPS),
  //       num_class_images: 200,
  //       learning_rate: 1e-6,
  //     },
  //     model: `${process.env.REPLICATE_USERNAME}/${project.id}`,
  //     webhook_completed: `${process.env.NEXTAUTH_URL}/api/webhooks/completed`,
  //   },
  //   {
  //     headers: {
  //       Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
  //       "Content-Type": "application/json",
  //     },
  //   }
  // );

  // const replicateModelId = responseReplicate.data.id as string;
  
  
  //const replicateModelId = training.id as string;

  // project = await db.project.update({
  //   where: { id: project.id },
  //   data: { replicateModelId: replicateModelId , modelStatus: "processing" },
  // });

   
  
  
  
  
  
  // project = await db.project.update({
  //   where: { id: project.id },
  //   data: { falUrl: result.diffusers_lora_file.url , modelStatus: "succeeded" },
  // });
   return res.json({ project });
};

export default handler;
