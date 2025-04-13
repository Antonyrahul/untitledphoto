import db from "@/core/db";
import { getRefinedInstanceClass } from "@/core/utils/predictions";
import * as fal from "@fal-ai/serverless-client";
export default async function handler(req:any, res:any) {
    if (req.method === 'POST') {
      // Process the webhook payload
      const payload = req.body;

      const projects = await db.project.findFirstOrThrow({
        where: { falReqIDT: payload.request_id },
    
      });

      console.log("webhook projects find",projects)
      // Do something with the payload (e.g., log it or save it in the database)
      console.log('Webhook received:', payload);
      var imgArr:any=[]
      const promprttArr=["A noble Victorian sksrr gentleman standing in an opulent 19th-century study, dressed in a tailored dark navy frock coat, a gold pocket watch hanging from his vest, and a silk cravat. Sunlight streams through the tall windows, illuminating the fine details of the room’s antique furniture. Hyper-realistic, ultra-HD, photorealistic textures",
      "A rugged sksrr cowboy standing in the middle of a vast desert, dressed in a weathered brown leather jacket, cowboy hat, and boots. His revolver holstered at his side, he looks into the distance as the sun sets behind him, casting a golden glow over the dunes. 16K resolution, ultra-sharp detail, cinematic Western style",
      "A powerful Norse sksrr warrior in a frozen landscape, wearing detailed battle armor made of steel and fur. His long hair flows in the wind as he grips a massive axe, snowflakes falling around him. Behind him, a towering Viking ship rests on icy waters. Epic fantasy realism, ultra-HD, 8K textures",
      "A modern sksrr businessman in a sleek, tailored black suit walking confidently through a futuristic glass cityscape at sunset. The reflection of the skyline glows on the skyscrapers as he adjusts his cufflinks. The scene captures motion and elegance with a shallow depth of field. Photorealistic, ultra-HD, stylish",
      "A mysterious sksrr samurai in a misty bamboo forest, wearing a traditional dark blue kimono with golden embroidery. His katana is drawn slightly, reflecting the dim moonlight filtering through the leaves. The atmosphere is serene yet tense, capturing ancient warrior spirit. 8K ultra-realistic, cinematic",
      "A heroic sksrr firefighter emerging from the smoke, wearing a soot-covered yellow fire-resistant suit and helmet with a reflective visor. The glow of embers illuminates his determined expression as water sprays from a nearby hose. Ultra-realistic, high-action shot, 12K resolution, dramatic lighting."
      ]

      var shot:any;
      for(var i=0;i<promprttArr.length;i++){
        var imgResult:any =await fal.subscribe("fal-ai/flux-lora", {
            input: {
              prompt: promprttArr[i],
              image_size: "landscape_4_3",
              num_inference_steps: 28,
              guidance_scale: 3.5,
              num_images: 1,
              enable_safety_checker: true,
              output_format: "jpeg",
              loras: [{
                path: payload.payload.diffusers_lora_file.url
              }]
            },
            logs: true,
            onQueueUpdate: (update) => {
              if (update.status === "IN_PROGRESS") {
                update.logs.map((log) => log.message).forEach(console.log);
              }
            },
          });
          console.log(imgResult)
        
            shot = await db.shot.create({
             data: {
               prompt:promprttArr[i],
             
               replicateId: "adichividuuu",
               status: "starting",
               projectId: projects.id,
               outputUrl:imgResult.images[0].url
             },
           });
           console.log(shot)
         
    
          imgArr.push(imgResult)
      }

        let project = await db.project.update({
    where: { id: projects.id },
    data: { falUrl: payload.payload.diffusers_lora_file.url , modelStatus: "succeeded" },
  });
      // Send a response to acknowledge receipt of the webhook
      res.status(200).json({ message: 'Webhook received successfully' });
    } else {
      // Respond with a 405 Method Not Allowed if the method is not POST
      res.setHeader('Allow', ['POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  }