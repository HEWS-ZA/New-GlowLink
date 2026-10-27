import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "./context/ThemeContext";

// Layouts & Access Guards
import { PublicLayout } from "@/components/layout/PublicLayout";
import { CustomerLayout } from "@/components/layout/CustomerLayout";
import { ConsoleLayout } from "@/components/layout/ConsoleLayout";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { RedirectIfAuthenticated } from "@/components/auth/RedirectIfAuthenticated";

// Public Pages
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Pricing from "./pages/Pricing";
import HowItWorks from "./pages/HowItWorks";
import Search from "./pages/Search";
import Profile from "./pages/Profile";
import RegisterArtist from "./pages/RegisterArtist";
import AccessDenied from "./pages/AccessDenied";
import NotFound from "./pages/NotFound";

// Auth & Entry Points
import { LoginHub } from "./pages/LoginHub";
import { CustomerAuth } from "./pages/CustomerAuth";
import { ArtisanAuth } from "./pages/ArtisanAuth";

// Customer Sanctuary Portal
import { CustomerBookings } from "./pages/CustomerBookings";
import { CustomerReceipts } from "./pages/CustomerReceipts";
import { CustomerProfile } from "./pages/CustomerProfile";

// Artisan Atelier Console
import Dashboard from "./pages/Dashboard";

// Testing Suite
import { ScenarioTestingPanel } from "./components/testing/ScenarioTestingPanel";

const App = () => {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Toaster position="top-right" richColors />
        <ScenarioTestingPanel />
        <Routes>
          {/* 1. PUBLIC STOREFRONT (wrapped by PublicLayout) */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/search" element={<Search />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/:id" element={<Profile />} />
            <Route path="/register-artist" element={<RegisterArtist />} />

            {/* Portal Entry Choices */}
            <Route
              path="/login"
              element={
                <RedirectIfAuthenticated>
                  <LoginHub />
                </RedirectIfAuthenticated>
              }
            />
            <Route
              path="/customer/login"
              element={
                <RedirectIfAuthenticated>
                  <CustomerAuth initialMode="login" />
                </RedirectIfAuthenticated>
              }
            />
            <Route
              path="/customer/register"
              element={
                <RedirectIfAuthenticated>
                  <CustomerAuth initialMode="register" />
                </RedirectIfAuthenticated>
              }
            />
            <Route
              path="/artisan/login"
              element={
                <RedirectIfAuthenticated>
                  <ArtisanAuth initialMode="login" />
                </RedirectIfAuthenticated>
              }
            />
            <Route
              path="/artisan/register"
              element={
                <RedirectIfAuthenticated>
                  <ArtisanAuth initialMode="register" />
                </RedirectIfAuthenticated>
              }
            />

            <Route path="/access-denied" element={<AccessDenied />} />
            <Route path="*" element={<NotFound />} />
          </Route>

          {/* 2. CUSTOMER SANCTUARY PORTAL (Guarded strictly for Customer & Admin) */}
          <Route
            element={
              <RequireAuth allowedRoles={["customer", "admin"]}>
                <CustomerLayout />
              </RequireAuth>
            }
          >
            <Route path="/customer/bookings" element={<CustomerBookings />} />
            <Route path="/customer/receipts" element={<CustomerReceipts />} />
            <Route path="/customer/profile" element={<CustomerProfile />} />
          </Route>

          {/* 3. ARTISAN ATELIER CONSOLE (Guarded strictly for Artisan & Admin) */}
          <Route
            path="/dashboard"
            element={
              <RequireAuth allowedRoles={["artisan", "admin"]}>
                <ConsoleLayout>
                  <Dashboard />
                </ConsoleLayout>
              </RequireAuth>
            }
          />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
