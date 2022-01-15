import { Text,  Tabs,
    TabList,
    TabPanels,
    Tab,
    TabPanel,
    Tag,
    Box,
    Wrap,
    WrapItem, Heading, Flex } from '@chakra-ui/react';
import React, {useState, useEffect} from 'react'
import Image from 'next/image';
import { useLoadingContext } from "../../src/context/Loading";
import { useSignerContext } from "../../src/context/Signer";
import { getBooksInMyShelf } from "../../src/controllers/StorageStructures";
import { StatusTag } from "./bookpreview";
import BookOwnedInShelfCard from "../../src/components/common/BookOwnedInShelfCard";
import BookRentedInShelfCard from "../../src/components/common/BookRentedInShelfCard";
import StudentCopyBookInShelfCard from "../../src/components/common/StudentCopyBookInShelfCard";

const ReturnBookStatus = ({ statusCode }) => {
    return (
        <section className="flex justify-center fixed z-10 w-screen h-screen ">
        <div className="flex flex-col justify-center items-start">
            <StatusTag status={statusCode >= 1} tag="Sending transaction request" />
            <StatusTag status={statusCode >= 2} tag="Deleting Renting Flow" />
            <StatusTag
            status={statusCode >= 3}
            tag="Awaiting transaction success"
            />
        </div>
        </section>
    );
};

function shelf() {
    const { setLoading } = useLoadingContext();
    const { signer } = useSignerContext();
    const [tabSelected, setTabSelected] = useState<number>(1);
    const [booksOwnedInShelf, setBooksOwnedInShelf] = useState<any>([]);
    const [booksRentedInShelf, setBooksRentedInShelf] = useState<any>([]);
    const [studentBooksCopyInShelf, setStudentBooksCopyInShelf] = useState<any>(
      []
    );
    const [validReturnBookAttempt, setValidReturnBookAttempt] =
      useState<boolean>(false);
    const [renturnBookProgressStatus, setRenturnBookProgressStatus] =
      useState<number>(0);
  
    useEffect(() => {
      setBooksOwnedInShelf([]);
      setStudentBooksCopyInShelf([]);
      setBooksRentedInShelf([]);
      getBooksInMyShelf(signer.signer, signer.address)
        .then((_booksInShelf) => {
          _booksInShelf.map((_book) => {
            if (
              _book.status == 0 ||
              _book.status == 1 ||
              _book.status == 3 ||
              _book.status == 4
            ) {
              setBooksOwnedInShelf((state) => {
                return [...state, _book];
              });
            } else if (_book.status == 5) {
              setBooksRentedInShelf((state) => {
                return [...state, _book];
              });
            } else if (_book.eBookID == 0) {
              setStudentBooksCopyInShelf((state) => {
                return [...state, _book];
              });
            }
          });
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
  
    const setRenturnBookProgressStatusCB = (statusCode) => {
      switch (statusCode) {
        case 1:
          setRenturnBookProgressStatus(1);
          break;
        case 2:
          setRenturnBookProgressStatus(2);
          break;
        case 3:
          setRenturnBookProgressStatus(3);
          break;
        default:
          setRenturnBookProgressStatus(0);
          break;
      }
    };
  
    return (
        <>
            {validReturnBookAttempt && (
                <ReturnBookStatus statusCode={renturnBookProgressStatus} />
            )}
            <Tabs isFitted variant="enclosed">
                <TabList fontFamily="Montserrat">
                    <Tab 
                        _selected={{bg:"rgb(234, 234, 234)"}} 
                        _focus={{border: "none"}}
                    >
                        Owned {booksOwnedInShelf.length > 0 && `(${booksOwnedInShelf.length})`}
                    </Tab>
                    <Tab 
                        _selected={{bg:"rgb(234, 234, 234)"}} 
                        _focus={{border: "none"}}
                    >
                        Rented {booksRentedInShelf.length > 0 && `(${booksRentedInShelf.length})`}
                    </Tab>
                    <Tab 
                        _selected={{bg:"rgb(234, 234, 234)"}} 
                        _focus={{border: "none"}}
                    >
                        Distributed Copy {studentBooksCopyInShelf.length > 0 && `(${studentBooksCopyInShelf.length})`}
                    </Tab>

                </TabList>
                <TabPanels fontFamily="Montserrat" pt="1rem" h="70vh" overflow="scroll" bg="rgb(234, 234, 234)">
                    <TabPanel >
                        {booksOwnedInShelf.length > 0 ? 
                            <Wrap>
                                {console.log(booksOwnedInShelf)}
                                {booksOwnedInShelf.map((_bookInShelf, index) => {
                                    return (
                                        <WrapItem>
                                            <BookOwnedInShelfCard
                                                bookMetadataURI={_bookInShelf.metadataURI}
                                                status={_bookInShelf.status}
                                                key={index}
                                            />
                                        </WrapItem>
                                    );
                                })}
                            </Wrap>
                        : 
                             <Flex mt="9em" justifyContent="center" flexDir="column" alignItems="center">
                                <Image unoptimized src={"/no-results.png"} height={180} width={180} />
                                <Heading fontSize="2em" pt="1em" fontFamily="Montserrat">Shelf Is Empty</Heading>
                            </Flex> 
                        }
                    </TabPanel>
                    <TabPanel >
                        {booksRentedInShelf.length > 0 ? 
                            <Wrap>
                                {console.log(booksRentedInShelf)}
                                {booksRentedInShelf.map((_bookInShelf, index) => {
                                    return (
                                        <WrapItem>
                                            <BookRentedInShelfCard
                                                bookMetadataURI={_bookInShelf.metadataURI}
                                                key={index}
                                                cb={setRenturnBookProgressStatusCB}
                                            />
                                        </WrapItem>
                                    );
                                })}
                            </Wrap>
                        : 
                             <Flex mt="9em" justifyContent="center" flexDir="column" alignItems="center">
                                <Image unoptimized src={"/no-results.png"} height={180} width={180} />
                                <Heading fontSize="2em" pt="1em" fontFamily="Montserrat">Shelf Is Empty</Heading>
                            </Flex> 
                        }
                    </TabPanel>
                    <TabPanel >
                        {studentBooksCopyInShelf.length > 0 ? 
                            <Wrap>
                                {console.log(studentBooksCopyInShelf)}
                                {studentBooksCopyInShelf.map((_bookInShelf, index) => {
                                    return (
                                        <WrapItem>
                                            <StudentCopyBookInShelfCard
                                                bookMetadataURI={_bookInShelf.metadataURI}
                                                key={index}
                                            />
                                        </WrapItem>
                                    );
                                })}
                            </Wrap>
                        : 
                             <Flex mt="9em" justifyContent="center" flexDir="column" alignItems="center">
                                <Image unoptimized src={"/no-results.png"} height={180} width={180} />
                                <Heading fontSize="2em" pt="1em" fontFamily="Montserrat">Shelf Is Empty</Heading>
                            </Flex> 
                        }
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </>
    )
}

export default shelf
