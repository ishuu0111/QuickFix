import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from "react";
import Storage from "../utils/storage";

const SOSContext = createContext(null);
const STORAGE_KEY_CONTACTS = "@quickfix_sos_contacts_v1";

const DEFAULT_CONTACTS = [
  { id: "1", name: "QuickFix 24/7 Helpline", phone: "+919876543210", relation: "Support" },
  { id: "2", name: "Emergency Response", phone: "112", relation: "National Emergency" },
];

export function SOSProvider({ children }) {
  const [emergencyContacts, setEmergencyContacts] = useState(DEFAULT_CONTACTS);
  const [sosActive, setSOSActive] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load saved contacts from storage on mount
  useEffect(() => {
    (async () => {
      try {
        const saved = await Storage.getItem(STORAGE_KEY_CONTACTS);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            setEmergencyContacts(parsed);
          }
        } else {
          // Initialize with default contacts on first load
          await Storage.setItem(STORAGE_KEY_CONTACTS, JSON.stringify(DEFAULT_CONTACTS));
        }
      } catch (e) {
        console.warn("Failed to load emergency contacts:", e);
      } finally {
        setIsLoaded(true);
      }
    })();
  }, []);

  // Persist contacts to storage whenever they change (after initial load)
  useEffect(() => {
    if (!isLoaded) return;
    (async () => {
      try {
        await Storage.setItem(STORAGE_KEY_CONTACTS, JSON.stringify(emergencyContacts));
      } catch (e) {
        console.warn("Failed to save emergency contacts:", e);
      }
    })();
  }, [emergencyContacts, isLoaded]);

  const addContact = useCallback((contact) => {
    setEmergencyContacts((prev) => {
      if (prev.length >= 5) {
        return prev; // max 5 contacts
      }
      const newContact = {
        id: contact.id || Date.now().toString(),
        name: (contact.name || "").trim(),
        phone: (contact.phone || "").trim(),
        relation: (contact.relation || "").trim(),
      };
      const updated = [...prev, newContact];
      Storage.setItem(STORAGE_KEY_CONTACTS, JSON.stringify(updated)).catch(() => {});
      return updated;
    });
  }, []);

  const removeContact = useCallback((id) => {
    setEmergencyContacts((prev) => {
      const updated = prev.filter((c) => c.id !== id);
      Storage.setItem(STORAGE_KEY_CONTACTS, JSON.stringify(updated)).catch(() => {});
      return updated;
    });
  }, []);

  const updateContact = useCallback((id, updated) => {
    setEmergencyContacts((prev) => {
      const updatedList = prev.map((c) =>
        c.id === id
          ? {
              ...c,
              name: (updated.name !== undefined ? updated.name : c.name).trim(),
              phone: (updated.phone !== undefined ? updated.phone : c.phone).trim(),
              relation: (updated.relation !== undefined ? updated.relation : c.relation).trim(),
            }
          : c
      );
      Storage.setItem(STORAGE_KEY_CONTACTS, JSON.stringify(updatedList)).catch(() => {});
      return updatedList;
    });
  }, []);

  const value = useMemo(
    () => ({
      emergencyContacts,
      sosActive,
      setSOSActive,
      addContact,
      removeContact,
      updateContact,
      isLoaded,
    }),
    [emergencyContacts, sosActive, addContact, removeContact, updateContact, isLoaded]
  );

  return <SOSContext.Provider value={value}>{children}</SOSContext.Provider>;
}

export function useSOS() {
  const ctx = useContext(SOSContext);
  if (!ctx) throw new Error("useSOS must be used within a SOSProvider");
  return ctx;
}
