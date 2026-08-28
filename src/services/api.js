import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../config/firebase";
import { services, professionals, categories } from "../data/dummyData";

const delay = (ms = 600) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export async function fetchServices() {
  await delay();
  return services;
}

export async function fetchCategories() {
  await delay(300);
  return categories;
}

export async function fetchNearbyProfessionals() {
  await delay(800);
  return professionals;
}

export async function submitBooking(payload) {
  try {
    const bookingData = {
      serviceId: payload.service?.id || "",
      serviceName: payload.service?.name || "",
      category: payload.service?.category || "",
      price: Number(payload.service?.price || 0),
      slot: payload.slot || "",
      addressId: payload.address?.id || "",
      addressLabel: payload.address?.label || "",
      addressLine: payload.address?.line || "",
      status: "SEARCHING",
      professionalId: null,
      professionalName: null,
      createdAt: serverTimestamp(),
    };

    const docRef = await addDoc(
      collection(db, "bookings"),
      bookingData
    );

    console.log("BOOKING CREATED:", docRef.id);

    return {
      success: true,
      bookingId: docRef.id,
      ...bookingData,
    };
  } catch (error) {
    console.error("FIREBASE BOOKING ERROR:", error);

    return {
      success: false,
      error: error.message,
    };
  }
}

export async function submitPayment(payload) {
  await delay(1200);

  return {
    success: true,
    transactionId: `txn_${Date.now()}`,
    ...payload,
  };
}

export async function submitReview(payload) {
  await delay(500);

  return {
    success: true,
    ...payload,
  };
}
// ==========================================
// QUICKFIX AI CHATBOT
// ==========================================
export async function sendChatMessage(message, sessionId) {
  try {
    const response = await fetch(
      "https://ishuu0111.app.n8n.cloud/webhook/b03193d6-2d7d-4fcb-a318-67f7d0258a33/chat",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "sendMessage",
          sessionId: sessionId,
          chatInput: message,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Chatbot error: ${response.status}`);
    }

    const data = await response.json();

    console.log("N8N CHAT RESPONSE:", data);

    return {
      success: true,
      response:
        data.output ||
        data.text ||
        data.response ||
        "",
    };
  } catch (error) {
    console.error("QUICKFIX CHATBOT ERROR:", error);

    return {
      success: false,
      error: error.message,
    };
  }
}