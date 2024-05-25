// import AffiliationDocument from "../../../public/docs/school-affiliation.pdf";

const AffiliationStatus = () => {
  return (
    <section
      id="about"
      className="scale-95 md:scale-100 border w-full md:w-2/3 md:mx-auto border-gray-300 flex flex-col items-center mt-20 rounded-lg"
    >
      <h1 className="font-semibold text-2xl md:text-3xl my-4">
        School Affiliation Status
      </h1>

      <object
        className="pdf p-2"
        data="https://gmhspocket1manimajra.com/wp-content/uploads/2023/06/school-affiliation.pdf"
        width="100%"
        height="800"
      ></object>
    </section>
  );
};

export default AffiliationStatus;

/**
 <Document file={pdfURL}>
 <Page pageNumber={1} />
 </Document>
 </div>
 */
