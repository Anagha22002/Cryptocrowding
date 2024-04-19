import '@/styles/globals.css';
// INTERNAL IMPORT
import { Footer, NavBar } from "../components";
import { CrowdFundingProvider } from "../context/CrowdFunding";

export default function App({ Component, pageProps }) {
    return (
    <CrowdFundingProvider>
        <NavBar />
        <Component {...pageProps} />
        <Footer />
    </CrowdFundingProvider>
    );
}
