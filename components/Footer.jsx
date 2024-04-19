const Footer = () => {
  const productList = [ "Gilla Shriiya", "Anagha Kalyanaraman", "Sushma"];
  const usefullLink = [ "20EG105617", "20EG105621", "20EG105627"];
  const contactList = [ "20EG105617@anurag.edu.in", "20EG105621@anurag.edu.in", "20EG105627@anurag.edu.in"];
  return (
  <footer class="text-center text-white backgroundMain lg:text-left">
    <div class="mx-6 ру-10 text-center md:text-left">
  <div class="grid-1 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
  <div class="">
  <h6 class="mb-4 flex items-center justify-center font-semibold uppercase
  md:justify-start">
    CryptoCrowd
    </h6>
    <p>
    CrowdFund platform using Blockchain
    </p>
  </div>
  <div class="">
  <h6 class="mb-4 flex justify-center font-semibold uppercase
  md:justify-start">
  Team Members
  </h6>
  {productList.map((el, i) => (
    <p class="mb-4" key={i + 1}>
    <a href="#!">{el}</a>
  </p>
  ))}
  </div>
  <div class="">
    <h6 class="mb-4 flex justify-center font-semibold uppercase
  md:justify-start">
    Roll Numbers
  </h6>
    {usefullLink.map((el, i) => (
      <p class="mb-4" key={i + 1}>
      <a href="#!">{el}</a>
    </p>
    ))}
    </div>
    <div>
    <h6 class="mb-4 flex justify-center font-semibold uppercase
  md:justify-start">
    Contact
  </h6>
    {contactList.map((el, i) =>(
    <p class="mb-4" key={i + 1}>
      <a href="#!">{el}</a>
      </p>
    ))}
    </div>
    </div>
    </div>
    <div class="backgroundMain р-6 text-center">
    <a class=" font-semibold " href="https://tailwind-elements.com/">
    </a>
    </div>
  </footer>
  );
    };
  export default Footer;



