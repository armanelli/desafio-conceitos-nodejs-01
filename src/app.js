const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

function checkRepositoryExists(request, response, next) {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex((repository) => repository.id === id);

  if (repositoryIndex < 0) {
    return response.status(400).send({ message: "Repository does not exist." });
  }

  return next();
}

app.use("/repositories/:id", checkRepositoryExists);

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  };

  repositories.push(repository);

  return response.status(200).json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repositoryIndex = repositories.findIndex((repository) => repository.id === id);

  const existingRepository = repositories[repositoryIndex];

  const repository = {
    ...existingRepository,
    title,
    url,
    techs,
  };

  repositories[repositoryIndex] = repository;

  return response.status(200).send(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex((repository) => repository.id === id);

  repositories.splice(repositoryIndex, 1);

  return response.status(204).json({ message: "Repository deleted successfully." });
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex((repository) => repository.id === id);

  repositories[repositoryIndex].likes += 1;

  return response.status(200).send(repositories[repositoryIndex]);
});

module.exports = app;
