# CareerGraph

CareerGraph is a graph-powered career matching application built with React, TypeScript, Express, and CognoDB.

The application connects candidates, skills, jobs, and companies and uses their relationships to find jobs that best match a candidate's skills.

## Why a Graph Database?

Career matching is a relationship-heavy problem.

A candidate has skills, jobs require skills, and companies offer jobs. A graph database allows these relationships to be stored and traversed directly.

For example:

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

The application performs multi-hop traversal such as:

Person → HAS_SKILL → Skill ← REQUIRES ← Job

This makes it straightforward to find jobs based on the skills connected to a candidate. The same query would require multiple joins and relationship tables in a relational database.

Data Model
Nodes
Person — name, location
Skill — name, category
Job — title
Company — name
Relationships
Person -[:HAS_SKILL]-> Skill
Job -[:REQUIRES]-> Skill
Company -[:OFFERS]-> Job
Main Queries
Get Candidates
MATCH (person:Person)
RETURN person.name AS name, person.location AS location
ORDER BY person.name
Find Matching Jobs
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

The query is parameterized using $personName rather than concatenating user input into the Cypher query.

Seed Data

The repository includes a seed script that creates realistic data for:

People
Skills
Jobs
Companies
Candidate skills
Job requirements
Company/job relationships

Run the seed script with:

npm run seed
Setup
1. Create a CognoDB Instance

Create a free CognoDB instance at:

https://console.cognodb.com

Copy the connection URI and generated password.

2. Environment Variables

Create a .env file in the server directory:

NEO4J_URI=your-cognodb-uri
NEO4J_USERNAME=cognodb
NEO4J_PASSWORD=your-password
PORT=4000

The credentials must not be committed to GitHub.

3. Run the Backend
cd server
npm install
npm run seed
npm run dev
4. Run the Frontend

In another terminal:

cd client
npm install
npm run dev
Architecture
React + TypeScript
        │
        │ HTTP
        ▼
Express + TypeScript
        │
        │ Neo4j Driver / Bolt
        ▼
CognoDB
Screenshots

Screenshots of the working application are included below.

Candidate Selection

Add screenshot here.

Job Matching Results

Add screenshot here.

Hosted Demo

Add hosted application link here.

GitHub Repository

https://github.com/al-waheed/careergraph
```
