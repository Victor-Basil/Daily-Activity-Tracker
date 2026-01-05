**Daily Activity Tracker app**:

This is a simple web based applicationto log and track daily activities.

How the Application Works

Add a task with a title (required), description (optional), date (required), and status (Planned, In Progress, Completed). Tasks are saved in the browser’s Local Storage, so they persist across page refreshes. On page load, all saved tasks are displayed. Users can edit the status of a task and delete tasks using the trash icon. The app also shows the total number of tasks added. Required fields are validated without using alert pop-ups.

Assumptions Made

The application assumes users will choose a status at creation but can also update it later. Task description is optional, and deleting a task is permanent. All data stays on the client side, and the app assumes a modern browser with Local Storage support.

Challenges Faced

The main challenges were keeping the delete button consistently positioned, validating forms without alerts, ensuring Local Storage logic works reliably, and styling the app professionally with a centered layout and consistent status colors.
