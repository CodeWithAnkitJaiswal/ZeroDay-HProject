# Used Chatgpt for json making for initial data and used later on as a prompt that helped lovable


## ChatGpt Prompt - 

### 1st chat

1) i have to create a 60 days coding challenge for frontend devloper so i have to make a json with each day - topic, task, time taken and difficulty 
so create this

2) day phase topic subtopic task time difficulty these are good enough so make the json according to this

3) now for backend devlopement challenege 60 day json simillarly with same fields

4) simillarly for ai ml track

5) cyber security track

6) DSA track

### 2nd chatgpt chat - 

1) for the 60 days coding challange i devloped the 5 tracks for students and created their json now i have to create some students dummy profile json with all details like student name college socail media days completed longest streak days challeneges time at which he/she comepleted the challenge (to give night owl or early bird title), xp earned etc that we need in the json database

2) so make the 5-6 users profile json schema based on these

3) i also want some quorts that everytime user logins to dashboard shows to him about consistency works etc make them motivated to work and grow

4) yes good do like this for 60 days

5) yes make a complete json containg the quorts and these

6) ok make that json

## lovable prompts - 

1) uploaded 5 json created by chatgpt with propmts
Prompt

You are an expert Product Designer, UX Designer and Senior Frontend Engineer.

Build a complete mobile-first (390px) web application called ABTalks - 60 Days Coding Challenge.

The purpose of the platform is to help Indian college students become consistent developers by building every day for 60 days and maintaining a GitHub + LinkedIn streak.

The website should feel like a mix of Duolingo, GitHub, Notion, Linear and LeetCode, but designed for beginners.

The design must be modern, premium, minimal, colorful and highly motivating.

Tech Stack

Use

 React

 TypeScript

 TailwindCSS

 React Router

 Framer Motion

 Lucide Icons

 Recharts

 shadcn/ui

Store everything inside localStorage.

No backend.

No authentication.

Everything should work using mocked JSON.

Data

Use the provided JSON files.

There are five challenge tracks.

 Frontend

 Backend

 AI/ML

 Cyber Security

 DSA

Each track contains 60 days.

Every day contains

 day

 phase

 topic

 subtopic

 task

 difficulty

 time

Also use the motivational messages JSON to display random dashboard messages.

The challenge data follows the same structure for all five tracks (day, phase, topic, subtopic, task, time, difficulty).

Theme

Dark Theme

Accent Colors

Purple
Blue
Emerald
Orange

Rounded cards

Glassmorphism

Soft gradients

Smooth animations

Premium shadows

Fun micro interactions

Everything optimized for mobile first.

Desktop should simply scale beautifully.

LANDING PAGE (/)

This page should convince students to join the challenge.

Hero Section

Large heading

Example

Become Job Ready in Just 60 Days

or

One Commit Every Day.
One Better Developer Every Day.

Subtitle

Explain the challenge in two lines.

CTA

Primary

Start Challenge

Secondary

View Tracks

Background

Animated gradients

Floating code snippets

Moving blobs

Github icons

LinkedIn icons

Stars

Hero Statistics

Show animated cards

25,000+ Students

1,20,000+ GitHub Commits

60 Days

5 Career Tracks

95% Completion Satisfaction

How It Works

Beautiful timeline

Step 1

Choose Track

Step 2

Complete Today's Task

Step 3

Push GitHub Commit

Step 4

Share LinkedIn Post

Step 5

Build Portfolio

Step 6

Get Recruiter Visibility

Tracks Section

Five beautiful cards

Frontend

Backend

AI ML

Cyber Security

DSA

Each card includes

Icon

Description

Skills learned

Difficulty

Projects

Duration

Start button

Benefits Section

Cards

Consistency

Portfolio

Resume

GitHub

LinkedIn

Projects

Career Growth

Interview Preparation

Certificates

Community

Leaderboard Preview

Top 5 students

Avatar

Name

Track

Current Streak

XP

Level

Testimonials

Carousel

Student image

College

Review

Stars

Community Statistics

Animated counters

Students Joined

Projects Built

GitHub Commits

LinkedIn Posts

Daily Active Students

Countries

FAQ

Accordion

Footer

Useful Links

Contact

Discord

LinkedIn

GitHub

Instagram

LOGIN PAGE

There is NO authentication.

Instead provide

"Continue as Demo Student"

Show 6 beautiful profile cards.

Each profile should come from dummy JSON.

Each student belongs to a different track.

Include

Image

Name

College

Track

Current Day

Streak

XP

Level

Clicking profile loads it into localStorage.

Also provide

Create New Profile

CREATE PROFILE

Initially ask only

Name

Email

Track

After clicking Continue

Create profile.

Redirect to Dashboard.

Dashboard should immediately show

Profile Completion

Example

Profile Completion

18%

Now ask users gradually to complete profile.

Fields

Photo

College

Year

Branch

City

Github

LinkedIn

Bio

Skills

Goals

Preferred Coding Time

Phone

Gender

Experience

Each completed field increases percentage.

Gamify this.

Example

Complete profile to unlock

🏆 Special Badge

DASHBOARD

This is the most important screen.

Greeting

Morning

Afternoon

Evening

Random personalized motivational message.

Use dashboardMessages JSON.

Example

Good Evening Ankit

"Consistency is stronger than motivation."

Top Summary Cards

Current Day

Current Streak

Longest Streak

XP

Level

Rank

Challenge Completion

Profile Completion

Progress Ring

Circular progress

Day 18

30%

Today's Challenge

Large card

Show

Topic

Phase

Difficulty Badge

Estimated Time

Subtopics

Task Description

Start Button

Today's Checklist

Checkboxes

Watch lesson

Complete task

Push GitHub

Write LinkedIn Post

Reflect

Each checkbox updates progress.

Daily Submission

GitHub URL

LinkedIn URL

Notes

Upload Screenshot

Submit Button

Store locally.

Submission Rules

Students can only submit

Current Day

Old days

Locked

Future days

Locked

60 Day Timeline

Beautiful vertical timeline.

Each day card

Completed

Current

Upcoming

Locked

Missed

Icons

Check

Fire

Clock

Lock

Achievements

Show badges

First Commit

7 Day Streak

15 Day Streak

30 Day Streak

45 Day Streak

60 Day Legend

Night Owl

Weekend Warrior

LinkedIn Machine

GitHub Beast

Early Bird

XP System

Award XP

Task Complete

100 XP

GitHub

50 XP

LinkedIn

50 XP

Reflection

20 XP

Profile Complete

10 XP

Daily Login

5 XP

Levels

1

Beginner

2

Builder

3

Developer

4

Engineer

5

Creator

6

Master

7

Legend

Charts

Weekly Activity

Contribution Heatmap

XP Progress

Streak History

Completion %

Challenge Calendar

GitHub contribution style calendar.

Green squares.

Daily Quote

Random from JSON.

Leaderboard Widget

Top 10

Upcoming Milestone

Only 2 Days left to unlock

15 Day Badge

Challenge Page (/day/:day)

If

day == current day

Allow submission.

Otherwise

Disable submission.

Show

Day Number

Phase

Topic

Difficulty

Time

Subtopics

Learning Objectives

Task

Resources

Tips

Common Mistakes

Expected Output

Submission Area

Github URL

LinkedIn URL

Screenshot

Reflection

Submit

Previous Day

Next Day

Buttons

Lock Logic

Future Days

Locked

Past Days

Read only

Only Current Day editable

Empty States

Design beautiful empty states.

Examples

No Profile

No Streak

Missed Day

No Submission

No GitHub

No LinkedIn

No Achievements

Gamification

Fire animation

Confetti

XP

Level Up animation

Daily Reward

Spin Wheel (daily)

Mystery Badge

Daily Challenge

Weekly Goal

Monthly Champion

Notifications

Daily Reminder

Streak Warning

Profile Completion Reminder

Today's Task Ready

Badge Unlocked

Settings

Dark Mode

Reminder Toggle

Notification Toggle

Email Reminder Toggle

Preferred Coding Time

Track Info

Logout

Reset Progress

Additional Feature (Important)

Create a "Journey Map" screen that visually divides the 60-day challenge into four milestones:

Days 1–15: Foundation

Days 16–30: Skill Building

Days 31–45: Project Development

Days 46–60: Portfolio & Career

Each milestone should display:

 Progress percentage

 Unlock rewards

 Completion badge

 Motivational message

 Estimated remaining days

LocalStorage Structure

Store

user

profile

track

currentDay

completedDays

streak

longestStreak

xp

level

leaderboard

dailySubmissions

settings

achievements

checklists


UX Requirements

Everything should feel

 premium

 modern

 addictive

 motivating

 smooth

 clean

No boring tables.

Everything should be visual.

Use animations everywhere but keep performance excellent.

The application should feel like a real product ready for thousands of students.

At the end, generate a clean folder structure, reusable components, custom hooks, utility functions, routing setup, sample localStorage initialization, and fully responsive pages optimized for a 390px mobile viewport first, with desktop enhancements layered on top.

no don't make very much differnet pages just use 3 routes with all content change the prompt

Perfect. Since the challenge only evaluates these three routes:

/
/dashboard
/day/12

the entire experience should live inside these three pages. No separate login, profile, leaderboard, settings, or tracks pages. Instead, use bottom sheets, modals, drawers, accordions, and sections inside these three routes.

Here's a much better prompt.

ABTalks 60 Days Coding Challenge

Design and build a mobile-first (390px) web application for the ABTalks 60 Days Coding Challenge.

The application will only contain these three routes:

/
/dashboard
/day/12

Everything must happen inside these three routes.

No additional pages.

Use React + TypeScript + TailwindCSS + React Router + Framer Motion + shadcn/ui.

Use only localStorage.

No backend.

No authentication.

Use mocked JSON files.

The provided JSON files contain:

 Frontend Challenge (60 Days)

 Backend Challenge (60 Days)

 AI/ML Challenge (60 Days)

 Cyber Security Challenge (60 Days)

 DSA Challenge (60 Days)

 Dashboard motivational messages.

Design Style

The application should feel like a combination of

 Duolingo

 GitHub

 Notion

 Linear

Premium.

Clean.

Modern.

Gamified.

Minimal.

Highly animated.

Dark mode.

Mobile First (390px).

ROUTE 1

/

This page should convince a completely new student to join the challenge.

Hero

Large motivating heading

Examples

Become Job Ready in 60 Days

Build Every Day.
Get Hired Faster.

Subtitle explaining

 Daily coding

 GitHub commits

 LinkedIn posts

 Portfolio building

 Consistency

Large CTA

Start 60 Day Challenge

Statistics

Animated counters

 Students Enrolled

 GitHub Commits

 LinkedIn Posts

 Projects Built

 Completion Rate

How It Works

Horizontal timeline

Choose Track

↓

Complete Today's Task

↓

Push GitHub

↓

Post on LinkedIn

↓

Build Portfolio

↓

Become Recruiter Ready

Tracks

Five beautiful cards

 Frontend

 Backend

 AI/ML

 Cyber Security

 DSA

Each card shows

 icon

 description

 duration

 difficulty

Benefits

Cards

 Build Portfolio

 Daily Consistency

 GitHub Growth

 LinkedIn Visibility

 Interview Preparation

 Resume Projects

 Community

 Recruiter Visibility

Leaderboard Preview

Top 5 students

Avatar

XP

Streak

Track

Student Testimonials

Beautiful carousel.

FAQ

Accordion.

Start Challenge Button

When clicked

Open a bottom sheet/modal.

NOT another page.

Inside modal

Show

Continue as Demo Student

Display 5-6 dummy student profiles (from JSON).

OR

Create New Profile

New profile initially asks only

 Name

 Email

 Track

Click Continue

Save to localStorage

Navigate to

/dashboard

ROUTE 2

/dashboard

This should feel like a productivity dashboard.

Everything personalized.

Header

Greeting

Good Morning

Good Afternoon

Good Evening

Random motivational message from the provided dashboard messages JSON.

Example

"Consistency is stronger than motivation."

Profile Card

Show

Avatar

Name

Track

Current Day

XP

Level

Current Streak

Longest Streak

Rank

Profile Completion %

If profile completion isn't 100%, show a progress bar and a Complete Profile button that opens a modal (not a new page).

The profile completion modal should allow users to add:

 College

 Year

 Branch

 City

 GitHub

 LinkedIn

 Bio

 Skills

 Goals

 Preferred Coding Time

 Photo

Each completed field increases profile completion percentage.

Challenge Progress

Beautiful circular progress

Example

Day 18

30%

Also show

18 / 60 Days Completed

Today's Task Card

Automatically load today's task based on selected track JSON.

Display

 Phase

 Topic

 Difficulty

 Time Required

 Task

 Subtopics

Use the selected track's JSON data structure for all task information.

Large button

Open Today's Challenge

Navigate to

/day/{currentDay}

Today's Checklist

Interactive checkboxes

 Read Topic

 Complete Task

 Push GitHub Commit

 Publish LinkedIn Post

 Reflection

Checking items updates progress automatically.

Weekly Progress

Simple chart

XP

Completion

Streak

Journey

Show four milestone cards

Days 1–15

Foundation

Days 16–30

Skill Building

Days 31–45

Projects

Days 46–60

Portfolio

Current milestone highlighted.

Achievements

Badges

 First Commit

 7 Day Streak

 15 Day Streak

 30 Day Streak

 60 Day Legend

Leaderboard Widget

Top 10 students.

Daily Quote

Random quote every refresh from the provided motivational messages JSON.

Bottom Navigation

Only three tabs

Home
Dashboard
Today's Challenge

ROUTE 3

/day/12

This page displays a challenge day.

For demo purposes, /day/12 should always render Day 12, but the component should support dynamic days internally.

Display

Large Day Badge

Day 12

Then show

 Phase

 Topic

 Difficulty

 Estimated Time

 Subtopics

 Task Description

Use the selected track's JSON for the content.

Learning Checklist

Checkboxes

Understand Topic

Finish Task

Test Project

Commit Code

Publish LinkedIn

Reflect

Submission Card

GitHub Repository / Commit URL

LinkedIn Post URL

Screenshot Upload

Reflection Notes

Submit Button

Store in localStorage.

Submission Rules

Only allow submissions if the opened day equals the student's current day.

If viewing a previous day:

 show submitted data in read-only mode.

If viewing a future day:

 show a locked state with a message:

Complete previous days to unlock this challenge.

Navigation

Previous Day

Next Day

Buttons

Future days remain locked until unlocked.

Edge Cases

Handle gracefully:

 New user with no progress

 No streak yet

 Missed a day

 Empty profile

 No submissions

 Locked future day

 Completed challenge

LocalStorage

Store

user
track
currentDay
completedDays
profile
profileCompletion
streak
longestStreak
xp
level
dailySubmissions
checklists
achievements

Additional UX Requirement

Introduce one thoughtful feature that improves student consistency. For example:

 A daily motivational card.

 "You're only one task away from maintaining your streak."

 A streak freeze earned after milestone completion.

 A celebration animation when a day is completed.

The final UI should feel polished, premium, and production-ready while keeping the entire experience contained within only three routes: /, /dashboard, and /day/12.


2) the dashboard ui is not good use colourful graphs and data clearly and the space is too much empty left right that also not looking good change that also and add dark light mode feature with colour optiins in settings that stores in local storage and dark light is according to system by default.

3) i need some changes in this, as it has some bugs and issues you need to solve 1st issue that right side day count chart goes below that we need to hold that there after that full screen element comes also make that squres numbered the days and if user has any missed day then show that with red and this will also make clickable to open that day task details and submisiion and submitted details also update that our static data with few of the missed days of some users and also add their dummy submissions like if i'm going back on previous days it shows no submission but that day is completed fro that user so make our data changes accordinglyand user better profile pics for users lndians also give the dark and light mode option on home page the quorte and the block with user details is also not that good fix it also the ui part

4) yes create export report - give day option week option and complete till now option that generate report and also give linkeding postable post with copy button and the 60 days split card chart in dark mode when hovered show text in black color that is not readable aslo add which time the task is completed most accordingly give titles like night owl, early bird last minute rusher etc
also i want to make when user enter her github username that also shows their comits of the 60 days from starting from the day 1 to day 60 if possible using github api otherwise skip this feature.
another issue is on the home page if i'm already logged in and click start 60 days challange shows again to choose or create profile fix this also and in the setting of the dashbaord if i click and change the track that also stated from current day and my past track history comes to this fix this also

5) share report feature disapears in tablet and mobile view and can't able to find fix that and it should not break responsivenes of the website

6) improve these days streaks etc tiles desgin and also that share model desgin also need improvement

7) the journey has 4 parts at the top of profile make a small miniature of the candiate moving forward from day 1 to 60 and with the 4 milestones after each milestone make a sharable certificate by AB Talk 60 days coding Challange with acchivements etc

## Completed the project
