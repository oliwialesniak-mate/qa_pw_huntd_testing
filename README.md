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

## Prerequisites
- Node 18+
- Docker (if you want to run tests in Docker)
- A running Huntd application accessible from your machine (set `HUNTD_BASE_URL` accordingly)

## Install
```bash
git checkout -b task_solution
npm ci
npx playwright install
