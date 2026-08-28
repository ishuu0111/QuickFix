import React, { createContext, useContext, useMemo, useState, useCallback, useEffect } from "react";
import { lightTheme, darkTheme } from "../theme/theme";
import { addresses as initialAddresses, bookings as initialBookings, walletTransactions as initialWalletTransactions } from "../data/dummyData";
import Storage from "../utils/storage";
import { getCurrentUserLocation } from "../utils/location";

const AppContext = createContext(null);

const STORAGE_KEY_AUTH = "@quickfix_auth_v1";
const STORAGE_KEY_USER = "@quickfix_user_v1";
const STORAGE_KEY_THEME = "@quickfix_theme_v1";
const STORAGE_KEY_BOOKINGS = "@quickfix_bookings_v1";
const STORAGE_KEY_WALLET_BALANCE = "@quickfix_wallet_balance_v1";
const STORAGE_KEY_WALLET_TX = "@quickfix_wallet_tx_v1";

export function AppProvider({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isGuest, setIsGuest] = useState(false);
  const [user, setUser] = useState({
    name: "Rohan Verma",
    email: "rohan.verma@example.com",
    phone: "+91 98765 43210",
    location: "Koramangala, Bengaluru",
    coords: { latitude: 12.9352, longitude: 77.6146 },
    avatarColor: "#0D6EFD",
  });

  const [addresses, setAddresses] = useState(initialAddresses);
  const [selectedAddressId, setSelectedAddressId] = useState(initialAddresses[0]?.id);

  const [bookings, setBookings] = useState(initialBookings);
  const [activeBooking, setActiveBooking] = useState(null);
  const [isLocating, setIsLocating] = useState(false);
  const [walletTransactions, setWalletTransactions] = useState(initialWalletTransactions);
  const [walletBalance, setWalletBalance] = useState(850);
  const [notificationSettings, setNotificationSettings] = useState({
    push: true,
    email: true,
    sms: false,
    promotions: true,
  });
  const [language, setLanguage] = useState("English");

  // Load saved session on app launch
  useEffect(() => {
    (async () => {
      try {
        const savedAuth = await Storage.getItem(STORAGE_KEY_AUTH);
        const savedUser = await Storage.getItem(STORAGE_KEY_USER);
        const savedTheme = await Storage.getItem(STORAGE_KEY_THEME);
        const savedBookings = await Storage.getItem(STORAGE_KEY_BOOKINGS);
        const savedWalletBalance = await Storage.getItem(STORAGE_KEY_WALLET_BALANCE);
        const savedWalletTx = await Storage.getItem(STORAGE_KEY_WALLET_TX);

        if (savedAuth) {
          const authData = JSON.parse(savedAuth);
          setIsAuthenticated(authData.isAuthenticated || false);
          setIsGuest(authData.isGuest || false);
        }
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
        if (savedTheme) {
          setIsDarkMode(JSON.parse(savedTheme));
        }
        if (savedBookings) {
          setBookings(JSON.parse(savedBookings));
        }
        if (savedWalletBalance !== null && savedWalletBalance !== undefined) {
          setWalletBalance(JSON.parse(savedWalletBalance));
        }
        if (savedWalletTx) {
          setWalletTransactions(JSON.parse(savedWalletTx));
        }
      } catch (e) {
        console.warn("Error restoring state from storage:", e);
      }
    })();
  }, []);

  const saveUserSession = async (authObj, userObj) => {
    try {
      await Storage.setItem(STORAGE_KEY_AUTH, JSON.stringify(authObj));
      if (userObj) {
        await Storage.setItem(STORAGE_KEY_USER, JSON.stringify(userObj));
      }
    } catch (e) {
      console.warn("Failed to persist user session:", e);
    }
  };

  const toggleDarkMode = useCallback((val) => {
    setIsDarkMode(val);
    Storage.setItem(STORAGE_KEY_THEME, JSON.stringify(val));
  }, []);

  const login = useCallback((credentials) => {
    setIsAuthenticated(true);
    setIsGuest(false);
    setUser((prev) => {
      const updated = {
        ...prev,
        name: credentials?.name || prev.name,
        email: credentials?.email || prev.email,
        phone: credentials?.phone || prev.phone,
        avatarColor: credentials?.avatarColor || prev.avatarColor,
      };
      saveUserSession({ isAuthenticated: true, isGuest: false }, updated);
      return updated;
    });
  }, []);

  const continueAsGuest = useCallback(() => {
    setIsGuest(true);
    setIsAuthenticated(true);
    saveUserSession({ isAuthenticated: true, isGuest: true }, null);
  }, []);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    setIsGuest(false);
    Storage.removeItem(STORAGE_KEY_AUTH);
  }, []);

  const detectLocation = useCallback(async () => {
    setIsLocating(true);
    const res = await getCurrentUserLocation();
    setIsLocating(false);
    if (res.success && res.address) {
      setUser((prev) => {
        const updated = {
          ...prev,
          location: res.address,
          coords: res.coords || prev.coords,
        };
        Storage.setItem(STORAGE_KEY_USER, JSON.stringify(updated));
        return updated;
      });
      return res.address;
    }
    return null;
  }, []);

  const addBooking = useCallback((booking) => {
    setBookings((prev) => {
      const updated = [booking, ...prev];
      Storage.setItem(STORAGE_KEY_BOOKINGS, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const cancelBooking = useCallback((id) => {
    setBookings((prev) => {
      const updated = prev.map((b) => (b.id === id ? { ...b, status: "cancelled" } : b));
      Storage.setItem(STORAGE_KEY_BOOKINGS, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const rateBooking = useCallback((id) => {
    setBookings((prev) => {
      const updated = prev.map((b) => (b.id === id ? { ...b, rated: true } : b));
      Storage.setItem(STORAGE_KEY_BOOKINGS, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const addWalletMoney = useCallback((amount, paymentMethod = "UPI") => {
    const num = Number(amount) || 0;
    if (num <= 0) return;
    setWalletBalance((prev) => {
      const next = prev + num;
      Storage.setItem(STORAGE_KEY_WALLET_BALANCE, JSON.stringify(next));
      return next;
    });
    setWalletTransactions((prev) => {
      const newTx = {
        id: "w" + Date.now(),
        title: `Added via ${paymentMethod}`,
        amount: num,
        type: "credit",
        date: "Today",
      };
      const next = [newTx, ...prev];
      Storage.setItem(STORAGE_KEY_WALLET_TX, JSON.stringify(next));
      return next;
    });
  }, []);

  const debitWalletMoney = useCallback((amount, title = "Paid for Service") => {
    const num = Number(amount) || 0;
    if (num <= 0) return false;
    setWalletBalance((prev) => {
      const next = Math.max(0, prev - num);
      Storage.setItem(STORAGE_KEY_WALLET_BALANCE, JSON.stringify(next));
      return next;
    });
    setWalletTransactions((prev) => {
      const newTx = {
        id: "w" + Date.now(),
        title: title,
        amount: -num,
        type: "debit",
        date: "Today",
      };
      const next = [newTx, ...prev];
      Storage.setItem(STORAGE_KEY_WALLET_TX, JSON.stringify(next));
      return next;
    });
    return true;
  }, []);

  const theme = useMemo(() => (isDarkMode ? darkTheme : lightTheme), [isDarkMode]);

  const value = useMemo(
    () => ({
      theme,
      isDarkMode,
      setIsDarkMode: toggleDarkMode,
      isAuthenticated,
      isGuest,
      user,
      setUser,
      login,
      continueAsGuest,
      logout,
      detectLocation,
      isLocating,
      addresses,
      setAddresses,
      selectedAddressId,
      setSelectedAddressId,
      bookings,
      addBooking,
      cancelBooking,
      rateBooking,
      activeBooking,
      setActiveBooking,
      walletBalance,
      walletTransactions,
      addWalletMoney,
      debitWalletMoney,
      notificationSettings,
      setNotificationSettings,
      language,
      setLanguage,
    }),
    [
      theme,
      isDarkMode,
      toggleDarkMode,
      isAuthenticated,
      isGuest,
      user,
      login,
      continueAsGuest,
      logout,
      detectLocation,
      isLocating,
      addresses,
      selectedAddressId,
      bookings,
      addBooking,
      cancelBooking,
      rateBooking,
      activeBooking,
      walletBalance,
      walletTransactions,
      addWalletMoney,
      debitWalletMoney,
      notificationSettings,
      language,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within an AppProvider");
  return ctx;
}
