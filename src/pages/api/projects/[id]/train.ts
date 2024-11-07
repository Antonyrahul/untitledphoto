import db from "@/core/db";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import replicateClient from "@/core/clients/replicate";
import { getRefinedInstanceClass } from "@/core/utils/predictions";
const Replicate = require("replicate");


const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const projectId = req.query.id as string;
  const session = await getSession({ req });

  if (!session?.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  let project = await db.project.findFirstOrThrow({
    where: {
      id: projectId,
      userId: session.userId,
      modelStatus: "not_created",
      NOT: { stripePaymentId: null },
    },
  });

  const instanceClass = getRefinedInstanceClass(project.instanceClass);
  const replicate = new Replicate({
    // get your token from https://replicate.com/account/api-tokens
    auth: process.env.REPLICATE_API_TOKEN, // defaults to process.env.REPLICATE_API_TOKEN
    baseURl:"https://api.replicate.com/v1"
  });

  const response = await replicate.models.versions.list("magicofspade","photoshottest1");
  console.log(response)

  // const response = await replicate.hardware.list()
  // console.log(response)

//   const model = await replicate.models.create(
//     "magicofspade",
//     "photoshottest1",
//     {visibility:"private",hardware:"gpu-t4",description:"A fine-tuned FLUX.1 model"}

  
// )
// console.log(model)
const training = await replicate.trainings.create(
  "ostris",
  "flux-dev-lora-trainer",
  "885394e6a31c6f349dd4f9e6e7ffbabd8d9840ab2559ab78aed6b2451ab2cfef",
  {
    // You need to create a model on Replicate that will be the destination for the trained version.
    destination: "magicofspade/photoshottest1",
    input: {
      steps: 1000,
      lora_rank: 16,
      optimizer: "adamw8bit",
      batch_size: 1,
      resolution: "512,768,1024",
      autocaption: true,
      input_images: "https://hedshottempbucket.s3.ap-south-1.amazonaws.com/rahulsample.zip",
      trigger_word: "sksrr",
      learning_rate: 0.0004,
      wandb_project: "flux_train_replicate",
      wandb_save_interval: 100,
      caption_dropout_rate: 0.05,
      cache_latents_to_disk: false,
      wandb_sample_interval: 100
    }
  }
);

 console.log(training)

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
  const replicateModelId = training.id as string;

  project = await db.project.update({
    where: { id: project.id },
    data: { replicateModelId: replicateModelId , modelStatus: "processing" },
  });

  return res.json({ project });
};

export default handler;
