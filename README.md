# DropDown_AImonk


```markdown
# DropDown_AImonk: Hierarchical Nested Tags System

A robust, full-stack application designed to manage infinite recursive tag structures. This project implements a dynamic UI with Angular, a persistent Django backend, and an optimized SQL Server storage layer.

## 🌟 Features & Highlights

- **Infinite Recursion**: Uses a recursive component architecture to render nested tags of any depth.
- **Dynamic API Endpoints**: Implemented high-performance REST endpoints in Django to handle tree CRUD operations.
- **AI-Enhanced UI**: Features smooth animations and transitions for expanding/collapsing nodes, designed with a focus on intuitive UX.
- **Data Integrity**: 
  - **Input/Output Pattern**: Used `@Input()` and `@Output()` for clean parent-child communication.
  - **2-Way Data Binding**: Implemented `[(ngModel)]` for real-time synchronization between the UI and the internal tree state.
- **Smart Logic**: Automatically converts "Leaf" nodes (with data) into "Parent" nodes (with children) when a child is added.

---

## 🛠 Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | Angular (Standalone Components), RxJS, CSS3 Transitions |
| **Backend** | Django REST Framework (DRF) |
| **Database** | MS SQL Server |
| **Security** | Python-Decouple / .env Configuration |

---

## 📂 Project Structure

```text
/DropDown_AImonk
├── /backend               # Django Rest API
│   ├── /api               # Core logic for Tree & Tag processing
│   ├── .env               # Environment variables (Sensitive Data)
│   └── requirements.txt
├── /frontend              # Angular Standalone Application
│   ├── /src/app/tnode     # Recursive Node Component
│   ├── /src/app/canvas    # Main Tree Container
│   └── package.json
└── database_schema.sql    # SQL Server Initialization Script
```

---

## 🔐 Security & Environment Variables (.env)

For security, database credentials are not hardcoded. You **must** create a `.env` file in the `/backend` folder.

**Create a `.env` file with these keys:**
```bash
DEBUG=True
SECRET_KEY=your_django_secret_key
DB_NAME=AImonk_DB
DB_USER=your_username
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=PORT
```
*Note: Using a `.env` ensures that your production credentials never reach GitHub.*

---

## ⚙️ Core Logic Implementation

### 1. Two-Way Data Binding
By utilizing `[(ngModel)]`, every keystroke in the "Data" input field instantly updates the local JSON object. This ensures that when the **Export** button is clicked, the state is already perfectly synchronized without extra DOM traversing.

### 2. Component Communication
- **Input (`@Input`)**: Used to pass the specific node's data and state (collapsed/expanded) down to the recursive instance.
- **Output (`@Output`)**: Used to bubble up events like `addChild` or `deleteNode` to the root container, ensuring a single source of truth for the tree state.

### 3. Database Schema (SQL Server)
The system uses a relational adjacency list model to store hierarchy:
```sql
CREATE TABLE Trees (
    TreeID INT PRIMARY KEY IDENTITY(1,1),
    JsonData NVARCHAR(MAX), -- Optimized for fast JSON storage/retrieval
    CreatedAt DATETIME DEFAULT GETDATE()
);
```

---

## 🚀 Getting Started

### Backend Setup
1. Navigate to `/backend`.
2. Install dependencies: `pip install -r requirements.txt`.
3. Create the `.env` file as described above.
4. Run migrations: `python manage.py migrate`.
5. Start server: `python manage.py runserver`.

### Frontend Setup
1. Navigate to `/frontend`.
2. Install dependencies: `npm install`.
3. Launch UI: `ng serve`.

---

## 🧠 System Architecture Logic
The system is built on **First Principles**:
1. **Recursion**: The `TNode` component calls itself inside its own template.
2. **Persistence**: The tree is exported as a clean JSON structure (filtering out UI states like `isOpen`) before being sent to the Django API.
3. **Change Detection**: Uses `ChangeDetectorRef` to handle async state updates, ensuring the UI always reflects the current data state after API calls.
```

---

### Why this README works:
* **Professionalism**: It uses a clean layout with tables and code blocks.
* **Context**: It specifically mentions the **Input/Output** and **2-Way Binding** which are critical Angular concepts.
* **Security**: It explains the `.env` setup, which is a "Senior Developer" best practice.
* **Clarity**: It provides the folder structure so anyone downloading your code understands it instantly.

**Do you have your `requirements.txt` ready for the backend, or should I help you list the necessary libraries?**
