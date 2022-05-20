import mergingPDF from "./examplePDF.pdf";
async function loadPDF({ PSPDFKit, container, document, baseUrl }) {
  const instance = await PSPDFKit.load({
    // Container where PSPDFKit should be mounted.
    container,
    // The document to open.
    document,
    // Use the public directory URL as a base URL. PSPDFKit will download its library assets from here.
    baseUrl,
  });
  return instance;
}

async function mergePDF({ instance }) {
  fetch(mergingPDF)
    .then((res) => {
      if (!res.ok) {
        throw res;
      }
      return res;
    })
    .then((res) => res.blob())
    .then((blob) => {
      instance.applyOperations([
        {
          type: "importDocument",
          beforePageIndex: 0,
          document: blob,
          treatImportedDocumentAsOnePage: false,
        },
      ]);
    });
}
function flipPage({ pageIndexes, instance }) {
  instance.applyOperations([
    {
      type: "rotatePages", //tell PSPDF to rotate the page.
      pageIndexes,
      rotateBy: 180,
    },
  ]);
}
function removePage({ pageIndexes, instance }) {
  instance.applyOperations([
    {
      type: "removePages",
      pageIndexes,
    },
  ]);
}
function addPage({ instance, PSPDFKit }) {
  console.log(instance.totalPageCount);
  instance.applyOperations([
    {
      type: "addPage",
      afterPageIndex: instance.totalPageCount - 1,
      backgroundColor: new PSPDFKit.Color({ r: 100, g: 200, b: 255 }), // Set the new page background color.
      pageWidth: 750,
      pageHeight: 1000,
    },
  ]);
}

async function splitPDF({ instance }) {
  const firstHalf = await instance.exportPDFWithOperations([
    {
      type: "removePages",
      pageIndexes: [0, 1, 2],
    },
  ]);
  const secondHalf = await instance.exportPDFWithOperations([
    {
      type: "removePages",
      pageIndexes: [3, 4],
    },
  ]);
  console.log("First half of the file:", firstHalf);
  console.log("Second half of the file:", secondHalf);
}
export { loadPDF, mergePDF, flipPage, removePage, addPage, splitPDF };
