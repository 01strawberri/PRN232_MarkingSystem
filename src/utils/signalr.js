import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import API_URL from "@/config/api";

let connection = null;
let connected = false;

export function getConnection() {
  if (connection) return connection;

  connection = new HubConnectionBuilder()
    .withUrl(`${API_URL}/gradingHub`)
    .withAutomaticReconnect()
    .configureLogging(LogLevel.Information)
    .build();

  return connection;
}
export async function startConnection() {
  const conn = getConnection();

  if (connected) return conn;

  try {
    await conn.start();
    console.log("✅ Connected to GradingHub");
    connected = true;
  } catch (err) {
    console.error("❌ Error connecting to SignalR:", err);
    setTimeout(startConnection, 1000);
  }

  return conn;
}
export function onReceiveGrade(callback) {
  const conn = getConnection();
  conn.on("ReceiveGrade", callback);
}

export function offReceiveGrade(callback) {
  const conn = getConnection();
  conn.off("ReceiveGrade", callback);
}

export async function sendClientMessage(method, payload) {
  const conn = await startConnection();
  await conn.invoke(method, payload);
}
