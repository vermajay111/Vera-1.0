// db.js
import Dexie from "dexie";


export const db = new Dexie("UserMedicalData");

db.version(1).stores({
  friends: "++id, name, age, gender",
});
