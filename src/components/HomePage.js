import Header from "./Header/Header";
import Footer from "./Footer/Footer";
import "./HomePage.css";
import NavBar from "./NavBar/NavBar";
import CategoryPage from "./Category/CategoryPage";

const HomePage = () => {
  return (
    <>
      <Header />
      <NavBar />
      <div className="intro-video">
        <video
          src="https://videos.pexels.com/video-files/3206296/3206296-hd_1920_1080_25fps.mp4"
          autoPlay
          loop
          muted
          className="w-100"
          title="Welcome video showcasing clothing brand"
        ></video>
        <div className="overlay">
          <h1>Welcome to Seasons Fabrics</h1>
        </div>
      </div>
      <CategoryPage />
      <Footer />
    </>
  );
};

export default HomePage;
