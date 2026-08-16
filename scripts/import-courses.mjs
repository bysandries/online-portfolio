#!/usr/bin/env node
/**
 * Imports the standardized "Course Info.tex" files (plain text) from
 * ../content/education/courses/ into config/courses.json for the education
 * page. Re-run whenever a Course Info.tex changes:
 *   node scripts/import-courses.mjs
 */
import { readdirSync, readFileSync, writeFileSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const COURSES_DIR = join(here, "..", "..", "content", "education", "courses");
const OUT = join(here, "..", "config", "courses.json");

const TERM_ORDER = [
  "Fall 2023", "Winter 2024", "Spring 2024", "Fall 2024", "Winter 2025",
  "Spring 2025", "Summer 2025", "Fall 2025", "Winter 2026", "Spring 2026",
];

function field(text, name) {
  const m = text.match(new RegExp(`^${name}: (.+)$`, "m"));
  return m ? m[1].trim() : "";
}

/** Lines following "<name>:" until the first blank line. */
function block(text, name) {
  const b = text.split(/\n\n+/).find((x) => x.startsWith(name + ":"));
  return b ? b.split("\n").slice(1).map((l) => l.trim()).filter(Boolean) : [];
}

/** "- " starts a bullet; other lines are wrapped continuations of the previous one. */
function bullets(lines) {
  const out = [];
  for (const l of lines) {
    if (l.startsWith("- ")) out.push(l.slice(2));
    else if (out.length) out[out.length - 1] += " " + l;
  }
  return out;
}

const courses = [];
for (const dir of readdirSync(COURSES_DIR).sort()) {
  const path = join(COURSES_DIR, dir);
  if (!statSync(path).isDirectory()) continue;
  const tex = join(path, "Course Info.tex");
  let text;
  try {
    text = readFileSync(tex, "utf8");
  } catch {
    console.warn(`skip (no Course Info.tex): ${dir}`);
    continue;
  }

  const courseLine = field(text, "Course");
  const sep = courseLine.indexOf(" - ");
  const term = field(text, "Term Taken");
  const termKey = TERM_ORDER.find((t) => term.startsWith(t)) ?? term;
  const syllabus = field(text, "Syllabus");

  courses.push({
    code: sep === -1 ? courseLine : courseLine.slice(0, sep),
    title: sep === -1 ? "" : courseLine.slice(sep + 3),
    credits: field(text, "Credits"),
    grade: field(text, "Grade"),
    term,
    termKey,
    countsToward: field(text, "Counts Toward"),
    description: block(text, "Description").join(" "),
    outcomes: bullets(block(text, "Learning Outcomes")),
    topics: bullets(block(text, "Topics Covered")),
    tools: bullets(block(text, "Tools & Technologies")),
    syllabus: syllabus.startsWith("Not on file") ? null : syllabus,
  });
}

courses.sort(
  (a, b) =>
    TERM_ORDER.indexOf(a.termKey) - TERM_ORDER.indexOf(b.termKey) ||
    a.code.localeCompare(b.code),
);

writeFileSync(OUT, JSON.stringify({ courses }, null, 2) + "\n");
console.log(`Wrote ${courses.length} courses to config/courses.json`);
