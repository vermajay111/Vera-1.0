# Vera

**Tagline:** *Become a product of your word.*

Vera is a web application designed to help users strengthen accountability in personal relationships by tracking promises made to friends and family. The app allowed users to create a network of friends, propose promises with deadlines, and record completion status collectively. Each participant’s completion status contributed to a public profile metric, showing promises completed, started, or unfulfilled—effectively creating a transparent accountability system.

---

## Table of Contents

- [Motivation](#motivation)  
- [Features](#features)  
- [Tech Stack](#tech-stack)  
- [Architecture & Implementation](#architecture--implementation)  
- [Hosting & Deployment](#hosting--deployment)  
- [Challenges & Lessons Learned](#challenges--lessons-learned)  
- [Why Vera Was Shut Down](#why-vera-was-shut-down)  
- [Acknowledgements](#acknowledgements)  

---

## Motivation

The goal of Vera was simple: encourage people to **become a product of their word**. Many people struggle with accountability in their personal and professional lives, and I wanted to create a tool that made commitments transparent, trackable, and socially reinforced.  

The app was intended as a combination of gamification and social accountability.

---

## Features

- User authentication via **Django REST Framework + Simple JWT**  
- Friend network creation and management  
- Promise creation with deadlines and multiple participants  
- Collective tracking of promise completion statuses  
- Public profile metrics displaying promises **completed, started, or unfulfilled**  
- Backend automation using **Django Cron Jobs** to manage stale promises  
- Frontend built with **React** using **Shadcn UI**, with some components rewritten using AI for cleaner code and enhanced visuals  

---

## Tech Stack

**Backend:**  
- Python 3.x with **Django REST Framework**  
- JWT authentication with **Simple JWT**  
- **PostgreSQL** for production database  
- Django Cron Jobs tied to system cron for scheduled tasks  

**Frontend:**  
- **React** (functional components, hooks)  
- **Shadcn UI** for design system  
- Some components refactored with AI to improve readability and reduce redundancy  

**Deployment / Hosting:**  
- Hosted directly on an old personal computer  
- Tunnelled via **Cloudflare Tunnels**  
- Not containerized with Docker  
- Managed cron jobs at the OS level for stale promise cleanup  

---

## Architecture & Implementation Notes

- **Backend:** Django REST Framework handled API endpoints and JWT authentication. Cron jobs were used for promise maintenance. Codebase is messy due to rapid development and lack of focus on maintainability.  
- **Frontend:** React handled the UI. Shadcn UI provided base components, but many were modified or rebuilt to improve usability and visuals. AI-assisted refactoring helped improve readability but did not magically fix overall structure.  
- **Hosting:** Production environment ran on my personal machine. Cloudflare tunnels were used for public access. PostgreSQL handled persistence.  

**⚠️ Disclaimer:** This was an MVP. Code quality is poor, React components are large, and there is no proper serialization or production-ready structure. The messiness is entirely my fault, not AI.  

---

## Challenges & Lessons Learned

- **User adoption:** People prefer frictionless tools like text messaging. Vera added steps people weren’t willing to take.  
- **Gameability:** The system was vulnerable to fake accounts or manipulated metrics.  
- **Rapid iteration vs maintainability:** Speed of development came at the cost of clean, modular, and testable code.  
- **Real-world testing:** Conducted surveys and feedback loops. Learned the importance of aligning technical solutions with actual human behavior.  

**Skills strengthened:**  
- Full-stack web development (Django + React)  
- Rapid prototyping  
- Iterative design and UX research  
- Understanding of behavioral adoption patterns  

---

## Why Vera Was Shut Down

Despite the MVP being functional:  

1. **High friction:** Users reported that adding and tracking promises felt cumbersome compared to natural communication channels.  
2. **Security & integrity concerns:** Easy to create fake accounts and game the system.  
3. **Technical limitations:** Hosting on an old personal machine was unsustainable. Cron job and Cloudflare tunnel setup were fragile for scaling.  
4. **Lack of traction:** After beta testing and peer surveys, engagement was extremely low.  

**Verdict:** The product did not solve a real pain point in a way that users were willing to adopt. Closing Vera was necessary to focus on projects with higher impact potential.  

---

## Acknowledgements

- Feedback from peers, online communities, and expert advisors  
- Open-source tools: Django REST Framework, React, Shadcn UI  
- AI-assisted component refactoring  

---

## Notes

- This project is **not production-ready**  
- The codebase exists primarily as a learning artifact  
- Any reuse should assume you will need to refactor heavily  
