import Link from "next/link";

const Footer = () => {
  return (
    <footer id="contact" className="bg-gray-900 mt-4">
      <div className="mx-auto w-full max-w-screen-xl p-4 py-6 lg:py-8">
        <div className="md:flex md:justify-between">
          <div className="grid grid-cols-2 gap-8 sm:gap-16 sm:grid-cols-3">
            <div className="col-span-2 md:col-span-1">
              <h2 className="mb-6 text-sm font-semibold uppercase text-white">
                Our Socials
              </h2>
              <iframe
                className="w-[300px] h-[150px] sm:w-[200px] sm:h-[120px] md:w-[250px] md:h-[150px]"
                src="https://www.youtube.com/embed/ieyKJmrUg9s"
              ></iframe>
              <ul className="text-gray-400 font-medium mt-3 flex items-center">
                <Link href="#" className="text-gray-500 hover:text-white">
                  <svg
                    className="w-4 h-4"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 8 19"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6.135 3H8V0H6.135a4.147 4.147 0 0 0-4.142 4.142V6H0v3h2v9.938h3V9h2.021l.592-3H5V3.591A.6.6 0 0 1 5.592 3h.543Z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="sr-only">Facebook page</span>
                </Link>
                <Link href="#" className="text-gray-500 hover:text-white ms-5">
                  <svg
                    className="w-4 h-4"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 17"
                  >
                    <path
                      fillRule="evenodd"
                      d="M20 1.892a8.178 8.178 0 0 1-2.355.635 4.074 4.074 0 0 0 1.8-2.235 8.344 8.344 0 0 1-2.605.98A4.13 4.13 0 0 0 13.85 0a4.068 4.068 0 0 0-4.1 4.038 4 4 0 0 0 .105.919A11.705 11.705 0 0 1 1.4.734a4.006 4.006 0 0 0 1.268 5.392 4.165 4.165 0 0 1-1.859-.5v.05A4.057 4.057 0 0 0 4.1 9.635a4.19 4.19 0 0 1-1.856.07 4.108 4.108 0 0 0 3.831 2.807A8.36 8.36 0 0 1 0 14.184 11.732 11.732 0 0 0 6.291 16 11.502 11.502 0 0 0 17.964 4.5c0-.177 0-.35-.012-.523A8.143 8.143 0 0 0 20 1.892Z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="sr-only">Twitter page</span>
                </Link>
              </ul>
            </div>
            <div>
              <h2 className="mb-6 text-sm font-semibold uppercase text-white">
                Useful Links
              </h2>
              <ul className="text-gray-400 font-medium">
                <li className="mb-4">
                  <Link
                    href="http://admser.chd.nic.in/sevaempb/app/Login/"
                    className="hover:underline"
                  >
                    Employee Login-Sevaarth
                  </Link>
                </li>
                <li className="mb-4">
                  <Link
                    href="https://ssachd.nic.in/"
                    className="hover:underline"
                  >
                    Samagra Shiksha Chandigarh
                  </Link>
                </li>
                <li className="mb-4">
                  <Link
                    href="https://sdms.udiseplus.gov.in/"
                    className="hover:underline"
                  >
                    UDISE+ Students
                  </Link>
                </li>
                <li className="mb-4">
                  <Link
                    href="http://phoenix.chdeducation.gov.in/Login.aspx"
                    className="hover:underline"
                  >
                    Phoenix
                  </Link>
                </li>
                <li className="mb-4">
                  <Link
                    href="https://www.cbse.gov.in/"
                    className="hover:underline"
                  >
                    CBSE
                  </Link>
                </li>
                <li className="mb-4">
                  <Link
                    href="https://ehrms.nic.in/Home/Index/CH"
                    className="hover:underline"
                  >
                    E - HRMS
                  </Link>
                </li>
                <li className="mb-4">
                  <Link
                    href="https://ncert.nic.in/textbooks.php"
                    className="hover:underline"
                  >
                    NCERT Text Books
                  </Link>
                </li>
                <li className="mb-4">
                  <Link
                    href="http://scholarships.gov.in/"
                    className="hover:underline"
                  >
                    Scholarships
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="mb-6 text-sm font-semibold uppercase text-white">
                Get in touch
              </h2>
              <ul className="text-gray-400 font-medium">
                <li>Govt. Model High School</li>
                <li>Pocket No. 1</li>
                <li>Manimajra</li>
                <li className="mb-4">Chandigarh</li>
                <Link
                  href={`tel:01722737701`}
                  className="underline text-sm block"
                >
                  0172-2737701
                </Link>
                <Link
                  href={`mailto:gmhspocket1@gmail.com`}
                  className="underline text-sm"
                >
                  gmhspocket1@gmail.com
                </Link>
              </ul>
            </div>
          </div>
        </div>
        <hr className="my-6 sm:mx-auto border-gray-700 lg:my-8" />
        <div className="mb-10 flex gap-4 flex-wrap">
          <a href="https://ekbharat.gov.in/" target="_blank">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSoh7V6feZI-b9-BT_XpOgAr3Xc24Sv5YnoU191w8SfkQ&s"
              alt="ek bharat shrestha bharat"
              className="w-20 h-20 rounded-full"
            />
          </a>
          <a href="https://dsel.education.gov.in/sbsv/" target="_blank">
            <img
              src="https://csrbox.org/company/proj_img/1520588326swachh-bharat-swachh-vidyalaya%20(1).jpg"
              className="h-20 rounded-md"
              alt="swachh bharat swachh vidayalaya"
            />
          </a>
          <a href="https://csc.gov.in/digitalIndia" target="_blank">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTdz-p_lRFfaWjECaxe0swZAH_zeTGnwAbrJFBFdtE8dw&s"
              className="h-20 rounded-md"
              alt="Digital India"
            />
          </a>
          <a href="https://fitindia.gov.in" target="_blank">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTF52BXkR30vAoN43KEjeExRMLIFSAtnYQWEBSIx8n8jw&s"
              className="h-20 rounded-md"
              alt="Fit India"
            />
          </a>
          <a href="https://www.india.gov.in/" target="_blank">
            <img
              src="https://msme.gov.in/sites/default/files/india-gov.png"
              className="h-20 rounded-md bg-white"
              alt="Govt. Of India"
            />
          </a>
          <a href="https://samagra.education.gov.in" target="_blank">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT99jhj5PlU9iz_vNWZx31wRFt8g46n6qjZizCJGq7Mog&s"
              className="h-20 rounded-md"
              alt="samagra shiksha"
            />
          </a>
          <a href="https://pmposhan.education.gov.in" target="_blank">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThy-A1WTjORAluqghdWscWwOLrJdupiz7Xhz5wfU3J0A&s"
              className="h-20 rounded-md"
              alt="pm poshan"
            />
          </a>
        </div>
        <hr className="my-6 sm:mx-auto border-gray-700 lg:my-8" />
        <div className="sm:flex sm:items-center sm:justify-between">
          <div className="text-sm text-gray-500 dark:text-gray-300 sm:text-center mb-4">
            © 2024 GMHS Pocket 1 Manimajra, U.T. Chandigarh
          </div>
          <span className="text-sm sm:text-center text-gray-400">
            For technical enquiries, please contact{" "}
            <Link href={"/admin"}>Mr Ramesh Kumar</Link> at{" "}
            <Link className="underline" href="tel:9915007909">
              +91 9915007909
            </Link>{" "}
            or email at{" "}
            <Link className="underline" href="mailto:rameshgupta001@gmail.com">
              rameshgupta001@gmail.com
            </Link>
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
