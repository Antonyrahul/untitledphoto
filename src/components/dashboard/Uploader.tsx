import { createPreviewMedia, resizeImage } from "@/core/utils/upload";
import {
  Box,
  Button,
  Center,
  Flex,
  FormControl,
  FormHelperText,
  Highlight,
  Icon,
  Image,
  Input,
  List,
  Select,
  SimpleGrid,
  Spinner,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import axios from "axios";
import { useS3Upload } from "next-s3-upload";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { MdCheckCircle, MdCloud } from "react-icons/md";
import { IoIosClose } from "react-icons/io";
import { useMutation } from "react-query";
import AvatarsPlaceholder from "../home/AvatarsPlaceholder";
import { CheckedListItem } from "../home/Pricing";
import UploadErrorMessages from "./UploadErrorMessages";
import JSZip from "jszip";




type TUploadState = "not_uploaded" | "uploading" | "uploaded";
export type FilePreview = (File | Blob) & { preview: string };

const MAX_FILES = 30;

const Uploader = ({ handleOnAdd }: { handleOnAdd: () => void }) => {
  const [files, setFiles] = useState<FilePreview[]>([]);
  const [uploadState, setUploadState] = useState<TUploadState>("not_uploaded");
  const [errorMessages, setErrorMessages] = useState<string[]>([]);
  const [urls, setUrls] = useState<string[]>([]);
  const [studioName, setStudioName] = useState<string>("");
  const [instanceClass, setInstanceClass] = useState<string>("man");
  const [age,setAge]= useState<string>("early 20's")
  const [bodyType,setBodyType] = useState<string>("Athletic")
  const { uploadToS3 } = useS3Upload();
  const toast = useToast();

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/png": [".png"],
      "image/jpeg": [".jpeg", ".jpg"],
    },
    maxSize: 10000000, // 10mo
    onDropRejected: (events) => {
      setErrorMessages([]);
      const messages: { [key: string]: string } = {};

      events.forEach((event) => {
        event.errors.forEach((error) => {
          messages[error.code] = error.message;
        });
      });

      setErrorMessages(Object.keys(messages).map((id) => messages[id]));
    },
    onDrop: (acceptedFiles) => {
      if (files.length + acceptedFiles.length > MAX_FILES) {
        toast({
          title: `You can't upload more than ${MAX_FILES} images`,
          duration: 3000,
          isClosable: true,
          position: "top-right",
          status: "error",
        });
      } else {
        setErrorMessages([]);
        setFiles([
          ...files,
          ...acceptedFiles.map((file) => createPreviewMedia(file)),
        ]);
      }
    },
  });

  const handleUpload = async () => {
    if (files.length < 5) {
      toast({
        title: "You need to upload at least 5 photos",
        duration: 3000,
        isClosable: true,
        position: "top-right",
        status: "error",
      });
      return;
    }

    const filesToUpload = Array.from(files);
    setUploadState("uploading");

    for (let index = 0; index < filesToUpload.length; index++) {
      console.log("buffer to upload",filesToUpload[index])
      const file = await resizeImage(filesToUpload[index]);
      const { url } = await uploadToS3(file);

      setUrls((current) => [...current, url]);
      console.log(url)
    }
    // const zip = new JSZip();

    // for (let index = 0; index < filesToUpload.length; index++) {
    //   try {
    //     // Read the file as binary data
    //     let fileData = await filesToUpload[index].arrayBuffer();
        
    //     // Add the file to the zip using its name
    //     console.log(filesToUpload[index].type)
    //     zip.file(`${index}.jpg`, fileData);
    //   } catch (error) {
    //     console.error(`Error reading file`,error);
    //   }
    // }
  
    // Generate the zip file as a Blob and trigger download
    // zip.generateAsync({ type: 'blob' })
    //   .then((content) => {
    //     saveAs(content, 'images.zip');
    //   })
    //   .catch((error) => {
    //     console.error('Failed to generate zip file:', error.message);
    //   });
    // const zipBlob = await zip.generateAsync({ type: 'blob' });
    // const arrayBuffer = await zipBlob.arrayBuffer();
    // const { url } = await uploadToS3(zipBlob);
 

    setUploadState("uploaded");
  };

  const { mutate: handleCreateProject, isLoading } = useMutation(
    "create-project",
    () =>
      axios.post("/api/projects", {
        urls,
        studioName,
        instanceClass,
        age,
        bodyType
      }),
    {
      onSuccess: () => {
        handleOnAdd();

        // Reset
        setFiles([]);
        setUrls([]);
        setStudioName("");
        setInstanceClass("");
        setAge("");
        setBodyType("");
        setUploadState("not_uploaded");

        toast({
          title: "Studio created!",
          duration: 3000,
          isClosable: true,
          position: "top-right",
          status: "success",
        });
      },
    }
  );

  return (
    <Box>
      {uploadState === "not_uploaded" && (
        <Center
          _hover={{
            bg: "whiteAlpha.800",
          }}
          transition="all 0.2s"
          backgroundColor="whiteAlpha.500"
          cursor="pointer"
          borderRadius="xl"
          border="1px dashed gray"
          p={10}
          flexDirection="column"
          {...getRootProps({ className: "dropzone" })}
        >
          <input {...getInputProps()} />
          {/* <Box mb={4} position="relative">
            <AvatarsPlaceholder character="sacha" />
          </Box> */}
          <VStack textAlign="center" spacing={1}>
            <Box fontWeight="bold" fontSize="2xl">
              Drag and drop or click to upload
            </Box>
            <Box fontWeight="bold" fontSize="lg">
              <Highlight
                query="10-20 pictures"
                styles={{ bg: "brand.300", px: 1 }}
              >
                Upload 10-20 pictures of you
              </Highlight>
            </Box>
            <Box maxWidth="container.sm">
              <Text mt={4}>
                To get the best results, we suggest uploading 3 full body or
                entire object photos, 5 medium shots of the chest and up, and 10
                close-up photos and:
              </Text>
            </Box>
            <Box>
              <List mt={4} textAlign="left">
                <CheckedListItem>
                  Mix it up - change body pose, background, and lighting in each
                  photo
                </CheckedListItem>
                <CheckedListItem>
                  Capture a range of expressions
                </CheckedListItem>
                <CheckedListItem>
                  {`Show the subject's eyes looking in different directions`}
                </CheckedListItem>
              </List>
            </Box>
            {errorMessages?.length !== 0 && (
              <UploadErrorMessages messages={errorMessages} />
            )}
          </VStack>
        </Center>
      )}

      <Flex pt={3} flexWrap="wrap">
        {files.map((file, index) => (
          <Box
            m={3}
            width="7rem"
            height="7rem"
            position="relative"
            key={file.name}
          >
            <Center top={-2} right={-2} position="absolute">
              {uploadState === "uploading" && !urls[index] && (
                <Spinner
                  size="lg"
                  thickness="8px"
                  speed="1s"
                  color="brand.500"
                />
              )}

              {uploadState !== "uploading" && !urls[index] && (
                <Icon
                  cursor="pointer"
                  onClick={() => {
                    setFiles(files.filter((_, i) => i !== index));
                  }}
                  borderRadius="full"
                  backgroundColor="#FF6534"
                  as={IoIosClose}
                  fontSize="2rem"
                />
              )}

              {urls[index] && (
                <Icon
                  borderRadius="full"
                  backgroundColor="white"
                  color="green.400"
                  as={MdCheckCircle}
                  fontSize="2rem"
                />
              )}
            </Center>
            <Image
              objectFit="cover"
              borderRadius="xl"
              border="4px solid white"
              shadow="xl"
              alt={file.name}
              width="7rem"
              height="7rem"
              src={file.preview}
              onLoad={() => {
                URL.revokeObjectURL(file.preview);
              }}
            />
          </Box>
        ))}
      </Flex>

      {files.length > 0 && uploadState !== "uploaded" && (
        <Box mb={10} textAlign="center">
          <Button
            isLoading={uploadState === "uploading"}
            rightIcon={<MdCloud />}
            size="lg"
            onClick={handleUpload}
            variant="brand"
          >
            {files.length < 5
              ? "Upload (min 5 photos)"
              : `Upload ${files.length} photo${files.length > 1 && "s"}`}
          </Button>
        </Box>
      )}

      {uploadState === "uploaded" && (
        <SimpleGrid
          gap={4}
          columns={{ base: 1, md: 3 }}
          as="form"
          onSubmit={(e) => {
            e.preventDefault();
            handleCreateProject();
          }}
          mt={4}
          alignItems="flex-start"
        >
          <FormControl>
            <Input
              isRequired
              backgroundColor="white"
              placeholder="Studio name"
              value={studioName}
              onChange={(e) => setStudioName(e.currentTarget.value)}
            />
                        <FormHelperText color="blackAlpha.600">
                        Name of the awesome person

            </FormHelperText>
          </FormControl>
          
          <FormControl>
            <Select
              value={instanceClass}
              onChange={(e) => setInstanceClass(e.currentTarget.value)}
              backgroundColor="white"
            >
              <option value="man">Man</option>
              <option value="woman">Woman</option>
              <option value="child">Child</option>
              <option value="dog">Dog</option>
              <option value="cat">Cat</option>
              <option value="couple">Couple</option>
              <option value="style">Style</option>
            </Select>
            <FormHelperText color="blackAlpha.600">
              Gender of the person
            </FormHelperText>
          </FormControl>
         
          <FormControl>
            <Select
              value={age}
              onChange={(e) => setAge(e.currentTarget.value)}
              backgroundColor="white"
            >
              <option value="early 20's">18-30</option>
              <option value="early 30's">30-40</option>
              <option value="early 40's">40-50</option>
              <option value="early 50's">50-60</option>
              <option value="early 60's">60-70</option>
              <option value="early 70's">70-80</option>
              <option value="early 80's">80-90</option>
            </Select>
            <FormHelperText color="blackAlpha.600">
              Age range of the person
            </FormHelperText>
          </FormControl>
          <FormControl>
            <Select
              value={bodyType}
              onChange={(e) => setBodyType(e.currentTarget.value)}
              backgroundColor="white"
            >
              <option value="Athletic">Athletic</option>
              <option value="Slim">Slim</option>
              <option value="Full">Full</option>

            </Select>
            <FormHelperText color="blackAlpha.600">
              Body type of the person
            </FormHelperText>
          </FormControl>
          
          <Box>
            <Button
              disabled={!Boolean(studioName)}
              isLoading={isLoading}
              variant="brand"
              rightIcon={<MdCheckCircle />}
              onClick={() => {
                if (studioName && instanceClass) {
                  handleCreateProject();
                }
              }}
            >
              Create your Studio
            </Button>
          </Box>
        </SimpleGrid>
      )}
    </Box>
  );
};

export default Uploader;
