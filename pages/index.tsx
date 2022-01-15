import { useRouter } from "next/router";
import Image from "next/image";
// import Link from "next/link";
import { useEffect, useState } from "react";
import { useLoadingContext } from "../src/context/Loading";
import { useSignerContext } from "../src/context/Signer";
import { connectToWallet } from "../src/controllers/ConnectWallet";
import { useToast, Tag, Link, Avatar ,Button , Box, Heading, Text,Grid, Flex ,Divider , Icon} from '@chakra-ui/react'
import svgAvatarGenerator from "../src/context/avatar";
import {BsArrowRight} from "react-icons/bs";

interface Props {}

const index = (props: Props) => {
  const toast = useToast()
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

  async function connectToWallett(){
    const providerEventsCB = async (_signer, _address, _network) => {
      if (_signer && _address && _network) {
        setSigner({ address: _address, signer: _signer, network: _network });
      } else {
        setSigner(undefined);
      }
    };

    connectToWallet(providerEventsCB).then(async (_signer) => {
      if (_signer) {
        console.log(_signer)
        const _address = await _signer.getAddress();
        const _network = window.ethereum.networkVersion
        console.log(_network)
        setAdd(_address);
        _address &&
          toast({
            title: 'Yeah, Wallet Connected !',
            status: 'success',
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
      })
    } else {
      toast({
        title: "Wallet Not Connected !",
        description: "Please connect your wallet first.",
        status: "error",
        duration: 5000,
        isClosable: false,
        position: "top",
      })
    }
  }
  return (
    <>
      <Box m="0" p="1em" position="relative" top="0" w="100%" h="100%" bg="#77787A">
        <Box mx="auto" bg="whitesmoke" rounded="10px">
          <Box h="95vh" className="m-bg">
            <Flex justifyContent="space-between" mx="3em" py="1.5em" alignItems="center">
              <Box>
                <Heading fontFamily="Philosopher">DeBooki</Heading>
                <Text fontFamily="Philosopher">A Metaverse NFTs Book Library</Text>
              </Box>
              <Box>
                {
                  add ? (
                    <Tag 
                      boxShadow="rgba(100, 100, 111, 0.4) 0px 7px 29px 0px" 
                      py="0.5em" bg="rgb(1, 119, 255,0.3)"
                      rounded="30px"
                      fontFamily="Montserrat"
                    >
                      <Avatar mr="5px" size="xs" src={avatar} />
                      {add.substr(0, 6)}...{add.substr(-4)}
                    </Tag>
                  ) : (
                    <Button 
                      boxShadow="rgba(100, 100, 111, 0.4) 0px 7px 29px 0px" 
                      rounded="20px" 
                      p="1.2em" 
                      bg="#0177FF" 
                      color="white" 
                      _hover={{
                        bg: "#0177FF", 
                        top: "-2px", 
                        boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px"
                      }} 
                      fontFamily="Montserrat"
                      onClick={connectToWallett}
                    >
                      Connect Wallet
                    </Button>
                  )
                }
              </Box>
            </Flex>
            <Divider/>
            <Flex mx="7.5%" py="1.5em" justifyContent="space-between" alignItems="center">
              <Box>
                <Heading className="h-shadow" fontSize="5em" fontFamily="Montserrat">Get Your New</Heading>
                <Heading className="h-shadow" pt="0.1em" fontSize="5em" fontFamily="Montserrat">NFT Book</Heading>
                <Heading className="h-shadow" pt="0.1em" fontSize="5em" fontFamily="Montserrat">Collection</Heading>
                <Text fontSize="20px" my="1em" ml="8px" fontFamily="Montserrat">
                  Discover, Collect and Sell An Extraodinary Books NFTs
                </Text>
                <Button 
                  mt="5px"
                  boxShadow="rgba(100, 100, 111, 0.4) 0px 7px 29px 0px" 
                  rounded="30px" 
                  p="1.5em" 
                  bg="#0177FF" 
                  color="white" 
                  _hover={{
                    bg: "#0177FF", 
                    right: "-2px", 
                    boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px"
                  }}
                  rightIcon={<BsArrowRight/>}
                  onClick={nextToShelf}
                  fontFamily="Montserrat"
                >
                  Explore Now
                </Button>
              </Box>
              <Image unoptimized src={"/book.png"} height={580} width={550} />
            </Flex>
          </Box>

          <Box my="10em" align="center">
            <Heading fontSize="3em" fontFamily="Montserrat">Our Features</Heading> 
            <Grid mt="3em" mx="7.5%" templateColumns='repeat(3, 1fr)' gap={6} alignItems="center" justifyContent="center" fontSize="1.5em" fontFamily="Montserrat">
              <Flex w="400px" alignItems="center" py="2em" px="1em" rounded="10px" bg="rgb(224, 224, 224)" justifyContent="center">
                <Box flex="2" align="left">
                  <Heading
                    fontSize="1.1em"
                    fontFamily="Montserrat"
                    fontWeight="500"
                  >
                    Rent
                  </Heading>
                  <Text mt="15px" fontSize="0.7em">Rent Your Favorite NFT Collection</Text>
                </Box>
                <Image unoptimized src={"/m2-1.png"} height={130} width={130} />
              </Flex>
              <Flex w="400px" alignItems="center" py="2em" px="1em" rounded="10px" bg="rgb(224, 224, 224)" justifyContent="center">
                <Box flex="2" align="left">
                  <Heading
                    fontSize="1.1em"
                    fontFamily="Montserrat"
                    fontWeight="500"
                  >
                    Exchange
                  </Heading>
                  <Text mt="15px" fontSize="0.7em">Exchange Your NFT Collection With Community</Text>
                </Box>
                <Image unoptimized src={"/m2-3.png"} height={130} width={130} />
              </Flex>
              <Flex 
                w="400px" 
                alignItems="center" 
                py="2em" 
                px="1em" 
                rounded="10px" 
                bg="rgb(224, 224, 224)" 
                justifyContent="center"
              >
                <Box flex="2" align="left">
                  <Heading
                    fontSize="1.1em"
                    fontFamily="Montserrat"
                    fontWeight="500"
                  >
                    Sell
                  </Heading>
                  <Text mt="15px" fontSize="0.7em">Sell Your NFT Collection Easily</Text>
                </Box>
                <Image unoptimized src={"/m2-2.png"} height={130} width={130} />
              </Flex>
            </Grid>
          </Box>

          <Box align="center">
            <Flex 
              mt="3em" 
              mx="7.5%" 
              p="1em"
              py="1em"
              rounded="10px"
              justifyContent="space-around"
              flexDir="column"
            >
              <Heading className="h-shadow" fontSize="3em" fontFamily="Montserrat">In Order to Succeed, You Must Read.</Heading>
              <Box mt="2em">
                <Text fontFamily="Montserrat">Start Your Own Collection Now!</Text>
                <Button 
                  mt="20px"
                  boxShadow="rgba(100, 100, 111, 0.4) 0px 7px 29px 0px" 
                  rounded="30px" 
                  p="1.5em" 
                  bg="#0177FF" 
                  color="white" 
                  _hover={{
                    bg: "#0177FF", 
                    right: "-2px", 
                    boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px"
                  }}
                  rightIcon={<BsArrowRight/>}
                  onClick={nextToShelf}
                  fontFamily="Montserrat"
                >
                  Explore Now
                </Button>
              </Box>
            </Flex>
          </Box>

          <Flex 
            fontFamily="Montserrat" 
            bg="rgb(190,190,190)" 
            mt="10em"
            px="15%"
            py="1em" 
            alignItems="center"
            borderBottomRadius="10px"
            justifyContent="space-around"
          >
            <Link href="https://nfthack.ethglobal.co/" isExternal>
              <Text>Build In NFT HACK 2022 - ETH GLOBAL</Text>
            </Link>
            <Divider orientation="vertical" height="30px" />
            <Text>Build and Designed By <Link href="https://lakshaymaini.ml/" isExternal>Lakshay Maini</Link></Text>
          </Flex>
        </Box>
      </Box>
    </>
  );
};

export default index;
