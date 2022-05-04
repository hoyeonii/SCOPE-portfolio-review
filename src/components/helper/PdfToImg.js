import React, { useState, useEffect } from "react";
import { db } from "../../firebaseConfig";

// import { PDFtoIMG } from "react-pdf-to-image";
import file1 from "../../samplePDF2.pdf";
import { Document, Page } from "react-pdf/dist/esm/entry.webpack";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
function PdfToImg() {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [file, setFile] = useState("");

  useEffect(() => {
    const portfolioRef = collection(db, "Portfolio");
    // setByField(filteredField); ////////여기 지워봐ㅏ
    const q = query(
      portfolioRef,
      where("description", "==", "222222"),
      orderBy("createDate", "desc")
    );
    onSnapshot(q, (snapshot) => {
      const portfolio = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setFile(portfolio[0].imageUrl);

      //   setPortfolios(portfolio);
      //   console.log("sorted by field" + byField);
    });
  }, []);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    setPageNumber(1);
  }

  function changePage(offSet) {
    setPageNumber((prevPageNumber) => prevPageNumber + offSet);
  }

  function changePageBack() {
    changePage(-1);
  }

  function changePageNext() {
    changePage(+1);
  }

  return (
    <div>
      {/* <PDFtoIMG file={file}>
        {({ pages }) => {
          console.log(file, pages);
          if (!pages.length) return "Loading...왜 안돼";
          return pages.map((page, index) => <img key={index} src={page} />);
        }}
      </PDFtoIMG> */}
      <header className="App-header">
        <Document file={file} onLoadSuccess={onDocumentLoadSuccess}>
          <Page height={400} pageNumber={pageNumber} />
        </Document>
        <p>
          Page {pageNumber} of {numPages}
        </p>
        {pageNumber > 1 && (
          <button onClick={changePageBack}>Previous Page</button>
        )}
        {pageNumber < numPages && (
          <button onClick={changePageNext}>Next Page</button>
        )}
      </header>
      <center>
        {/* <div>
          <Document file={file1} onLoadSuccess={onDocumentLoadSuccess}>
            {Array.from(new Array(numPages), (el, index) => (
              <Page key={`page_${index + 1}`} pageNumber={index + 1} />
            ))}
          </Document>
        </div>
        <div>{file}</div> */}
      </center>
    </div>
  );
}
export default PdfToImg;
