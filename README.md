# Smart College Attendance & Leave Management System

A DBMS mini project demonstrating a relational college attendance database and a small web interface.

## Features
- Student and subject CRUD examples
- Attendance marking and summary percentage
- Low-attendance query (< 75%)
- Student leave requests and status updates
- Primary keys, foreign keys, UNIQUE and CHECK constraints
- SQL JOINs, aggregation, and a summary view
- Stored procedures: `sp_get_student_attendance`, `sp_mark_attendance`
- Trigger: `trg_before_attendance_insert` to prevent invalid/duplicate attendance
- Transaction for batch attendance marking

## Technology Stack
- MySQL 8+
- Node.js + Express
- HTML, CSS, JavaScript
- `mysql2` driver
- Git/GitHub

## Project Contents
- `database/attendance_management.sql` — schema, constraints, sample data, view, procedures, trigger and example transaction
- `backend/server.js` — Express API and transaction logic
- `frontend/` — user interface
- `docs/er_diagram.png` — entity-relationship diagram
- `docs/DBMS_College_Attendance_Project_Report.pdf` — final report
- `docs/DBMS_College_Attendance_Project_Report.docx` — editable report
- `docs/sql_examples.sql` — example queries
- `screenshots/` — application screen examples

## Setup
1. Install MySQL 8+ and Node.js 18+.
2. In MySQL Workbench, run `database/attendance_management.sql`.
3. Copy `.env.example` to `.env` and update the MySQL connection values.
4. Run `npm install` in the project root.
5. Run `npm start`.
6. Open `http://localhost:3000`.

## Demo Accounts
The SQL script inserts demo users for admin, faculty and student roles. Demo passwords are included in the setup notes for local demonstration only; change them before any real deployment.

## Report and GitHub Submission
The report includes introduction, problem statement, objectives, ER diagram, database schema, normalization, technologies used, SQL queries/features, screenshots, conclusion and optional future scope. Before submission, publish the project to your own GitHub repository and replace the repository placeholder on the report cover with your repository URL.

## Notes
This project is intended for academic demonstration with sample data. It is not production-ready for real student information without additional security, authentication, authorization, validation and deployment hardening.
