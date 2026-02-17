# TaskFlow - To-Do List Web Application

A modern, responsive To-Do List web application built with Node.js, Express, and Vanilla JavaScript.

## Features

✅ **Add Tasks** - Create new tasks with optional descriptions
✅ **Delete Tasks** - Remove tasks permanently  
✅ **Mark Complete** - Check off completed tasks
✅ **Edit Tasks** - Update task titles and descriptions
✅ **Filter Tasks** - View All, Pending, or Completed tasks
✅ **Persistent Storage** - Tasks saved in JSON file (survives server restart)
✅ **Modern UI** - Dark theme with smooth animations
✅ **Fully Responsive** - Works perfectly on mobile, tablet, and desktop
✅ **REST API** - Complete API for all operations

## Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript (ES6+)
- **Backend**: Node.js with Express.js
- **Storage**: JSON file-based (no database required)
- **Features**: CORS enabled, proper error handling

## Project Structure

```
to-do-app/
├── backend/
│   ├── server.js          # Express server & API routes
│   ├── package.json       # Backend dependencies
│   └── tasks.json         # JSON storage file
├── frontend/
│   ├── index.html         # HTML structure
│   ├── styles.css         # Modern dark theme styles
│   └── script.js          # Client-side logic
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js 14+ and npm installed
- Windows, macOS, or Linux

### Step 1: Install Backend Dependencies

```bash
cd backend
npm install
```

### Step 2: Start the Backend Server

```bash
npm start
```

You should see:
```
✅ To-Do API running on http://localhost:3000
📁 Tasks stored in: backend/tasks.json
```

### Step 3: Access the Frontend

Open your browser and go to:
```
http://localhost:3000
```

## API Endpoints

### GET /api/tasks
Retrieve all tasks

**Response:**
```json
[
  {
    "id": "timestamp-random",
    "title": "Buy groceries",
    "description": "Milk, eggs, bread",
    "completed": false,
    "createdAt": "2026-02-16T10:30:00.000Z",
    "updatedAt": "2026-02-16T10:30:00.000Z"
  }
]
```

### POST /api/tasks
Create a new task

**Request:**
```json
{
  "title": "Learn Node.js",
  "description": "Complete Express tutorial"
}
```

**Response:** Returns the created task object

### PUT /api/tasks/:id
Update a task

**Request:**
```json
{
  "title": "Updated title",
  "description": "Updated description",
  "completed": true
}
```

**Response:** Returns the updated task

### DELETE /api/tasks/:id
Delete a task

**Response:** Returns the deleted task

## Features Breakdown

### Frontend
- **Modern Dark Theme** - Professional, easy on the eyes
- **Responsive Design** - Mobile-first approach
- **Real-time Updates** - Instant UI feedback
- **Task Filtering** - All, Pending, Completed views
- **Statistics Bar** - Show total, remaining, and completed counts
- **Edit Modal** - Inline task editing
- **Keyboard Shortcuts** - ESC to close modal
- **Smooth Animations** - Professional transitions

### Backend
- **Express Server** - Lightweight and fast
- **CORS Enabled** - Allow cross-origin requests
- **JSON File Storage** - Simple, no database setup
- **Error Handling** - Proper HTTP status codes
- **Validation** - Input validation on all endpoints
- **Unique IDs** - Using timestamp + random string
- **Timestamps** - Track creation and update times

## Usage

1. **Add a Task**: Enter title in input box and click "Add"
2. **Add Description**: Optional field for task details
3. **Mark Complete**: Click checkbox to toggle completion
4. **Edit Task**: Click pencil icon to edit
5. **Delete Task**: Click trash icon to remove
6. **Filter**: Use filter buttons to show All/Pending/Completed

## Data Persistence

All tasks are automatically saved to `backend/tasks.json`. The file persists even after:
- Server restart
- Browser refresh
- Application crashes

Example tasks.json:
```json
[
  {
    "id": "1z0x1c2b3a",
    "title": "Learn Express",
    "description": "Build REST APIs",
    "completed": true,
    "createdAt": "2026-02-16T10:30:00.000Z",
    "updatedAt": "2026-02-16T11:45:00.000Z"
  }
]
```

## Troubleshooting

### Port 3000 already in use?
Change the port in `backend/server.js` line 8

### CORS Error?
The backend has CORS enabled by default

### Tasks not saving?
Check if `backend/tasks.json` exists and backend is running

### Frontend not loading?
Make sure you're accessing `http://localhost:3000` not `file://`

## Development Tips

- Check browser console for JavaScript errors
- Check terminal for server logs
- Use DevTools to inspect network requests
- Edit styles.css for UI customization
- Modify script.js for functionality changes

## License

Free to use and modify!

---

**TaskFlow** - Stay organized, stay productive! 📝✨
