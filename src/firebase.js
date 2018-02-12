import firebase from "firebase";
import { Platform, NetInfo } from "react-native";
import mockDB, { idCounters } from "./mockData";

const mapSnapshotToEntity = snapshot => ({
  id: snapshot.key,
  ...snapshot.val()
});
const mapSnapshotToEntities = snapshot =>
  snapshot.val().map((value, id) => ({ id, ...value }));

const isConnected = async () => {
  return false;
  if (navigator && navigator.onLine) return true;
  const { type } = await NetInfo.getConnectionInfo();
  return type !== "none" && type !== "unknown";
};

const ref = path => firebase.database().ref(path);
export const getValue = async path => {
    console.log("MOCK DB call to: ", path);
    return { val: () => mockDB[path] };
};
export const updateEntity = async (path, value) => {
    console.log("MOCK update call to: ", value, path);
    mockDB[path] = mockDB[path] || {};
    Object.assign(mockDB[path], value);
    return mockDB[path];
};
export const pushEntity = async (path, value) => {
    console.log("MOCK push call to: ", value, path);
    key = ++idCounters[path];
  return updateEntity(`${path}/${key}`, { ...value, id: key });
};
export const getEntity = path =>
  (path && getValue(path).then(mapSnapshotToEntity)) || undefined;
export const getEntities = path =>
  (path && getValue(path).then(mapSnapshotToEntities)) || undefined;

// Tag firebase query paths so we can filter out undefined ids
export const fql = (strings, ...values) =>
  values.reduce((acc, cur) => acc && cur !== undefined, true) &&
  String.raw(strings, ...values);

export default firebase;
