const express = require("express");
const morgan = require("morgan");
const app = express();
app.use(express.json());
morgan.token("body", (req) => JSON.stringify(req.body));

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);
const requestLogger = (request, response, next) => {
  console.log("Method:", request.method);
  console.log("Path:  ", request.path);
  console.log("Body:  ", request.body);
  console.log("---");
  next();
};
const cors = require("cors");

app.use(cors());
app.use(requestLogger);
let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/", (req, res) => {
  res.send("<h1>Hello this is a phonebook!</h1>");
});
app.get("/info", (req, res) => {
  const now = new Date();

  const fotmattedDate = now.toLocaleString("es-AR", {
    timeZone: "America/Argentina/Buenos_Aires",
    hour12: false,
  });
  res.send(
    `<p>Phonebook has info for ${persons.length} people, ${fotmattedDate}; </p>`
  );
});

app.get("/api/persons", (req, res) => {
  res.json(persons);
  console.log(persons);
});
app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find((p) => p.id === id);
  console.log(person);
  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
});
app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter((person) => person.id !== id);
  res.status(204).end();
});

const generateId = () => {
  //   const maxId = persons.length > 0 ? Math.max(...persons.map((p) => p.id)) : 0;
  const randomId = Math.floor(Math.random() * 1000);

  return randomId;
};
app.post("/api/persons", (req, res) => {
  const body = req.body;

  if (!body.name || !body.phone) {
    return res.status(400).json({ Error: "content missing " });
  }
  if (persons.find((p) => p.name === body.name)) {
    return res.status(400).json({ Error: "Name must be unique" });
  }

  const person = {
    id: generateId(),
    name: body.name,
    phone: body.phone,
  };
  persons = persons.concat(person);
  res.json(person);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
