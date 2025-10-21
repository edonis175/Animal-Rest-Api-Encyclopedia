import fs from "fs";

export const readData = () => {
  const data = fs.readFileSync("data.json", "utf-8");
  return JSON.parse(data);
};

export const writeData = (data) => {
  try {
    fs.writeFileSync("data.json", JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.log("Error while Writting data", error);
    return false;
  }
};
