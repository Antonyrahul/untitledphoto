import Features from "@/components/home/Features";
import Hero from "@/components/home/Hero";
import Pricing from "@/components/home/Pricing";
import Slider from "@/components/home/Slider";
import { Flex } from "@chakra-ui/react";
import { getSession } from "next-auth/react";
import { GetServerSidePropsContext } from "next";




export default function Home() {


    
  return (
    <>
      <Flex flexDirection="column" marginX="auto" flex="1">
        <Hero />
      </Flex>
      {/* <Slider /> */}
      {/* <Features /> */}
      <Flex px={4} py={10} maxWidth="container.lg" width="100%" marginX="auto">
        {/* <Pricing /> */}
      </Flex>
    </>
  );

}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession({ req: context.req });
  console.log(session)
  const projectId = context.query.id as string;
  console.log(projectId)

  if (!session) {
    return {
      redirect: {
        permanent: false,
        destination: "/login",
      },
    };
  }
  
    return {
      redirect: {
        permanent: false,
        destination: "/dashboard",
      },
    };
  
}
