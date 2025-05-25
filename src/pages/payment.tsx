import ProjectCard from "@/components/projects/ProjectCard";
import Uploader from "@/components/dashboard/Uploader";
import { Box, Center, Heading, Spinner, Text, VStack } from "@chakra-ui/react";
import axios from "axios";
import { GetServerSidePropsContext } from "next";
import { getSession ,useSession} from "next-auth/react";
import { useQuery } from "react-query";
import PageContainer from "@/components/layout/PageContainer";
import { useRouter } from "next/router";
import { ProjectWithShots } from "./studio/[id]";
import { headers } from 'next/headers'
import {authOptions} from './api/auth/[...nextauth]'
//import { useSession } from "next-auth/react"


export default function Payment() {
  const router=useRouter()
  console.log(router.query.payment_id)
  const payment_id= router.query.payment_id

 axios.post("/api/dodo/verify",{payment_id}).then((resp)=>{console.log(resp)
      window.open("/dashboard","_self")
  
  })



  return (
    <PageContainer>
     Redirecting ...
    </PageContainer>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession({ req: context.req });
  console.log("dashboard session", session)
  if (!session) {
    return {
      redirect: {
        permanent: false,
        destination: "/login",
      },
      props: {},
    };
  }

  return { props: {session} };
}
