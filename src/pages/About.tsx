import { SEO } from "../components/common/SEO";
import Header from "../components/layout/DefaultHeader";

const About = () => {
  return (
    <>
      <SEO title="About / Mesom" />
      <Header label="About" />
      <div>
        <h2>About</h2>
        <p>About information</p>
      </div>
    </>
  );
};

export default About;
