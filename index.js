import express from "express";
import cors from "cors";
import { readData, writeData } from "./dataHelper.js";

const app = express();
app.use(express.json());
app.use(cors("*"));

app.get("/", (req, res) => {
  res.json({
    message: "Welcome to the Animals API Project",
    endpoints: {
      "GET /animals": "Get All Animals",
      "GET /animals/:id": "Get animals by ID",
      "POST /animals": "Create new animals",
      "PUT /animals/:id": "Update animals by id",
      "DELETE /animals/:id": "Delete animals by id",
    },
  });
});

app.get("/animals", (req, res) => {
  const data = readData();
  res.json(data.animals);
});

app.get("/animals/:id", (req, res) => {
  const data = readData();

  const animalsID = parseInt(req.params.id);
  console.log(typeof animalsID, animalsID);
  console.log(data, "ertert");

  const animal = data.animals.find((animal) => animal.id === animalsID);

  if (!animal) {
    return res
      .status(404)
      .json({ success: "false", message: "Animal not found" });
  }
  res.status(200).json({ success: true, data: animal });
});

app.post("/animals", (req, res) => {
  console.log(req.body);
  const name = req.body.name;
  const habitat = req.body.habitat;
  const average_lifespan = req.body.average_lifespan;
  const continent = req.body.continent;

  if (!name || !habitat || !average_lifespan || !continent) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide all the fields" });
  }
  const data = readData();

  const existingAnimal = data.animals.find((animal) => animal.name === name);
  if (existingAnimal) {
    return res.status(400).json({
      success: false,
      message: "Animal with this name already exists",
    });
  }

  const maxID = Math.max(...data.animals.map((animal) => animal.id));
  const newAnimal = {
    id: maxID + 1,
    name: name,
    habitat: habitat,
    average_lifespan: average_lifespan,
    continent: continent,
  };

  data.animals.push(newAnimal);
  writeData(data);

  if (writeData(data)) {
    res
      .status(201)
      .json({ success: true, message: "New Animal Created", data: newAnimal });
  } else {
    res
      .status(500)
      .json({ success: false, message: "Error while Creating Animal" });
  }
});

app.put("/animals/:id", (req, res) => {
  const data = readData();
  const animalsID = parseInt(req.params.id);

  const { name, habitat, average_lifespan, continent } = req.body;

  const animalIndex = data.animals.findIndex(
    (animal) => animal.id === animalsID
  );

  if (animalIndex === -1) {
    return res
      .status(404)
      .json({ success: false, message: "Animal not Found" });
  }

  if (name) {
    data.animals[animalIndex].name = name;
  }
  if (habitat) {
    data.animals[animalIndex].habitat = habitat;
  }
  if (average_lifespan) {
    data.animals[animalIndex].average_lifespan = average_lifespan;
  }
  if (continent) {
    data.animals[animalIndex].continent = continent;
  }

  if (writeData(data)) {
    res.status(201).json({
      success: true,
      message: "Animal Updated",
      data: data.animals[animalIndex],
    });
  } else {
    res
      .status(500)
      .json({ success: false, message: "Error while Deleting Animal" });
  }
});

app.delete("/animals/:id", (req, res) => {
  const data = readData();
  const animalsID = parseInt(req.params.id);
  const animalIndex = data.animals.findIndex(
    (animal) => animal.id === animalsID
  );
  if (animalIndex === -1) {
    return res.status(404).json({
      success: false,
      message: "Animal not Found",
    });
  }

  data.animals.splice(animalIndex, 1);

  if (writeData(data)) {
    res.status(200).json({
      success: true,
      message: "Animal Deleted",
    });
  } else {
    res
      .status(500)
      .json({ success: false, message: "Error while Deleting Animal" });
  }
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
