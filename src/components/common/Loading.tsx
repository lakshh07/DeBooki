import React from 'react';
import {Box, Stack, Heading, Text} from "@chakra-ui/react"

interface Props {}

const Loading = (props: Props) => {
  return (
    <Box position="fixed" w="100%" h="100%" top="40%" zIndex="999" my="auto">
      <Box top="50%">
      <Stack spacing="1em" alignItems="center">
        <Box align="center">
          <Heading fontSize="3em" fontFamily="Philosopher">DeBooki</Heading>
          <Text fontFamily="Philosopher">A Metaverse NFTs Book Library</Text>
        </Box>
        <Box className="loading-bar"></Box>
      </Stack></Box>
    </Box>
  );
};

export default Loading;
