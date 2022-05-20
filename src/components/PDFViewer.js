import { useEffect, useRef } from "react";
import {
  addPage,
  flipPage,
  loadPDF,
  mergePDF,
  removePage,
  splitPDF,
} from "../helperFunctions";
export default function PDFViewer(props) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    let PSPDFKit;

    (async function () {
      PSPDFKit = await import("pspdfkit");

      if (PSPDFKit) {
        PSPDFKit.unload(container);
      }

      const instance = await PSPDFKit.load({
        container,
        document: props.document,
        baseUrl: `${window.location.protocol}//${window.location.host}/`,
      });
      splitPDF({ instance });
    })();

    return () => PSPDFKit && PSPDFKit.unload(container);
  }, []);

  return <div ref={containerRef} style={{ width: "100%", height: "100vh" }} />;
}
