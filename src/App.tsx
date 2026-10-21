import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Pricing from "./pages/Pricing";
import Login from "./pages/Login";
import HowItWorks from "./pages/HowItWorks";
import Search from "./pages/Search";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";
import RegisterArtist from "./pages/RegisterArtist";
import NotFound from "./pages/NotFound";
import { MobileBottomNav } from "./components/MobileBottomNav";

const App = () => {
  return (
    <BrowserRouter>
      <Toaster position="top-right" richColors />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/search" element={<Search />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/register-artist" element={<RegisterArtist />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <MobileBottomNav />
    </BrowserRouter>
  );
};

export default App;
