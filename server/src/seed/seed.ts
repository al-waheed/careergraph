// Populate database/create our initial graph data

import { driver } from "../db/neo4j.js";

type Skill = {
  name: string;
  category: string;
};

type Job = {
  title: string;
  company: string;
  skills: string[];
};

type Person = {
  name: string;
  location: string;
  skills: string[];
};

const skills: Skill[] = [
  { name: "React", category: "Frontend" },
  { name: "TypeScript", category: "Programming Language" },
  { name: "JavaScript", category: "Programming Language" },
  { name: "Node.js", category: "Backend" },
  { name: "Express.js", category: "Backend" },
  { name: "MongoDB", category: "Database" },
  { name: "PostgreSQL", category: "Database" },
  { name: "Git", category: "Tools" },
  { name: "Docker", category: "DevOps" },
  { name: "AWS", category: "Cloud" },
];

const jobs: Job[] = [
  {
    title: "Frontend Engineer",
    company: "TechFlow",
    skills: ["React", "TypeScript", "JavaScript", "Git"],
  },
  {
    title: "Backend Engineer",
    company: "DataCore",
    skills: ["Node.js", "Express.js", "MongoDB", "PostgreSQL"],
  },
  {
    title: "Full Stack Engineer",
    company: "InnovateHub",
    skills: ["React", "TypeScript", "Node.js", "Express.js", "MongoDB", "Git"],
  },
];

const people: Person[] = [
  {
    name: "Alex Johnson",
    location: "Lagos, Nigeria",
    skills: ["React", "TypeScript", "JavaScript", "Git"],
  },
  {
    name: "David Williams",
    location: "Abuja, Nigeria",
    skills: ["Node.js", "Express.js", "PostgreSQL", "Git"],
  },
  {
    name: "Sarah Okafor",
    location: "Port Harcourt, Nigeria",
    skills: ["React", "TypeScript", "Node.js", "MongoDB"],
  },
];

async function seed() {
  const session = driver.session();

  try {
    // Clear the database while we are developing
    await session.run(`
      MATCH (n)
      DETACH DELETE n
    `);

    // Create skills
    for (const skill of skills) {
      await session.run(
        `
        MERGE (skill:Skill {name: $name})
        SET skill.category = $category
        `,
        {
          name: skill.name,
          category: skill.category,
        },
      );
    }

    // Create companies, jobs and relationships
    for (const job of jobs) {
      await session.run(
        `
        MERGE (company:Company {name: $company})
        MERGE (jobNode:Job {title: $title})
        MERGE (company)-[:OFFERS]->(jobNode)
        `,
        {
          company: job.company,
          title: job.title,
        },
      );

      // Connect jobs to required skills
      for (const skillName of job.skills) {
        await session.run(
          `
          MATCH (jobNode:Job {title: $jobTitle})
          MATCH (skill:Skill {name: $skillName})
          MERGE (jobNode)-[:REQUIRES]->(skill)
          `,
          {
            jobTitle: job.title,
            skillName,
          },
        );
      }
    }

	for (const person of people) {
	  await session.run(
		`
		MERGE (personNode:Person {name: $name})
		SET personNode.location = $location
		`,
		{
		  name: person.name,
		  location: person.location,
		}
	  );

	  // Connect people to their skills
	  for (const skillName of person.skills) {
		await session.run(
		  `
		  MATCH (personNode:Person {name: $personName})
		  MATCH (skill:Skill {name: $skillName})
		  MERGE (personNode)-[:HAS_SKILL]->(skill)
		  `,
		  {
			personName: person.name,
			skillName,
		  },
		);
	  }
	}	

    console.log("Seed completed successfully");
  } catch (error) {
    console.error("Seed failed:", error);
  } finally {
    await session.close();
    await driver.close();
  }
}

seed();
