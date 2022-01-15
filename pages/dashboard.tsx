import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import Image from "next/image";
import BookCard from "../src/components/common/BookCard";
import {
  getRecentLaunches,
  getBestSellers,
} from "../src/controllers/StorageStructures";
import { useLoadingContext } from "../src/context/Loading";
import { useSignerContext } from "../src/context/Signer";
import {
  Box,
  Flex,
  Heading,
  Text,
  Button,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Tag,
  Avatar,
  Wrap,
  WrapItem,
  Link
} from "@chakra-ui/react";
import { AiOutlinePlus, AiFillHome } from "react-icons/ai"
import { CgArrowsExchange } from "react-icons/cg";
import { GiBookshelf } from "react-icons/gi"
import { MdOutlineCollectionsBookmark } from "react-icons/md"
import svgAvatarGenerator from "../src/context/avatar";
import { getAuthorsDesk } from "../src/controllers/StorageStructures";
import BookPublishedDeskCard from "../src/components/common/BookPublishedDeskCard";
import { useRouter } from "next/router"
// import Exchange from "./dashboard/exchange";
import Shelf from "./dashboard/shelf";

interface Props {
  selected: 1 | 2 | 3;
  setSelected: Dispatch<SetStateAction<1 | 2 | 3>>;
}

const Home = ({ selected, setSelected }: Props) => {
  const router = useRouter();
  const [recentBooks, setRecentBooks] = useState<any>([]);
  const [bestSellerBooks, setBestSellerBooks] = useState<any>([]);
  const [avatar, setAvatar] = useState(undefined);
  const [add, setAdd] = useState(undefined);
  const { setLoading } = useLoadingContext();
  const { signer, network} = useSignerContext();
  const [booksPublishedInDesk, setBooksPublishedInDesk] = useState<any>([]);
  const [selectedIndex, setSelectedIndex] = useState(1);
  const [exchangeData, setExchangeData] = useState<string>("");
  const [buyState, setBuyState] = useState<boolean>(true);

  useEffect(() => {
    if (router.query.selected) {
      setSelectedIndex(3);
      router.query.data && setExchangeData(router.query.data as string);
      router.query.buyState === "false" && setBuyState(false);
    }
    console.log(router.query.selected);
  }, [])

  useEffect(() => {
    setBooksPublishedInDesk([]);
    getAuthorsDesk(signer.signer, signer.address)
      .then((authorsDesk) => {
        setBooksPublishedInDesk(authorsDesk);
      })
      .then(() => {
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      });
    return () => {
      setLoading(true);
    };
  }, [signer]);

  useEffect(() => {
    router.prefetch(`/dashboard/newbook`);
    signer &&
      getRecentLaunches(signer.signer).then(
        async (recentLaunchesMetadataURIs) => {
          setRecentBooks(recentLaunchesMetadataURIs);
          getBestSellers(signer.signer)
            .then(async (bestSellersMetadataURIs) => {
              setBestSellerBooks(bestSellersMetadataURIs);
            })
            .then(() => {
              setTimeout(() => {
                setLoading(false);
              }, 1000);
            });
        }
      );
      console.log(network);
      setAdd(signer.address);
      let svg = svgAvatarGenerator(add, { dataUri: true });
      setAvatar(svg);
    return () => {
      setLoading(true);
    };
  }, [signer, network]);

  return (
    <Box m="0px" p="1.5em" position="relative" top="0" h="100vh" bg="rgb(200, 200, 200)">
      <Tabs variant="solid-rounded" orientation="vertical" defaultIndex={1}>
        <TabList pl="0em" pr="1em" m="1em">
          <Flex mb="10em" mt="1em" alignItems="center" justifyContent="center">
            <Link href="/">
              <Heading className="h-shadow" fontFamily="Philosopher" color="black">DeBooki</Heading>
            </Link>
          </Flex>
          <Tab display="none"></Tab>
          <Tab 
            _selected={{bg: "#0177FF", color: "white"}} 
            _focus={{border: "none"}}
            mb="1em"
          >
            <Flex flexDirection="column" alignItems="center" justifyContent="center">
              <AiFillHome/>
              <Text fontFamily="Montserrat">Home</Text>
            </Flex>
          </Tab>
          <Tab 
            _selected={{bg: "#0177FF", color: "white"}} 
            _focus={{border: "none"}}
            mb="1em"
          >
            <Flex flexDirection="column" alignItems="center" justifyContent="center">
              <GiBookshelf/>
              <Text fontFamily="Montserrat">Shelf</Text>
            </Flex>
          </Tab>
          <Tab 
            _selected={{bg: "#0177FF", color: "white"}} 
            _focus={{border: "none"}}
            mb="1em"
            
          >
            <Flex flexDirection="column" alignItems="center" justifyContent="center">
              <CgArrowsExchange/>
              <Text fontFamily="Montserrat">Exchange</Text>
            </Flex>
          </Tab>
          <Tab 
            _selected={{bg: "#0177FF", color: "white"}} 
            _focus={{border: "none"}}
            mb="1em"
            mt="10em"
          >
            <Flex flexDirection="column" alignItems="center" justifyContent="center">
              <MdOutlineCollectionsBookmark/>
              <Text fontFamily="Montserrat">Desk</Text>
            </Flex>
          </Tab>
        </TabList>
        <TabPanels h="94vh" pb="0.5em" rounded="40px" bg="whitesmoke" overflow="scroll">
          <Box mb="1em">
            <Box position="fixed" right="0" zIndex="999" align="right" p="1.2em" mr="2em" mt="0.5em">
              <Button 
                boxShadow="rgba(100, 100, 111, 0.4) 0px 7px 29px 0px" 
                rounded="20px" 
                p="1.2em" 
                mr="1em"
                bg="#0177FF" 
                color="white" 
                _hover={{
                  bg: "#0177FF", 
                  top: "-2px", 
                  boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px"
                }}
                fontFamily="Montserrat"
                leftIcon={<AiOutlinePlus/>}
                onClick={()=>{router.push("/dashboard/newbook")}}
              >
                New Book
              </Button>
              {
                add && 
                <Tag 
                  boxShadow="rgba(100, 100, 111, 0.4) 0px 7px 29px 0px" 
                  py="0.5em" bg="rgb(1, 119, 255,0.3)"
                  rounded="30px"
                  fontFamily="Montserrat"
                >
                  
                  <Avatar mr="5px" size="xs" src={avatar} />
                  {add.substr(0, 6)}...{add.substr(-4)}
                </Tag> 
              }
            </Box>
          </Box>

          <TabPanel mx="1.5em">
            <Box mt="4em">
              <Heading fontSize="24px" fontFamily="Montserrat">Recent Launches</Heading>
              <Box my="1.5em" overflow="hidden">
                <Wrap spacing="10px">
                  {recentBooks.map((book, index) => {
                    return (
                      <WrapItem key={index} overflow="hidden">
                        <BookCard key={index} book_metadata_uri={book} />
                      </WrapItem>
                    );
                  })}
                </Wrap>
              </Box>

              <Heading mt="2em" fontSize="24px" fontFamily="Montserrat">Best Sellers</Heading>
              <Box mt="1.5em" overflow="hidden">
                <Wrap spacing="20px">
                  {bestSellerBooks.map((book, index) => {
                    return (
                      <WrapItem key={index} overflow="hidden">
                        <BookCard key={index} book_metadata_uri={book} />
                      </WrapItem>
                    );
                  })}
                </Wrap>
              </Box>
            </Box>
          </TabPanel>

          <TabPanel>
            <Box mt="4em">
              <Shelf />
            </Box>
          </TabPanel>

          <TabPanel>
            <Box mt="4em">
              <Flex rounded="10px" bg="rgb(234, 234, 234)" p="2em" px="5em" justifyContent="center" flexDir="column" alignItems="center">
                <Image src={"/deal.png"} height={200} width={200}></Image>
                <Box align="center">
                  <Heading mt="1em" fontFamily="Montserrat">First NFTs Book Exchange</Heading>
                  <Text my="1em" fontFamily="Montserrat">Trustless, Peer-to-Peer network of readers to exchange books quickly and seamlessly. This platform is of you, for you and by you, no matter who you are, where you live and what you read...</Text>
                  <Text fontFamily="Montserrat">We redefined privacy</Text>
                </Box>
              </Flex>
              <Text fontFamily="Montserrat" p="1em" align="center">Select a Book NFT for Details</Text>
            </Box>
          </TabPanel>

          <TabPanel>
            <Box mt="4em">
              {booksPublishedInDesk.length 
                ?
                booksPublishedInDesk.map((_bookInDesk, index) => {
                  return (
                    <Box mb="1em" key={index}>
                      <BookPublishedDeskCard
                        bookMetadataURI={_bookInDesk.metadataURI}
                        key={index}
                      />
                    </Box>
                  );
                })
                :
                <Flex mt="9em" justifyContent="center" flexDir="column" alignItems="center">
                  <Image src={"/no-results.png"} height={180} width={180} />
                  <Heading fontSize="2em" pt="1em" fontFamily="Montserrat">Desk Is Empty</Heading>
                </Flex>
              }
            </Box>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default Home;
