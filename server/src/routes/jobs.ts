import { Router } from "express";
import { driver } from "../db/neo4j.js";

const router = Router();

router.get("/people", async (_req, res) => {
  const session = driver.session();

  try {
    const result = await session.run(`
      MATCH (person:Person)
      RETURN person.name AS name, person.location AS location
      ORDER BY person.name
    `);

    const people = result.records.map((record) => ({
      name: record.get("name"),
      location: record.get("location"),
    }));

    res.json(people);
  } catch (error) {
    console.error("Failed to fetch people:", error);

    res.status(500).json({
      message: "Failed to fetch people",
    });
  } finally {
    await session.close();
  }
});

router.get("/match/:personName", async (req, res) => {
  const session = driver.session();

  try {
    const personName = req.params.personName;

    const result = await session.run(
      `
  MATCH (person:Person {name: $personName})
    -[:HAS_SKILL]->(skill:Skill)
    <-[:REQUIRES]-(job:Job)

  WITH
  person,
  job,
  COLLECT(DISTINCT skill.name) AS matchingSkillNames,
  COUNT(DISTINCT skill) AS matchingSkills

  MATCH (company:Company)-[:OFFERS]->(job)
  MATCH (job)-[:REQUIRES]->(requiredSkill:Skill)

  WITH
  person.name AS person,
  company.name AS company,
  job.title AS job,
  matchingSkillNames,
  matchingSkills,
  COUNT(requiredSkill) AS totalRequiredSkills

  RETURN
  person,
  company,
  job,
  matchingSkillNames,
  matchingSkills,
  totalRequiredSkills,
  ROUND(
    (toFloat(matchingSkills) / totalRequiredSkills) * 100
  ) AS matchPercentage

  ORDER BY matchPercentage DESC
  `,
      { personName },
    );

    const jobs = result.records.map((record) => ({
      person: record.get("person"),
      company: record.get("company"),
      job: record.get("job"),
      matchingSkillsList: record.get("matchingSkillNames"),
      matchingSkills: Number(record.get("matchingSkills")),
      totalRequiredSkills: Number(record.get("totalRequiredSkills")),
      matchPercentage: Number(record.get("matchPercentage")),
    }));

    res.json(jobs);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      error: error,
    });
  } finally {
    await session.close();
  }
});

export default router;
