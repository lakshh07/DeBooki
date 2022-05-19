import React from "react";
import {
  Box,
  Stack,
  Heading,
  Flex,
  Text,
  Button,
  Image,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  useDisclosure,
} from "@chakra-ui/react";

function Web3modal({ handleLogin, connectToWallett, isOpen, onClose }) {
  return (
    <>
      <Modal isCentered isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalBody>
            <Box py="1em" h="min-content">
              <Flex justifyContent="center">
                <Flex
                  alignItems="center"
                  justifyContent="center"
                  flexDir="column"
                  px="3.5em"
                  py="1em"
                  _hover={{ backgroundColor: "whitesmoke" }}
                  rounded="20px"
                  cursor="pointer"
                  onClick={() => {
                    connectToWallett();
                    onClose();
                  }}
                >
                  <Image src={`/metamask-fox.svg`} width={95} />
                  <Text fontFamily="Lato" textTransform="uppercase" mt="2em">
                    Metamask
                  </Text>
                </Flex>
                <Flex
                  alignItems="center"
                  justifyContent="center"
                  flexDir="column"
                  px="3em"
                  py="1em"
                  _hover={{ backgroundColor: "whitesmoke" }}
                  rounded="20px"
                  cursor="pointer"
                  onClick={() => {
                    handleLogin();
                    onClose();
                  }}
                >
                  <Image src={`/usd.svg`} width={100} />
                  <Text
                    fontFamily="Lato"
                    textAlign="center"
                    textTransform="uppercase"
                    mt="2em"
                  >
                    unstoppable domain
                  </Text>
                </Flex>
              </Flex>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

export default Web3modal;
