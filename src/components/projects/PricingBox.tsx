import {
    Box,
    Stack,
    VStack,
    HStack,
    Text,
    Heading,
    Divider,
    List,
    ListIcon,
    ListItem,
    Button
  } from "@chakra-ui/react";
  import { CheckedListItem } from "../home/Pricing";
  import { HiBadgeCheck } from "react-icons/hi";
//import { Stack } from "aws-cdk-lib";
  
  //import { ArrowForwardIcon, CheckCircleIcon } from "@chakra-ui/icons";
  import PropTypes from "prop-types";
  
  const PricingBox = ({ popular, name, price, info = "", features = [] }:{popular:any,name:any,price:any,info:any,features:any}) => {
    return (
      <Stack
        //spacing={2}
        border="3px solid"
        borderColor={popular ? "teal.300" : "gray.300"}
        borderRadius="0.7rem"
        p={4}
        h="350px"
        backgroundColor="white"
        position="relative"
      >
        {popular && (
          <Box
            position="absolute"
            top="0"
            right="0"
            backgroundColor="teal.300"
            color="white"
            paddingX={2}
            paddingY={1}
            borderRadius="0 0 0 0.7rem"
            fontSize="0.8rem"
          >
            POPULAR
          </Box>
        )}
        <Text textTransform="uppercase">{name}</Text>
        
          <Heading>{price ?? "Free"}</Heading>
          
      
        <Divider borderColor="blackAlpha.500" />
        <List flex="1">
          {features.map((feat:any) => (
            <ListItem textAlign={"left"} key={Math.random()}>
               {/* <ListIcon as={CheckCircleIcon} color="gray.400" />  */}
               <ListIcon fontSize="xl" as={HiBadgeCheck} />
              {feat}
            </ListItem>
          ))}
        </List>
        <Box>
          <Button
          
            variant="solid"
            size="sm"
            width="100%"
            // rightIcon={<ArrowForwardIcon />}
            borderRadius={0}
            display=""
            justifyContent="space-between"
            backgroundColor={popular ? "teal.300" : "black"}
            _hover={{
              backgroundColor: popular ? "teal.500" : "gray.300",
              color:"black"
            }}
            color=" white"
          >
            Buy
          </Button>
          
        </Box>
      </Stack>
    );
  };
  PricingBox.propTypes = {
    name: PropTypes.string.isRequired,
    popular: PropTypes.bool,
    price: PropTypes.string,
    info: PropTypes.string,
    features: PropTypes.array.isRequired
  };
  
  export default PricingBox;
  