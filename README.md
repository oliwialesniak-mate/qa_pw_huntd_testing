# Task Description

To see the description of the task assignment [follow the link](https://github.com/mate-academy/qa_pw_huntd_testing/blob/main/TaskDescription.md).

# Repository Overview

This repository contains a test automation framework for the [Huntd](https://huntd.tech/) application testing.

# How to use this project

## Installation steps

To install the project follow the next steps:

1. Install Node.js.
2. Run the installation command in the project root.:

```bash
npm ci
```

3. Run the browsers installation in the project root.

```bash
npx playwright install
```

4. Install Allure commandline tool (Allure requires Java 8 or higher).

```bash
npm install -g allure-commandline
```

## How to run the tests

// TODO

## How to generate report

// TODO
# Huntd Playwright Test Suite

This repository contains automated UI and API tests for the Huntd application using Playwright, following OOP, Builder, Facade, and Composite patterns. It includes Allure reporting and can run locally, in Docker, or via GitHub Actions CI.

---

## Prerequisites

- Node.js 18+
- Docker (optional, for running tests in container)
- Allure CLI (optional, used for report generation; installed in Docker or CI)

---

## Installation

```bash
git clone <repo-url>
cd <repo-folder>
npm ci
npx playwright install
