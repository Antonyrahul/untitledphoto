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

      if(projects.webHook!="received")
      {

        let projectUp = await db.project.update({
          where: { id: projects.id },
          data: { webHook:"received" },
        });
     
      const instanceClass = projects.instanceClass;
      const age = projects.age
      const bodyType = projects.bodyType
      console.log("webhook instance calss",instanceClass)

      console.log("webhook projects find",projects)
      // Do something with the payload (e.g., log it or save it in the database)
      console.log('Webhook received:', payload);
      var imgArr:any=[]
      
      // const promprttArr=["A noble Victorian sksrr gentleman standing in an opulent 19th-century study, dressed in a tailored dark navy frock coat, a gold pocket watch hanging from his vest, and a silk cravat. Sunlight streams through the tall windows, illuminating the fine details of the room’s antique furniture. Hyper-realistic, ultra-HD, photorealistic textures",
      // "A rugged sksrr cowboy standing in the middle of a vast desert, dressed in a weathered brown leather jacket, cowboy hat, and boots. His revolver holstered at his side, he looks into the distance as the sun sets behind him, casting a golden glow over the dunes. 16K resolution, ultra-sharp detail, cinematic Western style",
      // "A powerful Norse sksrr warrior in a frozen landscape, wearing detailed battle armor made of steel and fur. His long hair flows in the wind as he grips a massive axe, snowflakes falling around him. Behind him, a towering Viking ship rests on icy waters. Epic fantasy realism, ultra-HD, 8K textures",
      // "A modern sksrr businessman in a sleek, tailored black suit walking confidently through a futuristic glass cityscape at sunset. The reflection of the skyline glows on the skyscrapers as he adjusts his cufflinks. The scene captures motion and elegance with a shallow depth of field. Photorealistic, ultra-HD, stylish",
      // "A mysterious sksrr samurai in a misty bamboo forest, wearing a traditional dark blue kimono with golden embroidery. His katana is drawn slightly, reflecting the dim moonlight filtering through the leaves. The atmosphere is serene yet tense, capturing ancient warrior spirit. 8K ultra-realistic, cinematic",
      // "A heroic sksrr firefighter emerging from the smoke, wearing a soot-covered yellow fire-resistant suit and helmet with a reflective visor. The glow of embers illuminates his determined expression as water sprays from a nearby hose. Ultra-realistic, high-action shot, 12K resolution, dramatic lighting."
      // ]
      const malePrompts = [
        `Sksrr male model in his ${age} having a ${bodyType} body wearing a well-fitted grey suit with a light grey textured tie and a crisp white shirt, standing confidently in front of large floor-to-ceiling windows with a blurred cityscape in the background. The natural light softly illuminates his face, highlighting his sharp features and well-groomed beard, creating a professional and polished look perfect for a corporate or LinkedIn profile photo. The overall style is modern and sophisticated, with a touch of elegance that reflects a strong, confident presence in an urban setting.`,
        `Sksrr male model in his ${age} having a ${bodyType} dressed in a classic black suit and white shirt, standing against a soft gradient background in shades of blue and grey. His expression is serious yet welcoming, with the clean and simple background keeping the focus on his professional appearance.`,
        `Sksrr male model in his ${age} having a ${bodyType} leaning slightly forward, dressed in smart casual attire, such as a blazer over a white shirt, with a clean, white background. The expression is bold and confident, reflecting the entrepreneurial spirit and readiness to take action. The simplicity of the background keeps the focus on the model’s determined gaze.`,
        `Sksrr male model in his ${age} having a ${bodyType} sitting, close-up portrait, dressed in a formal business suit, against a solid navy or dark gray background, posture is upright and confident, with the simple, dark background adding a touch of elegance and authority.`,
        `Sksrr male model in his ${age} having a ${bodyType} standing confidently with arms crossed in front of a large window overlooking a city skyline, model is dressed in a sharp, tailored suit, with a neutral, modern office background that emphasizes professionalism and leadership.`,
        `Sksrr male model in his ${age} having a ${bodyType} standing in a minimalist office with a white desk, modern chairs, and plants in the background. The model is wearing a fitted blazer and smiling, giving a sense of calm and professionalism in a clean, organized environment.`,
        `Sksrr male model in his ${age} having a ${bodyType} standing confidently in a well-fitted suit, with a strong, professional expression. The background is dark gray or navy blue, adding a sense of seriousness and authority. The model’s head is tilted slightly, suggesting both approachability and professionalism, perfect for the legal field.`,
        `Sksrr male model in his ${age} having a ${bodyType} dressed in a classic black suit and white shirt, standing against a soft gradient background in shades of blue and grey. His expression is serious yet welcoming, with the clean and simple background keeping the focus on his professional appearance.`,
        `Sksrr male model in his ${age} having a ${bodyType} dressed in a sharp, double-breasted navy suit with gold buttons and a crisp white pocket square, standing confidently by the edge of a picturesque lake in a luxurious European town. The background features elegant, pastel-colored villas nestled among lush green hills, with the calm water reflecting the beautiful surroundings. The model’s poised expression and impeccable style exude sophistication and timeless elegance, perfectly capturing the essence of refined luxury in a stunning, scenic location.`,
        `Sksrr male model in his ${age} having a ${bodyType} exuding classic Ivy League style, dressed in a refined, preppy ensemble perfect for a day at an exclusive country club. Wearing a tailored light khaki quarter-zip sweater layered over a crisp, navy collared shirt, paired with well-fitted cream chinos. The outfit embodies the old-money aesthetic with its subtle, yet luxurious details, reminiscent of Ralph Lauren’s timeless elegance. The lush, manicured greenery of the background adds to the elite, neo-prep atmosphere, capturing the essence of a modern-day Gatsby or a character straight out of a Gossip Girl scene.`,
        `Portrait of Sksrr male model in his ${age} having a ${bodyType} seated in a luxurious leather armchair in a grand library, surrounded by floor-to-ceiling bookshelves filled with leather-bound volumes. Model is wearing a classic three-piece suit with a pocket watch, under the warm glow of a crystal chandelier.`,
        `Sksrr male in his ${age} having a ${bodyType} in dramatic lighting, dark, sophisticated, one hand clenching chin, chessboard, leaning towards chessboard, chess pieces, dark gothic building, stained glass, looking at viewer with fascination.`,
        `A professional headshot of sksrr male in his ${age} having a ${bodyType} in a modern office setting, wearing a crisp navy suit. Soft natural lighting from large windows, shallow depth of field, warm color palette.`,
        `Sksrr male in his ${age} having a ${bodyType} in a sleek, minimalist studio. High-key lighting, white background, wearing a light gray business casual shirt. Sharp focus on eyes, professional and approachable expression.`,
        `Corporate portrait of sksrr male in his ${age} having a ${bodyType} against a textured dark background. Dramatic side lighting, wearing a black turtleneck. Moody and sophisticated atmosphere, perfect for executive profiles.`,
        `Outdoor headshot of sksrr male in his ${age} having a ${bodyType} in an urban environment. Golden hour lighting, shallow depth of field with blurred city backdrop. Business casual attire with a pop of color in the tie.`,
        `Professional studio portrait of sksrr male in his ${age} having a ${bodyType} with a gradient background from deep blue to teal. Rembrandt lighting, wearing a charcoal suit with a white shirt. Confident and trustworthy expression.`,
        `Sksrr male in his ${age} having a ${bodyType} in a creative office space, sitting casually at a modern desk. Soft, diffused lighting, wearing smart casual attire. Vibrant but professional color palette, ideal for tech or startup profiles.`,
        `Classic black and white headshot of sksrr male in his ${age} having a ${bodyType}. High contrast lighting, sharp focus on facial features. Timeless and elegant portrait suitable for any professional setting.`,
        `Environmental portrait of sksrr male in his ${age} having a ${bodyType} in a sunlit conference room. Wearing a light blue dress shirt, no tie. Soft background blur, warm and inviting atmosphere.`,
        `Studio headshot of sksrr male in his ${age} having a ${bodyType} with a bold, colorful background. Professional lighting with a subtle edge light. Modern business attire, friendly and approachable expression. Perfect for personal branding.`,
        `Professional portrait of sksrr male in his ${age} having a ${bodyType} in a library or study setting. Warm, ambient lighting from desk lamps. Wearing glasses and a tweed jacket for an intellectual, trustworthy look. Rich, earthy color tones.`,
        `Sksrr male model in his ${age} having a ${bodyType} in a crisp white shirt, sitting in a private jet on couch at window, sky visible through large windows, bokeh.`,
        `Sksrr male model in his ${age} having a ${bodyType} wearing a tailored dark brown suit with a matching bow tie, and a crisp white dress shirt, standing confidently in a dimly lit, elegant hallway with warm, ambient lighting and chandeliers softly glowing in the background, creating a luxurious atmosphere with a subtle bokeh effect.`,
        `Sksrr male model in his ${age} having a ${bodyType} dressed in a classic black suit and white shirt, standing against a soft gradient background in shades of blue and grey. His expression is serious yet welcoming, with the clean and simple background keeping the focus on his professional appearance.`
      ];

      

      const femalePrompts = [
        `Sksrr female Model in her ${age} having a ${bodyType} seated at a desk or standing against a colorful, abstract background, wearing stylish yet professional clothing like a smart jacket with artistic accessories. The model’s expression is thoughtful and expressive, representing creativity and innovation in a business setting.`,
        `Sksrr female model in her ${age} having a ${bodyType} standing against a soft gray gradient background, dressed in a tailored blazer and blouse. The model’s confident smile and neutral background create a timeless, professional look that keeps the focus on the model.`,
        `Sksrr female model in her ${age} having a ${bodyType} in a sophisticated outfit, working late in a dimly lit office, with a soft glow from computer screen illuminating focused face as typing quickly, papers scattered around.`,
        `Sksrr female model in her ${age} having a ${bodyType} in a tailored black blazer over a white blouse, with a confident smile, standing against a soft, neutral-toned background. The close-up headshot highlights professional and approachable demeanor, making it ideal for a LinkedIn profile.`,
        `Sksrr female model in her ${age} having a ${bodyType} in a tailored black blazer over a white blouse, with a confident smile, standing against a soft, neutral-toned background. The close-up headshot highlights professional and approachable demeanor, making it ideal for a LinkedIn profile.`,
        `Sksrr female model in her ${age} having a ${bodyType} standing with arms crossed in front of a corporate building entrance, dressed in a classic, professional suit. The background features the company logo subtly visible, with the model’s confident smile and upright posture reflecting authority and success.`,
        `Close-up portrait of Sksrr female model in her ${age} having a ${bodyType} standing against a dark gray background, wearing a stylish dark-colored suit with minimal accessories. The dark background contrasts with the model’s outfit and features, creating a sleek and modern business portrait.`,
        `Sksrr female model in her ${age} having a ${bodyType} in a business suit, standing by a large window with a city skyline view, having tablet in hands, confidence, portrait.`,
        `Sksrr female model in her ${age} having a ${bodyType} in a crisp white silk shirt, sitting in a private jet on couch at window, sky visible through large windows, bokeh.`,
        `A portrait of a young sksrr woman in her ${age} having a ${bodyType} with wavy dark brown hair, sitting on a couch, wearing a black blazer over a white silk shirt. Her posture is confident and relaxed, with hands on her knees. Soft lighting highlights her sharp facial features, against a blurred, muted background, creating a minimalist, elegant atmosphere.`,
        `Elegant portrait of sksrr woman in her ${age} having a ${bodyType} with long wavy hair, wearing a white professional outfit, soft smile, indoors, bright natural light, white brick background.`,
        `Elegant indoor portrait of sksrr woman in her ${age} having a ${bodyType} in a black dress, wavy hair, thoughtful pose, dark background, soft lighting.`,
        `A professional headshot of sksrr woman in her ${age} having a ${bodyType} in a modern office setting, wearing a crisp navy suit. Soft natural lighting from large windows, shallow depth of field, warm color palette.`,
        `Sksrr woman in her ${age} having a ${bodyType} in a sleek, minimalist studio. High-key lighting, white background, wearing a light gray business casual shirt. Sharp focus on eyes, professional and approachable expression.`,
        `Corporate portrait of sksrr woman in her ${age} having a ${bodyType} against a textured dark background. Dramatic side lighting, wearing a black turtleneck. Moody and sophisticated atmosphere, perfect for executive profiles.`,
        `Outdoor headshot of sksrr woman in her ${age} having a ${bodyType} in an urban environment. Golden hour lighting, shallow depth of field with blurred city skyline backdrop. Business casual attire with a pop of color in the tie.`,
        `Professional studio portrait of sksrr woman in her ${age} having a ${bodyType} with a gradient background from deep blue to teal. Rembrandt lighting, wearing a charcoal suit with a white shirt. Confident and trustworthy expression.`,
        `Sksrr woman in her ${age} having a ${bodyType} in a creative office space, sitting casually at a modern desk. Soft, diffused lighting, wearing smart casual attire. Vibrant but professional color palette, ideal for tech or startup profiles.`,
        `Classic black and white headshot of sksrr woman in her ${age} having a ${bodyType}. High contrast lighting, sharp focus on facial features. Timeless and elegant portrait suitable for any professional setting.`,
        `Environmental portrait of sksrr woman in her ${age} having a ${bodyType} in a sunlit conference room. Wearing a light blue dress shirt, no tie. Soft background blur, warm and inviting atmosphere.`,
        `Studio headshot of sksrr woman in her ${age} having a ${bodyType} with a bold, colorful background. Professional lighting with a subtle edge light. Modern business attire, friendly and approachable expression. Perfect for personal branding.`,
        `Professional portrait of sksrr woman in her ${age} having a ${bodyType} in a library or study setting. Warm, ambient lighting from desk lamps. Wearing glasses and a tweed jacket for an intellectual, trustworthy look. Rich, earthy color tones.`,
        `A sksrr businesswoman in her ${age} having a ${bodyType} in a tailored black blazer and white blouse, standing in a high-rise office with city views, exuding authority.`,
        `A sksrr female professional in her ${age} having a ${bodyType} in a navy blue pantsuit, seated at a glass desk with a confident smile, ready for business.`,
        `A sksrr woman in her ${age} having a ${bodyType} in a white blazer and pearl necklace, standing against a neutral studio backdrop, with a poised expression.`
      ];
      
     
      const promprttArr:any=[]
      

while (promprttArr.length < 10) {
  console.log("in while")
  const randomIndex = Math.floor(Math.random() * 25);
 
    if(instanceClass=="man"){
    promprttArr.push(malePrompts[randomIndex]);
    }
    else if(instanceClass=="woman")
    promprttArr.push(femalePrompts[randomIndex]);
  
}

      
console.log("final prompt array",promprttArr)

setTimeout(() => {
  
}, 5000);

      let shot:any;
      let i;
      for( i=0;i<promprttArr.length;i++){
        console.log("in for loop number    ",i)
        let imgResult:any =await fal.subscribe("fal-ai/flux-lora", {
            input: {
              prompt: promprttArr[i],
              image_size:  {
                "width": 720,
                "height": 720
              },
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
                //update.logs.map((log) => log.message).forEach(console.log);
              }
            },
          });
          console.log("image result in for loop   ",i,imgResult)
        
            shot = await db.shot.create({
             data: {
               prompt:promprttArr[i],
             
               replicateId: "adichividuuu",
               status: "starting",
               projectId: projects.id,
               outputUrl:imgResult.images[0].url
             },
           });
           console.log("Shot in for loop",i,shot)
         
    
          imgArr.push(imgResult)
          console.log("imgarr result in for loop   ",i,imgArr)
      }
      console.log("final imgarr",imgArr)

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
}