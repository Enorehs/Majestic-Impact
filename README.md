# Majestic Impact - Gacha System made for the social media purpose for PAX Bengaluru 

A full-stack, mobile-first gacha web application designed for interactive street quests during the promotion of PAX Bengaluru. 

Users can spend "Tabi Coins" to roll for randomized, real-life quests ranging from common tasks to ultra-rare 5-star events. The application features a fully persistent cloud database to ensure user data remains safe and synchronized, even on the go.

## Tech Stack

**Frontend:**
* React (Vite)
* Tailwind CSS
* JavaScript (JSX)
* Deployed on **Vercel**

**Backend & Database:**
* Java 17
* Spring Boot (REST API, Spring Data JPA)
* PostgreSQL
* Docker (for containerized builds)
* Deployed on **Render**

## Features

* **Interactive Gacha Pulls:** Dynamic UI with animations for pulling randomized quests.
* **Persistent Economy:** Tabi Coin balances are securely saved and updated in real-time to a cloud PostgreSQL database.
* **"Cold-Start" Protection:** Custom loading states (`⏳`) prevent users from accidentally overwriting data while the backend server wakes up from sleep mode.
* **Secret Admin Panel:** Hidden interface to add or manage Tabi Coins on the fly during the promotion.

## Live Links
* **Frontend Application:** `https://pax-gacha-ui.vercel.app`
* **Backend API:** `https://pax-gacha-backend.onrender.com`

---

## Local Development Setup

If you wanna run this project on your local machine, here's how:

### Prerequisites
* [Node.js](https://nodejs.org/) installed
* [Java 17](https://adoptium.net/) installed
* [Maven](https://maven.apache.org/) installed
* A local PostgreSQL database running on port `5432`

