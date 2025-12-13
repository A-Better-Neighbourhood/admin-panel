# Admin Panel - Issue Management System

A comprehensive admin dashboard for managing community reports with the same UI/UX as the user panel.

## Features

### 📊 Dashboard Overview

- Real-time statistics (Total, Pending, In Progress, Resolved reports)
- Recent activity feed
- Quick navigation to different sections

### 📝 All Reports Section

- View all community reports in a grid layout
- Advanced filtering by status (Pending, In Progress, Resolved, Archived)
- Search functionality across titles and descriptions
- Sort by: Most Recent, Oldest First, Most Upvoted
- Export reports to CSV
- Update report status directly from cards
- Delete reports with confirmation

### ⚠️ Priority Reports

- Automatically identifies high-priority reports based on:
  - High community engagement (upvotes)
  - Recent submissions
  - Pending action status
- Smart prioritization algorithm
- Quick action buttons for status updates

### ✅ Resolved Reports

- View all successfully resolved issues
- Search and filter capabilities
- Track resolution dates
- Option to reopen if needed

### 📦 Archived Reports

- View archived and duplicate reports
- Search functionality
- Restore or permanently manage archived items

## Setup Instructions

1. **Install Dependencies**

   ```bash
   cd admin-panel
   npm install
   ```

2. **Configure Environment**
   Create `.env.local` file:

   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3080/api
   ```

3. **Run Development Server**

   ```bash
   npm run dev
   ```

4. **Access Admin Panel**
   Open [http://localhost:3000/dashboard](http://localhost:3000/dashboard)

## Technologies Used

- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
