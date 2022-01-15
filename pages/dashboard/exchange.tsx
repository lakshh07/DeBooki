import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useLoadingContext } from "../../src/context/Loading";
import Image from "next/image";
import PreviewBookCoverPage from "../../src/components/common/PreviewBookCoverPage";
import { eBook } from "../../src/controllers/eBookMarketLaunch";
import {
  placeBuyOrder,
  placeSellOrder,
} from "../../src/controllers/eBookExchange";
import {
  getBookBuyersCount,
  getBookSellersCount,
} from "../../src/controllers/StorageStructures";
import { useSignerContext } from "../../src/context/Signer";
import { CheckCircleIcon } from "@heroicons/react/solid";
import LoadingCircle from "../../src/components/common/LoadingCircle";
interface Props {
  selected: 1 | 2 | 3;
  setSelected: Dispatch<SetStateAction<1 | 2 | 3>>;
  exchangeData: string;
  initialBuyState: boolean;
}
import svgAvatarGenerator from "../../src/context/avatar";
import { Box, Text, Flex, Heading, Tag, Avatar, Divider, Grid,Tabs, TabList, TabPanels, Tab, TabPanel,Table,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
Button, 
useToast
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { BsArrowLeft } from "react-icons/bs"

const OrderStatusTag = ({ status, tag }) => {
  return (
    <div className="flex flex-row justify-center items-center space-x-10 text-gray-700">
      {status ? (
        <div className="flex justify-center items-center h-20 w-20">
          <CheckCircleIcon className="h-12 w-12" />
        </div>
      ) : (
        <LoadingCircle />
      )}
      <span className="text-2xl font-semibold text-center align-middle">
        {tag}
      </span>
    </div>
  );
};

const BuyOrderStatus = ({ statusCode }) => {
  return (
    <section className="flex justify-center fixed z-10 w-screen h-screen ">
      <div className="flex flex-col justify-center items-start">
        <OrderStatusTag
          status={statusCode >= 1}
          tag="Sending transaction request"
        />
        <OrderStatusTag
          status={statusCode >= 2}
          tag="Awaiting payment success"
        />
        <OrderStatusTag
          status={statusCode >= 3}
          tag="Awaiting transaction success"
        />
      </div>
    </section>
  );
};

const SellOrderStatus = ({ statusCode }) => {
  return (
    <section className="flex justify-center fixed z-10 w-screen h-screen ">
      <div className="flex flex-col justify-center items-start">
        <OrderStatusTag
          status={statusCode >= 1}
          tag="Sending transaction request"
        />
        <OrderStatusTag
          status={statusCode >= 2}
          tag="Awaiting transaction success"
        />
      </div>
    </section>
  );
};

const Exchange = () => {
  const toast = useToast()
  const router = useRouter();
  const [buyStatee, setBuyStatee] = useState<boolean>(true);
  const { setLoading } = useLoadingContext();
  const [buyState, setBuyState] = useState<boolean>(buyStatee);
  const [selectedBook, setSelectedBook] = useState<eBook>();
  const [buyers, setBuyers] = useState<number>(0);
  const [sellers, setSellers] = useState<number>(0);
  const [avatar, setAvatar] = useState(undefined);
  const { signer } = useSignerContext();
  const [add , setAdd] = useState(undefined);
  const [validBuyOrderPlaced, setValidBuyOrderPlaced] =
    useState<boolean>(false);
  const [buyOrderProgressStatus, setBuyOrderProgressStatus] =
    useState<number>(0);
  const [validSellOrderPlaced, setValidSellOrderPlaced] =
    useState<boolean>(false);
  const [sellOrderProgressStatus, setSellOrderProgressStatus] =
    useState<number>(0);
  const [exchangeData, setExchangeData] = useState<string>("");

  useEffect(() => {
    if (router.query.data) {
      setLoading(false);
      setExchangeData(router.query.data as string);
      router.query.buyState === "false" && setBuyStatee(false);
    }

    signer && setAdd(signer.address);
    let svg = svgAvatarGenerator(add, { dataUri: true });
    setAvatar(svg);
    console.log(router.query.selected);
  }, [])

  const setBuyOrderProgressStatusCB = (statusCode) => {
    switch (statusCode) {
      case 1:
        setBuyOrderProgressStatus(1);
        break;
      case 2:
        setBuyOrderProgressStatus(2);
        break;
      case 3:
        setBuyOrderProgressStatus(3);
        break;
      default:
        setBuyOrderProgressStatus(0);
        break;
    }
  };

  const setSellOrderProgressStatusCB = (statusCode) => {
    switch (statusCode) {
      case 1:
        setBuyOrderProgressStatus(1);
        break;
      case 2:
        setBuyOrderProgressStatus(2);
        break;
      default:
        setBuyOrderProgressStatus(0);
        break;
    }
  };

  useEffect(() => {
    if (router.query.data) {
      console.log(router.query.data)
      setLoading(false);
      setSelectedBook(JSON.parse(router.query.data as string));
      console.log(selectedBook);
      router.query.buyState === "false" && setBuyStatee(false);
    }

    return () => {
      setLoading(true);
    };
  }, []);

  useEffect(() => {
    selectedBook &&
      getBookBuyersCount(selectedBook.book_id, signer.signer).then((count) => {
        setBuyers(count);
      });
    selectedBook &&
      getBookSellersCount(selectedBook.book_id, signer.signer).then((count) => {
        setSellers(count);
      });
  }, [selectedBook]);

  return (
    <>
      {validBuyOrderPlaced && (
        <BuyOrderStatus statusCode={buyOrderProgressStatus} />
      )}
      {validSellOrderPlaced && (
        <SellOrderStatus statusCode={sellOrderProgressStatus} />
      )}
      <div
        className={`${
          (validBuyOrderPlaced || validSellOrderPlaced) &&
          "filter blur-xl bg-gray-100"
        }`}
      >
        <Box w="100%" m="0" p="1em" h="100vh" bg="rgb(200, 200, 200)">
          <Box bg="whitesmoke" rounded="10px" h="96vh">
            <Flex mx="3em" py="1.5em" alignItems="center" justifyContent="space-between">
              <Flex alignItems="center">
                <BsArrowLeft cursor="pointer" onClick={()=>router.back()}/>
                <Box ml="2em">
                  <Heading fontFamily="Philosopher">DeBooki</Heading>
                  <Text fontFamily="Philosopher">A Metaverse NFTs Book Library</Text>
                </Box>
              </Flex>
              {add && 
              <Tag 
                boxShadow="rgba(100, 100, 111, 0.4) 0px 7px 29px 0px" 
                py="0.5em" bg="rgb(1, 119, 255,0.3)"
                rounded="30px"
                fontFamily="Montserrat"
              >
                <Avatar mr="5px" size="xs" src={avatar}/>
                {add.substr(0, 6)}...{add.substr(-4)}
              </Tag>}
            </Flex>
            <Divider/>
            {selectedBook ? <Box mx="2em" mt="2em">
              <Grid templateColumns="repeat(2, 1fr)" align="center" gap="2em">
                <Box w="max-content" boxShadow="rgba(0, 0, 0, 0.4) 0px 5px 15px" mx="auto" align="center">
                  <Image src={selectedBook.ebook_cover_image} height={550} width={450} />
                </Box>
                <Box>
                  <Tabs fontFamily="Montserrat" variant='soft-rounded' isFitted colorScheme='green'>
                    <TabList>
                      <Tab 
                        _selected={{bg: "green.200"}} 
                        _focus={{border: "none"}} 
                        onClick={() => {
                          setBuyState(true);
                        }}
                      >
                        Buy
                      </Tab>
                      <Tab 
                        _selected={{bg: "red.200"}} 
                        _focus={{border: "none"}}
                        onClick={() => {
                          setBuyState(false);
                        }}
                      >
                        Sell
                      </Tab>
                    </TabList>
                    <TabPanels mt="1em">
                      <TabPanel>
                        <Box bg="red.100" p="1em" rounded="10px" align="center">
                          <Heading fontFamily="Montserrat" fontSize="1.2em">Total Sell Orders</Heading>
                          <Box px="2em" py="1.8em" mt="1em"  w="max-content" rounded="15px" bg="red.200">
                            <Text>{sellers}</Text>
                          </Box>
                        </Box>
                        <Box mt="1em" p="1em" bg="green.100" rounded="10px">
                          <Table variant='simple'>
                            <Tbody>
                              <Tr>
                                <Td>Seller Receives</Td>
                                <Td isNumeric>{(selectedBook.launch_price * 0.8).toFixed(3)} {selectedBook.currency}</Td>
                              </Tr>
                              <Tr>
                                <Td>Author Receives (20%)</Td>
                                <Td isNumeric>{(selectedBook.launch_price * 0.2).toFixed(3)} {selectedBook.currency}</Td>
                              </Tr>
                            </Tbody>
                            <Tfoot>
                              <Tr>
                                <Th>Total Payment</Th>
                                <Th isNumeric>{selectedBook.launch_price} {selectedBook.currency}</Th>
                              </Tr>
                            </Tfoot>
                          </Table>
                          <Button 
                            p="1.5em" 
                            fontFamily="Montserrat" 
                            my="1em" 
                            rounded="30px" 
                            colorScheme="green"
                            onClick={async () => {
                              setValidBuyOrderPlaced(true);
                              await placeBuyOrder(
                                signer.signer,
                                selectedBook.launch_price,
                                selectedBook.book_id,
                                setBuyOrderProgressStatusCB
                              );
                              toast({
                                title: 'Yeah, Buy Order Placed !',
                                status: 'success',
                                duration: 5000,
                                isClosable: false,
                                position: "top",
                              });
                              setLoading(true);
                              setSelectedBook(undefined);
                              setValidBuyOrderPlaced(false);
                              router.push("/dashboard");
                            }}
                          >
                            Place Buy Order
                          </Button>
                        </Box>
                      </TabPanel>
                      <TabPanel>
                        <Box bg="green.100" p="1em" rounded="10px" align="center">
                          <Heading fontFamily="Montserrat" fontSize="1.2em">Total Buy Orders</Heading>
                          <Box px="2em" py="1.8em" mt="1em"  w="max-content" rounded="15px" bg="green.200">
                            <Text>{buyers}</Text>
                          </Box>
                        </Box>
                        <Box mt="1em" p="1em" bg="red.100" rounded="10px">
                          <Table variant='simple'>
                            <Tbody>
                              <Tr>
                                <Td>Buyer Pays</Td>
                                <Td isNumeric>{selectedBook.launch_price} {selectedBook.currency}</Td>
                              </Tr>
                              <Tr>
                                <Td>Author Receives (20%)</Td>
                                <Td isNumeric>{(selectedBook.launch_price * 0.2).toFixed(3)} {selectedBook.currency}</Td>
                              </Tr>
                            </Tbody>
                            <Tfoot>
                              <Tr>
                                <Th>Total Received</Th>
                                <Th isNumeric>{(selectedBook.launch_price * 0.8).toFixed(3)} {selectedBook.currency}</Th>
                              </Tr>
                            </Tfoot>
                          </Table>
                          <Button
                            p="1.5em" 
                            fontFamily="Montserrat" 
                            my="1em" 
                            rounded="30px" 
                            colorScheme="red"
                            onClick={async () => {
                              setValidSellOrderPlaced(true);
                              await placeSellOrder(
                                signer.signer,
                                selectedBook.book_id
                              );
                              toast({
                                title: 'Yeah, Sell Order Placed !',
                                status: 'success',
                                duration: 5000,
                                isClosable: false,
                                position: "top",
                              });
                              setLoading(true);
                              setSelectedBook(undefined);
                              setValidSellOrderPlaced(false);
                              setSellOrderProgressStatusCB
                              router.push("/dashboard");
                            }}
                          >
                            Place Sell Order
                          </Button>
                        </Box>
                      </TabPanel>
                    </TabPanels>
                  </Tabs>
                </Box>
              </Grid>
            </Box> :
            
            <Heading>Oops! Something went wrong</Heading>

            }
          </Box>
        </Box>
        {/* {selectedBook 
          ? 
            <div className="">
              <PreviewBookCoverPage
                src={selectedBook.ebook_cover_image}
              />
              {sellers}

              <Image src={selectedBook.ebook_cover_image} height={100} width={100} />
             </div>
          :
            <Text p="1em" align="center" fontFamily="Montserrat">Please Select Book NFT For Details</Text>
        }
          <div className="h-full pb-10">
            <div className="flex flex-row justify-center h-full relative">
              {selectedBook && (
                <div className="bg-white border border-gray-300 w-1/4 h-full absolute right-5 rounded-tr-xl overflow-hidden">
                  <div className="w-full h-full flex flex-col">
                    <div className="flex justify-center w-full h-2/5">
                      <div
                        className={
                          buyState
                            ? "flex-1 border-t-4 border-red-500 py-5 bg-red-50"
                            : "flex-1 border-t-4 border-green-500 py-5 bg-green-50"
                        }
                      >
                        {buyState ? (
                          <div className="flex flex-col justify-center items-center">
                            <div className="font-semibold text-lg pt-7 pb-5">
                              Total Sell Orders
                            </div>
                            <div className="flex w-28 h-28 rounded-md justify-center items-center text-3xl bg-red-300">
                              {sellers}
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col justify-center items-center">
                            <div className="font-semibold text-lg  pt-7 pb-5">
                              Total Buy Orders
                            </div>
                            <div className="flex w-28 h-28 rounded-md justify-center items-center text-3xl bg-green-300">
                              {buyers}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="w-full h-3/5">
                      <div className="flex">
                        <a
                          className={
                            buyState
                              ? "flex-1 border-t-4 border-green-500 font-semibold text-lg text-center py-1 bg-green-50"
                              : "flex-1 border-b border-r border-gray-300 font-semibold text-lg text-center pt-2 pb-1 cursor-pointer"
                          }
                          onClick={() => {
                            setBuyState(true);
                          }}
                        >
                          Buy
                        </a>
                        <a
                          className={
                            buyState
                              ? "flex-1 border-b border-l border-gray-300 font-semibold text-lg text-center pt-2 pb-1 cursor-pointer"
                              : "flex-1 border-t-4 border-red-500 font-semibold text-lg text-center py-1 bg-red-50"
                          }
                          onClick={() => {
                            setBuyState(false);
                          }}
                        >
                          Sell
                        </a>
                      </div>
                      {buyState ? (
                        <div className="w-full h-full bg-green-50">
                          <div className="flex flex-col justify-center w-full h-full px-16 text-lg font-semibold space-y-16 pb-10">
                            <div className="flex flex-col justify-center space-y-6 divide-y-2 divide-gray-400">
                              <div>
                                <p className="flex justify-between">
                                  <span>Seller Receives</span>
                                  <div className="flex space-x-2">
                                    <p className="text-right">
                                      {(
                                        selectedBook.launch_price * 0.8
                                      ).toFixed(3)}
                                    </p>
                                    <p className="text-xs font-bold align-top">
                                      {selectedBook.currency}
                                    </p>
                                  </div>
                                </p>
                                <p className="flex justify-between">
                                  <span>Author Receives (20%)</span>
                                  <div className="flex space-x-2">
                                    <p className="text-right">
                                      {(
                                        selectedBook.launch_price * 0.2
                                      ).toFixed(3)}
                                    </p>
                                    <p className="text-xs font-bold align-top">
                                      {selectedBook.currency}
                                    </p>
                                  </div>
                                </p>
                              </div>
                              <div>
                                <p className="flex justify-between py-2">
                                  <span>Total Payment</span>
                                  <div className="flex space-x-2">
                                    <p className="text-right">
                                      {selectedBook.launch_price}
                                    </p>
                                    <p className="text-xs font-bold align-top">
                                      {selectedBook.currency}
                                    </p>
                                  </div>
                                </p>
                              </div>
                            </div>
                            <button
                              className="btn btn-accent"
                              onClick={async () => {
                                setValidBuyOrderPlaced(true);
                                await placeBuyOrder(
                                  signer.signer,
                                  selectedBook.launch_price,
                                  selectedBook.book_id,
                                  setBuyOrderProgressStatusCB
                                );
                                setSelectedBook(undefined);
                                setValidBuyOrderPlaced(false);
                              }}
                            >
                              Place Buy Order
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="w-full h-full bg-red-50">
                          <div className="flex flex-col justify-center w-full h-full px-16 text-lg font-semibold space-y-16 pb-10">
                            <div className="flex flex-col justify-center space-y-6 divide-y-2 divide-gray-400">
                              <div>
                                <p className="flex justify-between">
                                  <span>Buyer Pays</span>
                                  <div className="flex space-x-2">
                                    <p className="text-right">
                                      {selectedBook.launch_price}
                                    </p>
                                    <p className="text-xs font-bold align-top">
                                      {selectedBook.currency}
                                    </p>
                                  </div>
                                </p>
                                <p className="flex justify-between">
                                  <span>Author Receives (20%)</span>
                                  <div className="flex space-x-2">
                                    <p className="text-right">
                                      {(
                                        selectedBook.launch_price * 0.2
                                      ).toFixed(3)}
                                    </p>
                                    <p className="text-xs font-bold align-top">
                                      {selectedBook.currency}
                                    </p>
                                  </div>
                                </p>
                              </div>
                              <div>
                                <p className="flex justify-between py-2">
                                  <span>Total Received</span>
                                  <div className="flex space-x-2">
                                    <p className="text-right">
                                      {(
                                        selectedBook.launch_price * 0.8
                                      ).toFixed(3)}
                                    </p>
                                    <p className="text-xs font-bold align-top">
                                      {selectedBook.currency}
                                    </p>
                                  </div>
                                </p>
                              </div>
                            </div>
                            <button
                              className="btn btn-error"
                              onClick={async () => {
                                setValidSellOrderPlaced(true);
                                await placeSellOrder(
                                  signer.signer,
                                  selectedBook.book_id
                                );
                                setSelectedBook(undefined);
                                setValidSellOrderPlaced(false);
                                setSellOrderProgressStatusCB
                              }}
                            >
                              Place Sell Order
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div> */}
      </div>
    </>
  );
};

export default Exchange;
