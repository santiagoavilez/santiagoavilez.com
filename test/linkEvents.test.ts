import { test } from "node:test";
import assert from "node:assert/strict";
import { classifyLink, slug } from "../src/lib/linkEvents.ts";

const ORIGIN = "https://santiagoavilez.com";

test("slug normalizes text into a safe event suffix", () => {
  assert.equal(slug("Fulbbo Platform!"), "fulbbo_platform");
  assert.equal(slug("  ¿Qué hizo con IA?  "), "qu_hizo_con_ia");
  assert.equal(slug("a".repeat(100)).length, 40);
});

test("pdf links are CV downloads with an aggregate and a per-source event", () => {
  assert.deepEqual(classifyLink("/Full_Stack_Santiago_Avilez_CV.pdf", ORIGIN, "nav"), [
    "cv_download",
    "cv_download_nav",
  ]);
});

test("mailto links are email clicks", () => {
  assert.deepEqual(classifyLink("mailto:me@example.com", ORIGIN, "footer"), ["email_click"]);
});

test("social links are matched by hostname", () => {
  assert.deepEqual(classifyLink("https://github.com/santiagoavilez", ORIGIN, "footer"), [
    "social_click_github",
  ]);
  assert.deepEqual(classifyLink("https://www.linkedin.com/in/x/", ORIGIN, "footer"), [
    "social_click_linkedin",
  ]);
});

test("a social domain in the query string is not a social click", () => {
  assert.deepEqual(classifyLink("https://example.com/?u=github.com", ORIGIN, "page"), [
    "external_link_click",
    "external_link_click_example_com",
  ]);
});

test("a lookalike host is not a social click", () => {
  assert.deepEqual(classifyLink("https://notgithub.com/x", ORIGIN, "page"), [
    "external_link_click",
    "external_link_click_notgithub_com",
  ]);
});

test("internal project and blog pages are tracked", () => {
  assert.deepEqual(classifyLink("/projects/fulbbo/", ORIGIN, "page"), ["project_or_post_open"]);
  assert.deepEqual(classifyLink("/blog/post", ORIGIN, "page"), ["project_or_post_open"]);
});

test("other internal links and anchors produce no events", () => {
  assert.deepEqual(classifyLink("/", ORIGIN, "nav"), []);
  assert.deepEqual(classifyLink("#about", ORIGIN, "nav"), []);
});

test("malformed or non-http hrefs never throw", () => {
  assert.deepEqual(classifyLink("http://[bad", ORIGIN, "page"), []);
  assert.deepEqual(classifyLink("tel:+5491100000000", ORIGIN, "page"), []);
  assert.deepEqual(classifyLink("", ORIGIN, "page"), []);
});
