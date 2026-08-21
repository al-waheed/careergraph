# CareerGraph

CareerGraph is a graph-powered career matching application built with **React, TypeScript, Express, and CognoDB**.

The application connects candidates, skills, jobs, and companies through a graph data model and uses those relationships to identify jobs that best match a candidate's skills.

## Live Demo

**Hosted Application:**
https://careergraphy.netlify.app/

**GitHub Repository:**
https://github.com/al-waheed/careergraph

## Why a Graph Database?

Career matching is a relationship-heavy problem.

A candidate has skills, jobs require skills, and companies offer jobs. A graph database allows these relationships to be stored and traversed directly.

The core relationship is:

```text
Person
  │
  └── HAS_SKILL ──→ Skill
                       ↑
                       │
                    REQUIRES
                       │
                      Job
                       ↑
                       │
                     OFFERS
                       │
                    Company
```

For example, the application performs a multi-hop traversal:

```text
Person → HAS_SKILL → Skill ← REQUIRES ← Job
```

This makes it straightforward to discover jobs based on the skills connected to a candidate. In a relational database, the same operation would require multiple joins and relationship tables.

## Data Model

### Nodes

| Node        | Properties     |
| ----------- | -------------- |
| **Person**  | name, location |
| **Skill**   | name, category |
| **Job**     | title          |
| **Company** | name           |

### Relationships

```text
Person  -[:HAS_SKILL]->  Skill

Job     -[:REQUIRES]->   Skill

Company -[:OFFERS]->     Job
```

## Main Queries

### Get Candidates

```cypher
MATCH (person:Person)
RETURN person.name AS name, person.location AS location
ORDER BY person.name
```

### Find Matching Jobs

```cypher
MATCH (person:Person {name: $personName})
  -[:HAS_SKILL]->(skill:Skill)
  <-[:REQUIRES]-(job:Job)

WITH person, job, COUNT(DISTINCT skill) AS matchingSkills

MATCH (job)-[:REQUIRES]->(requiredSkill:Skill)

WITH
  person.name AS person,
  job.title AS job,
  matchingSkills,
  COUNT(requiredSkill) AS totalRequiredSkills

RETURN
  person,
  job,
  matchingSkills,
  totalRequiredSkills,
  ROUND(
    (toFloat(matchingSkills) / totalRequiredSkills) * 100
  ) AS matchPercentage

ORDER BY matchPercentage DESC
```

The matching query uses a **parameterized `$personName`** rather than concatenating user input into the Cypher query.

## Seed Data

The repository includes a seed script that creates realistic sample data for:

* People
* Skills
* Jobs
* Companies
* Candidate skills
* Job requirements
* Company/job relationships

Run the seed script with:

```bash
npm run seed
```

## Architecture

```text
┌─────────────────────────────┐
│     React + TypeScript      │
│          Frontend           │
└──────────────┬──────────────┘
               │
               │ HTTP
               ▼
┌─────────────────────────────┐
│    Express + TypeScript     │
│           Backend           │
└──────────────┬──────────────┘
               │
               │ Neo4j Driver / Bolt
               ▼
┌─────────────────────────────┐
│          CognoDB            │
│       Graph Database        │
└─────────────────────────────┘
```

## Project Structure

```text
careergraph/
├── client/
│   └── src/
│
├── server/
│   └── src/
│       ├── db/
│       ├── routes/
│       ├── seed/
│       └── server.ts
│
├── netlify.toml
└── README.md
```

## Setup

### 1. Create a CognoDB Instance

Create a free CognoDB instance:

https://console.cognodb.com

Copy the connection URI and generated password.

### 2. Configure Environment Variables

Create a `.env` file inside the `server` directory:

```env
NEO4J_URI=your-cognodb-uri
NEO4J_USERNAME=cognodb
NEO4J_PASSWORD=your-password
PORT=4000
```

**Never commit database credentials to GitHub.**

### 3. Run the Backend

```bash
cd server
npm install
npm run seed
npm run dev
```

### 4. Run the Frontend

In another terminal:

```bash
cd client
npm install
npm run dev
```

The frontend will be available through the Vite development server.

## Screenshots

### Candidate Selection

The application allows users to select a candidate and explore their available job matches.

![Candidate Selection](/screenshots/Screenshot%202026-08-21%20at%2012.22.27.png)

### Job Matching Results

The application calculates and displays job matches based on the candidate's connected skills.

![Job Matching Results](/screenshots/Screenshot%202026-08-21%20at%2012.22.17.png)

## Hosted Application

**Live Demo:**
https://careergraphy.netlify.app/

The production frontend is hosted on **Netlify**, while the Express backend is hosted on **Render** and connected to the CognoDB graph database.

## Screen Recording

A short walkthrough demonstrating the application's candidate selection and job matching functionality is included with the submission.

## Technology Stack

* **Frontend:** React, TypeScript, Vite
* **Backend:** Node.js, Express, TypeScript
* **Database:** CognoDB
* **Database Driver:** Official Neo4j JavaScript Driver
* **Graph Query Language:** openCypher
* **Frontend Hosting:** Netlify
* **Backend Hosting:** Render
* **Version Control:** Git / GitHub

## Assignment Deliverables

* **GitHub Repository:** https://github.com/al-waheed/careergraph
* **Hosted Application:** https://careergraphy.netlify.app/
* **Screen Recording:** Included with the submission
* **Screenshots:** Included above
