# Welcome to Jammer!

Jammer is a full-stack recommendation application to connect users based on their mutual musical interests such as preferred genres, methods to make music, years of experience with music and other biographical data.

<details>
<summary>⚙️ Setup</summary>
<h1>Setup</h1>

Alternatively test the application at our [live website](https://match-me-20pb.onrender.com). \
**NB! Give the frontend and backend servers a minute to wake up!**

<ol>
<li>Clone the repository</li>

```bash
git clone https://gitea.kood.tech/andreberezin/match-me.git
```

<li>Move to the frontend directory</li>

```bash
cd match-me/client
```

<li>Install the dependencies</li>

```bash
npm install
```

<li>Set number of test users in .env file</li>

```bash
NUMBER_OF_USERS
```

<li>Run the application</li>

```bash
npm start
```

<li>Open the application</li>

[Go to localhost:5173](http://localhost:5173)

<li>Give it time to generate test users (see logs in the console). Enjoy!</li>


</ol>
</details>

<details>
<summary>🚀 Features</summary>
<h1>Features</h1>
<ul>
<li>Find you matches based on your preferences such as age, gender, location, years of experience, the types of genres you prefer, the way you prefer to make music and what goals you have.</li>
<li>See your current and pending connections</li>
<li>Remove or add connections as you wish</li>
<li>Check out your connections' profiles</li>
<li>Securely chat with your connections</li>
<li>See who is online or offline, who is currently typing you a message</li>
<li>Notifications for unread messages</li>
<li>Check your own profile</li>
<li>Change your preferences</li>
<li>Responsive designs for mobile and desktop</li>
<li>Swiping feature for mobile</li>
<li>Geolocation detects your location</li>
<li>Algorithm finds matches based on your location and the maximum radius you set</li>
</ul>
</details>

<details>
<summary>📖 User guide</summary>
<h1>User guide</h1>
<ul>
<li>Sign up in /register</li>
<li>Find matches in /recommendations</li>
<li>Chat in /chats</li>
<li>Check your own profile in /dashboard</li>
<li>See your connections in /connections</li>
</ul>
</details>

<details>
<h1>Tech stack</h1>
<summary>📱 Tech stack</summary>

### Backend
- ![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.4.1-green)
- ![Java](https://img.shields.io/badge/Java-17-orange)

### Frontend
- ![React](https://img.shields.io/badge/React-18.3.1-blue)
- ![Vite](https://img.shields.io/badge/Vite-6.0.5-yellow)
- ![React Router](https://img.shields.io/badge/React%20Router-7.1.3-purple)

### General Tools
- ![Docker](https://img.shields.io/badge/Docker-28.0.0-blue)
</details>
