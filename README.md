# Async Race — Test Project (Score: 395/400)

**Demo:** [https://white506.github.io/async-race/](https://white506.github.io/async-race/)

Async Race is an interactive racing application built as a test assignment.
It allows you to manage a collection of cars, control their engines, run races, and keep track of winners.
The project demonstrates clean architecture, strict TypeScript usage, and production-ready practices.

---

## Features

### Garage
- **Full CRUD for cars**: create, edit, delete
- **Color picker** with instant preview on the car icon
- **Random car generator**: 100 cars per click
- **Pagination**: 7 cars per page
- **Empty states**: "No Cars" message and auto-step back when the last car is removed

### Winners
- **Winners table**: car number, image, name, wins, best time
- **Sorting**: by wins and time (ascending/descending)
- **Pagination**: 10 winners per page

### Race
- **Start engine**: waits for velocity → animates the car → sends drive request
- **Stop engine**: car returns to starting position
- **Start/Reset race** for all cars on the page
- **Winner popup**: shown when the first car crosses the finish line
- **Dynamic button states**: disabled when not applicable
- **Full race control**: all actions (buttons, forms, pagination) are blocked during a race

---

## Technology Stack
- **React 19** + **TypeScript (strict mode)**
- **Zustand** for state management
- **SCSS** for styling
- **React Router** for navigation
- **ESLint (Airbnb config)** + **Prettier** for code quality

---

## Scoring Breakdown (395/400)
- **UI deployment to GitHub Pages** — 10/10
- **Commit & repo requirements** — 40/40
- **Basic structure** — 80/80
- **Garage view** — 90/90
- **Winners view** — 50/50
- **Race mechanics** — 170/170
- **ESLint + Prettier** — 10/10

**Final Score: 395/400** — all key functionality works as required.
