import { test } from "node:test";
import assert from "node:assert/strict";
import { classifyLink, slug, suggestionEventName } from "../src/lib/linkEvents.ts";

const ORIGIN = "https://santiagoavilez.com";

test("slug normalizes text into a safe event suffix", () => {
  assert.equal(slug("Fulbbo Platform!"), "fulbbo_platform");
  assert.equal(slug("  ¿Qué hizo con IA?  "), "que_hizo_con_ia");
  assert.equal(slug("a".repeat(100)).length, 40);
});

test("slug never returns an empty suffix", () => {
  assert.equal(slug(""), "other");
  assert.equal(slug("你好"), "other");
  assert.equal(slug("¿?"), "other");
});

test("long texts that share a prefix do not collide", () => {
  const prefix = "what is santiago's experience with ".padEnd(60, "x");
  const a = slug(`${prefix} react`);
  const b = slug(`${prefix} astro`);
  assert.notEqual(a, b);
  assert.ok(a.length <= 40 && b.length <= 40);
});

test("pdf links are CV downloads with an aggregate and a per-source event", () => {
  assert.deepEqual(classifyLink("/Full_Stack_Santiago_Avilez_CV.pdf", ORIGIN, "nav"), [
    "cv_download",
    "cv_download_nav",
  ]);
});

test("pdf links with a query or hash are still CV downloads", () => {
  assert.deepEqual(classifyLink("/cv.pdf?v=2", ORIGIN, "hero"), ["cv_download", "cv_download_hero"]);
  assert.deepEqual(classifyLink("/cv.pdf#page=1", ORIGIN, "hero"), ["cv_download", "cv_download_hero"]);
  assert.deepEqual(classifyLink(`${ORIGIN}/cv.PDF`, ORIGIN, "about"), ["cv_download", "cv_download_about"]);
});

test("external pdfs are not CV downloads", () => {
  assert.deepEqual(classifyLink("https://example.com/paper.pdf", ORIGIN, "page"), [
    "external_link_click",
    "external_link_click_example_com",
  ]);
});

test("known suggestions get their own event, dynamic ones share a bounded name", () => {
  const known = ["Tell me about Fulbbo", "What's his work experience?"];
  assert.equal(suggestionEventName("Tell me about Fulbbo", known), "chat_suggestion_click_tell_me_about_fulbbo");
  assert.equal(suggestionEventName("Something the model invented", known), "chat_suggestion_click_dynamic");
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
