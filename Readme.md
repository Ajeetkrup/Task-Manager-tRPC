# Task Manager with tRPC

A full-stack task management application built with React, TypeScript, and tRPC for type-safe API communication.

## What is tRPC?

tRPC is a TypeScript-first framework that allows you to build end-to-end type-safe APIs. It provides:

- **Type Safety**: Full TypeScript support from server to client
- **Auto-completion**: IntelliSense for all your API calls
- **Runtime Safety**: Automatic input validation with Zod
- **Developer Experience**: No code generation needed
- **Automatic Serialization**: JSON serialization without manual conversion

## Features

- ✅ View all tasks with real-time updates
- ➕ Add new tasks with validation
- ✏️ Edit existing tasks inline
- 🗑️ Delete tasks with confirmation
- 🔄 Optimistic updates and automatic cache invalidation
- 📱 Responsive design
- 🎨 Clean, modern UI

## Tech Stack

### Frontend (Client)
- **React 19** - UI framework with hooks
- **TypeScript** - Static type checking
- **TanStack Query (React Query)** - Data fetching, caching, and synchronization
- **tRPC React Query** - Type-safe API client integration
- **Vite** - Fast development build tool
- **CSS3** - Custom styling with modern features

### Backend (Server)
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **tRPC** - Type-safe API framework
- **tRPC Express Adapter** - Express integration
- **Zod** - Schema validation and type inference
- **TypeScript** - Type safety on the server
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

## Project Structure

```
task-manager/
├── client/                    # Frontend React application
│   ├── src/
│   │   ├── App.tsx           # Main React component with task management
│   │   ├── App.css           # Application styles
│   │   ├── main.tsx          # React app entry point
│   │   └── utils/
│   │       └── trpc.ts       # tRPC client configuration
│   ├── package.json          # Frontend dependencies
│   └── vite.config.ts        # Vite configuration
├── server/                   # Backend Express server
│   ├── src/
│   │   ├── index.ts          # Server entry point with tRPC router
│   ├── package.json          # Backend dependencies
│   └── tsconfig.json         # TypeScript configuration
└── README.md                 # Project documentation
```

## Installation & Setup

### Prerequisites
- Node.js (v22 or higher)
- npm or yarn

### 1. Clone the Repository
```bash
git clone <repository-url>
cd task-manager
```

### 2. Server Setup
```bash
cd server
npm install
```

**Install server dependencies:**
```bash
npm install express cors dotenv
npm install @trpc/server @trpc/express zod
npm install -D typescript @types/express @types/cors @types/node ts-node nodemon
```

**Start the server:**
```bash
npm run dev
```
Server runs on `http://localhost:4000`

### 3. Client Setup
```bash
cd client
npm install
```

**Install client dependencies:**
```bash
npm install react react-dom
npm install @trpc/client @trpc/react-query @tanstack/react-query
npm install -D typescript @types/react @types/react-dom vite
```

**Start the client:**
```bash
npm run dev
```
Client runs on `http://localhost:5173`

## API Endpoints

### tRPC Procedures

#### Queries (Read Operations)
- `getAllTasks()` - Get all tasks
- `getTaskById(id: string)` - Get a specific task by ID

#### Mutations (Write Operations)
- `addTask({ name, description, status })` - Create a new task
- `updateTask({ id, name?, description?, status? })` - Update existing task
- `deleteTask({ id })` - Delete a task

### REST Health Check
- `GET /api/health` - Server health status

## Data Model

```typescript
type Task = {
  id: string;
  name: string;
  description: string;
  status: string;
  timeStamp: string;
}
```

## Configuration

### Environment Variables
Create `.env` file in the server directory:
```env
PORT=4000
NODE_ENV=development
```

### Client Configuration
Update `client/src/utils/trpc.ts` for different server URLs:
```typescript
url: 'http://localhost:4000/trpc'  // Development
url: 'https://your-domain.com/trpc'  // Production
```

## Development Workflow

1. **Start the server** - Handles API requests and data management
2. **Start the client** - Provides the user interface
3. **Make changes** - Both client and server support hot reloading
4. **Type safety** - TypeScript will catch errors across the stack

## How tRPC Works in This Project

1. **Server defines procedures** - API endpoints with input/output validation
2. **Type inference** - Client automatically knows the API shape
3. **React Query integration** - Automatic caching, loading states, error handling
4. **Real-time sync** - Cache invalidation keeps UI updated

## Production Deployment

### Server Deployment
```bash
npm run build
npm start
```

### Client Deployment
```bash
npm run build
```

## Troubleshooting

### Common Issues

**tRPC client errors:**
- Ensure server is running on correct port
- Check CORS configuration
- Verify tRPC endpoint URL

**TypeScript errors:**
- Install all required type definitions
- Ensure server types are properly exported

**React Query issues:**
- Wrap app with both tRPC Provider and QueryClientProvider
- Check React Query version compatibility

## License

MIT License

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request