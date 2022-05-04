import React, { useCallback, useRef } from "react";
import { toPng } from "html-to-image";

const ViewThumbnail = () => {
  const ref = useRef(null);

  const onButtonClick = useCallback(() => {
    if (ref.current === null) {
      return;
    }

    toPng(ref.current, { cacheBust: true })
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.download = "my-image-name.png";
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => {
        console.log(err);
      });
  }, [ref]);

  return (
    <>
      <div ref={ref} style={{ width: "200px", height: "150px" }}>
        <img
          src="https://cdn.pixabay.com/photo/2017/11/10/05/24/add-2935429_960_720.png"
          alt="title"
          style={{ width: "200px", height: "150px" }}
        />
      </div>
      <button onClick={onButtonClick}>Click me</button>
    </>
  );
};
export default ViewThumbnail;

// import React, { useEffect, useState } from "react";
// import WebViewer from "@pdftron/webviewer";

// const ViewThumbnail = () => {
//   const [thumb, setThumb] = useState(null);

//   useEffect(() => {
//     const getThumbnail = async () => {
//       const CoreControls = window.CoreControls;
//       CoreControls.setWorkerPath("/webviewer/lib/core");
//       const doc = await CoreControls.createDocument("pdfFileHERE", {
//         extension: "pdf",
//       });
//       doc.loadCanvasAsync({
//         pageNumber: 1,
//         drawComplete: (thumb) => {
//           setThumb(thumb);
//         },
//       });
//     };
//     getThumbnail();
//   }, []);

//   return (
//     <div className="MyComponent">
//       <div className="header">React sample</div>
//       {thumb && (
//         <img src={thumb.toDataURL()} width="200px" height="150px"></img>
//       )}
//     </div>
//   );
// };

// export default ViewThumbnail;
