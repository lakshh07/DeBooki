import { useRouter } from "next/router";
import Image from "next/image";
import React from "react";
// import Link from "next/link";
import { useEffect, useState } from "react";
import { useLoadingContext } from "../src/context/Loading";
import { useSignerContext } from "../src/context/Signer";
import { connectToWallet } from "../src/controllers/ConnectWallet";
import {
  useToast,
  Tag,
  Link,
  Avatar,
  Button,
  Box,
  Heading,
  Text,
  Grid,
  Flex,
  Divider,
  Icon,
  HStack,
} from "@chakra-ui/react";
import svgAvatarGenerator from "../src/context/avatar";
import { BsArrowRight } from "react-icons/bs";

interface Props {}

const index = (props: Props) => {
  const toast = useToast();
  const router = useRouter();
  const { setLoading } = useLoadingContext();
  const { setSigner, signer } = useSignerContext();
  const [add, setAdd] = useState(undefined);
  const [avatar, setAvatar] = useState(undefined);

  useEffect(() => {
    router.prefetch(`/dashboard`);
    setTimeout(() => {
      setLoading(false);
    }, 2000);

    let svg = svgAvatarGenerator(add, { dataUri: true });
    setAvatar(svg);
  }, []);

  async function connectToWallett() {
    const providerEventsCB = async (_signer, _address, _network) => {
      if (_signer && _address && _network) {
        setSigner({ address: _address, signer: _signer, network: _network });
      } else {
        setSigner(undefined);
      }
    };

    connectToWallet(providerEventsCB).then(async (_signer) => {
      if (_signer) {
        console.log(_signer);
        const _address = await _signer.getAddress();
        const _network = window.ethereum.networkVersion;
        console.log(_network);
        setAdd(_address);
        _address &&
          toast({
            title: "Yeah, Wallet Connected !",
            status: "success",
            duration: 5000,
            isClosable: false,
            position: "top",
          });
        setSigner({ address: _address, signer: _signer, network: _network });
      }
    });
  }

  function nextToShelf() {
    if (signer) {
      setLoading(true);
      router.push({
        pathname: "/dashboard",
      });
    } else {
      toast({
        title: "Wallet Not Connected !",
        description: "Please connect your wallet first.",
        status: "error",
        duration: 5000,
        isClosable: false,
        position: "top",
      });
    }
  }
  return (
    <>
      <Box
        m="0"
        p="0.5em"
        position="relative"
        top="0"
        w="100%"
        h="100%"
        bg="#77787A"
      >
        <Box mx="auto" bg="whitesmoke" rounded="5px">
          <Box h="95vh" className="m-bg">
            <Flex
              justifyContent="space-between"
              mx="3em"
              py="1em"
              alignItems="center"
              className="border-down"
            >
              <Box>
                <Heading fontFamily="Philosopher">DeBooki</Heading>
                <Text fontFamily="Philosopher">
                  A Metaverse NFTs Book Library
                </Text>
              </Box>
              <Box>
                {add ? (
                  <Flex
                    alignItems="center"
                    className="address-box"
                    px="1em"
                    py="0.5em"
                  >
                    <Avatar mr="15px" size="sm" src={avatar} />
                    <Box mr="15px">
                      <Text fontSize="16px" fontWeight={500} lineHeight="1.1em">
                        {add.substr(0, 6)}...{add.substr(-4)}
                      </Text>
                    </Box>
                  </Flex>
                ) : (
                  // <Box
                  //   boxShadow="rgba(100, 100, 111, 0.4) 0px 7px 29px 0px"
                  //   py="0.5em"
                  //   px="0.5em"
                  //   bg="rgb(1, 119, 255,0.3)"
                  //   rounded="10px"
                  //   fontFamily="Montserrat"
                  //   fontWeight={500}
                  //   lineHeight="1.1em"
                  //   fontSize="13px"
                  // >
                  //   <Avatar mr="15px" size="xs" src={avatar} />
                  //   {add.substr(0, 6)}...{add.substr(-4)}
                  // </Box>
                  <Button
                    boxShadow="rgba(100, 100, 111, 0.4) 0px 7px 29px 0px"
                    rounded="20px"
                    p="1.2em"
                    bg="#FE6161"
                    color="white"
                    _hover={{
                      bg: "#FE6161",
                      top: "-2px",
                      boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
                    }}
                    fontFamily="Montserrat"
                    onClick={connectToWallett}
                  >
                    Connect Wallet
                  </Button>
                )}
              </Box>
            </Flex>
            <Divider
              w="95%"
              align="center"
              mx="auto"
              borderColor="blackAlpha.600"
            />
            <Flex
              mx="6.5%"
              py="2.5em"
              justifyContent="space-between"
              alignItems="center"
            >
              <Box flex="2">
                <Flex
                  w="74%"
                  position="relative"
                  justifyContent="space-between"
                  mb="10px"
                >
                  <Heading
                    className="h-shadow"
                    fontSize="5em"
                    fontFamily="Montserrat"
                  >
                    Get Your
                  </Heading>
                  <Box
                    pb="1em"
                    className="h-shadow"
                    position="absolute"
                    right="0"
                    bottom="-4"
                  >
                    <Image src={"/m5.png"} height={100} width={200} />
                  </Box>
                </Flex>
                <Flex>
                  <Box>
                    <Text
                      mt="10px"
                      ml="1em"
                      mr="1em"
                      p="0"
                      color="blackAlpha.600"
                      fontSize="20px"
                      fontFamily="Montserrat"
                      className="text-v"
                    >
                      <span className="border-bottom">Trend</span>ing book{" "}
                      <span className="border-bottom">collection release</span>
                    </Text>
                  </Box>
                  <Box align="left" w="max-content">
                    <Heading
                      className="h-shadow"
                      pt="0.1em"
                      fontSize="5em"
                      fontFamily="Montserrat"
                      mb="10px"
                    >
                      New NFT Book
                    </Heading>
                    <Flex
                      mb="10px"
                      position="relative"
                      justifyContent="space-between"
                    >
                      <Box
                        pb="1em"
                        className="h-shadow"
                        position="absolute"
                        left="10"
                        bottom="-10"
                      >
                        <Image src={"/m6.png"} height={100} width={100} />
                      </Box>
                      <Heading
                        className="h-shadow"
                        pt="0.1em"
                        pl="2em"
                        fontSize="5em"
                        fontFamily="Montserrat"
                      >
                        Collection
                      </Heading>
                    </Flex>
                    <Text
                      fontSize="20px"
                      my="1em"
                      mt="2em"
                      ml="8px"
                      color="blackAlpha.800"
                      fontFamily="Montserrat"
                    >
                      Discover, Collect and Sell An Extraodinary Books NFTs
                    </Text>
                    <Divider
                      w="95%"
                      align="center"
                      mx="auto"
                      borderColor="blackAlpha.600"
                      my="1em"
                    />
                    <Button
                      my="1em"
                      boxShadow="rgba(100, 100, 111, 0.4) 0px 7px 29px 0px"
                      rounded="30px"
                      p="1.5em"
                      bg="#FE6161"
                      color="white"
                      _hover={{
                        bg: "#FE6161",
                        right: "-2px",
                        boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
                      }}
                      rightIcon={<BsArrowRight />}
                      onClick={nextToShelf}
                      fontFamily="Montserrat"
                    >
                      Explore Now
                    </Button>
                  </Box>
                </Flex>
              </Box>
              <Image src={"/book.png"} height={580} width={550} />
            </Flex>
          </Box>

          <Box position="absolute" mt="30px" className="h-shadow" left="2">
            <Image src={"/m4.png"} height={150} width={110} />
          </Box>

          <Box my="10em" align="center" className="m-bg">
            <Heading
              className="h-shadow"
              fontSize="3em"
              fontFamily="Montserrat"
            >
              Our Features
            </Heading>
            <Grid
              mt="3em"
              mx="7.5%"
              templateColumns="repeat(3, 1fr)"
              gap={6}
              alignItems="center"
              justifyContent="center"
              fontSize="1.5em"
              fontFamily="Montserrat"
            >
              <Flex
                w="400px"
                alignItems="center"
                py="2em"
                px="1em"
                rounded="10px"
                bg="rgb(224, 224, 224)"
                justifyContent="center"
                className="f-box"
              >
                <Box flex="2" align="left">
                  <Heading
                    fontSize="1.1em"
                    fontFamily="Montserrat"
                    fontWeight="500"
                  >
                    Rent
                  </Heading>
                  <Text mt="15px" fontSize="0.7em">
                    Rent Your Favorite NFT Collection
                  </Text>
                </Box>
                <Image src={"/m2-1.png"} height={130} width={130} />
              </Flex>
              <Flex
                w="400px"
                alignItems="center"
                py="2em"
                px="1em"
                rounded="10px"
                bg="rgb(224, 224, 224)"
                justifyContent="center"
                className="f-box"
              >
                <Box flex="2" align="left">
                  <Heading
                    fontSize="1.1em"
                    fontFamily="Montserrat"
                    fontWeight="500"
                  >
                    Exchange
                  </Heading>
                  <Text mt="15px" fontSize="0.7em">
                    Exchange Your NFT Collection With Community
                  </Text>
                </Box>
                <Image src={"/m2-2.png"} height={130} width={130} />
              </Flex>
              <Flex
                w="400px"
                alignItems="center"
                py="2em"
                px="1em"
                rounded="10px"
                bg="rgb(224, 224, 224)"
                justifyContent="center"
                className="f-box"
              >
                <Box flex="2" align="left">
                  <Heading
                    fontSize="1.1em"
                    fontFamily="Montserrat"
                    fontWeight="500"
                  >
                    Sell
                  </Heading>
                  <Text mt="15px" fontSize="0.7em">
                    Sell Your NFT Collection Easily
                  </Text>
                </Box>
                <Image src={"/m2-3.png"} height={130} width={130} />
              </Flex>
            </Grid>
          </Box>

          <Box
            position="absolute"
            mt="-4em"
            className="h-shadow rotate"
            right="2"
          >
            <Image src={"/m4.png"} height={150} width={110} />
          </Box>

          <Box
            mx="7.5%"
            bg="rgb(224, 224, 224)"
            rounded="20px"
            overflow="hidden"
            px="5em"
            className="m-bg-2"
          >
            <Flex
              align="center"
              justifyContent="space-between"
              position="relative"
            >
              <Flex
                rounded="10px"
                justifyContent="space-around"
                flexDir="column"
              >
                <Heading
                  className="h-shadow"
                  fontSize="3em"
                  fontFamily="Montserrat"
                >
                  Deep Dive Into The Worlds Of NFT Books
                </Heading>
                <Box mt="2em">
                  <Text fontFamily="Montserrat">
                    Start Your Own Collection Now!
                  </Text>
                  <Divider borderColor="blackAlpha.600" my="1em" />
                  <Button
                    mt="20px"
                    boxShadow="rgba(100, 100, 111, 0.4) 0px 7px 29px 0px"
                    rounded="30px"
                    p="1.5em"
                    bg="#FE6161"
                    color="white"
                    _hover={{
                      bg: "#FE6161",
                      right: "-2px",
                      boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
                    }}
                    rightIcon={<BsArrowRight />}
                    onClick={nextToShelf}
                    fontFamily="Montserrat"
                  >
                    Explore Now
                  </Button>
                </Box>
              </Flex>
              <Box mb="-20px">
                <Image src={"/ebooks.png"} height={600} width={600} />
              </Box>
            </Flex>
          </Box>

          <Box mt="10em" bg="rgb(190,190,190)" borderBottomRadius="5px">
            <Text
              pt="10px"
              color="blackAlpha.600"
              fontFamily="Montserrat"
              textAlign="center"
            >
              Powered By
            </Text>
            <HStack
              py="20px"
              spacing="2em"
              justifyContent="center"
              alignItems="center"
            >
              <a
                href="https://ethglobal.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="h-shadow"
              >
                <Image src={"/logo/ethglobal.svg"} height={50} width={50} />
              </a>
              <a
                href="https://filecoin.io/"
                target="_blank"
                rel="noopener noreferrer"
                className="h-shadow"
              >
                <Image src={"/logo/filecoin-logo.svg"} height={50} width={50} />
              </a>
              <a
                href="https://ipfs.io/"
                target="_blank"
                rel="noopener noreferrer"
                className="h-shadow"
              >
                <Image src={"/logo/ipfs-logo.svg"} height={50} width={50} />
              </a>
              <a
                href="https://polygon.technology/"
                target="_blank"
                rel="noopener noreferrer"
                className="h-shadow"
              >
                <Image src={"/logo/polygon-logo.svg"} height={50} width={50} />
              </a>
              <a
                href="https://www.superfluid.finance/home"
                target="_blank"
                rel="noopener noreferrer"
                className="h-shadow"
              >
                <Image src={"/logo/superfluid.svg"} height={50} width={50} />
              </a>
            </HStack>
            <Divider w="95%" align="center" mx="auto" />
            <Flex
              fontFamily="Montserrat"
              px="15%"
              py="1em"
              alignItems="center"
              justifyContent="space-around"
            >
              <Link href="https://nfthack.ethglobal.co/" isExternal>
                <Text>Build In NFT HACK 2022 - ETH GLOBAL</Text>
              </Link>
              <Divider orientation="vertical" height="30px" />
              <Flex alignItems="center">
                <Text>Build and Designed By&nbsp;</Text>
                <Text textDecoration="underline">
                  <Link href="https://lakshaymaini.com/" isExternal>
                    Lakshay Maini
                  </Link>
                </Text>
              </Flex>
            </Flex>
            <Divider w="95%" align="center" mx="auto" />
            <Text
              textAlign="center"
              color="blackAlpha.600"
              fontFamily="Montserrat"
              py="0.5em"
            >
              &copy; {new Date().getFullYear()} Lakshay Maini
            </Text>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default index;
