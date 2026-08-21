# CareerGraph

CareerGraph is a graph-powered job matching application that connects people, skills, jobs, and companies using CognoDB.

## Features

- View available candidates
- Match candidates with suitable jobs
- Calculate job match percentages based on required skills
- Display matching skills
- Connect companies with the jobs they offer
- Store career relationships in a graph database

## How It Works

CareerGraph models career data as a graph:

Person → HAS_SKILL → Skill

Job → REQUIRES → Skill

Company → OFFERS → Job

The application uses Cypher queries to traverse these relationships and determine which jobs best match a candidate's skills.

## Tech Stack

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS

### Backend

- Node.js
- Express
- TypeScript

### Database

- CognoDB
- Cypher
- Neo4j-compatible driver

## Project Structure

```text
careergraph/
├── client/
│   └── src/
│
├── server/
│   └── src/
│       ├── db/
│       │   └── neo4j.ts
│       ├── routes/
│       │   └── jobs.ts
│       └── server.ts
│
└── README.md
```
