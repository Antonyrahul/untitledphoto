import ProjectCard from "@/components/projects/ProjectCard";
import Uploader from "@/components/dashboard/Uploader";
import { Box, Center, Heading, Spinner, Text, VStack } from "@chakra-ui/react";
import axios from "axios";
import { GetServerSidePropsContext } from "next";
import { getSession } from "next-auth/react";
import { useQuery } from "react-query";
import PageContainer from "@/components/layout/PageContainer";
import { ProjectWithShots } from "./studio/[id]";

export default function Home() {
  const {
    data: projects,
    refetch: refetchProjects,
    isLoading,
  } = useQuery(`projects`, () =>
    axios
      .get<ProjectWithShots[]>("/api/projects")
      .then((response) => response.data)
  );

  return (
    <PageContainer>
      <Box>
        <Heading as="h2" mb={4} fontWeight="semibold" fontSize="2xl">
          Create a new Headshot
        </Heading>
        <Uploader
          handleOnAdd={() => {
            refetchProjects();
          }}
        />
      </Box>

      <Box mt={10}>
        <Heading as="h2" mb={4} fontWeight="semibold" fontSize="2xl">
          My Headshots
        </Heading>

        {isLoading && (
          <Center width="100%" textAlign="center">
            <Spinner mr={3} size="sm" speed="1s" />
            <Text>Loading headshots</Text>
          </Center>
        )}

        {!isLoading && projects?.length === 0 && (
          <Center
            p={10}
            borderRadius="xl"
            backgroundColor="white"
            width="100%"
            color="blackAlpha.700"
            textAlign="center"
          >
            <Text backgroundColor="white">No headshots available yet</Text>
          </Center>
        )}

        <VStack spacing={10} width="100%">
          {projects?.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              handleRefreshProjects={() => {
                refetchProjects();
              }}
            />
          ))}
        </VStack>
      </Box>
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

  return { props: {} };
}
