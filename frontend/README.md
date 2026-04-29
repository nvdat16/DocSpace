# Frontend

React frontend for DocSpace.

## Suggested structure

```text
frontend/
├── public/               # Static files
├── src/
│   ├── assets/           # Images, icons, static resources
│   ├── components/       # UI components dùng chung
│   ├── context/          # React context (auth, theme, app state)
│   ├── features/         # Chức năng theo domain
│   │   ├── auth/         # Login, register, profile
│   │   ├── documents/    # List, upload, preview, details
│   │   ├── folders/      # Tree folders, move, rename
│   │   ├── search/       # Search UI, filters
│   │   ├── shares/       # Share dialog, public/internal links
│   │   ├── trash/        # Trash, restore, delete permanently
│   │   └── versions/     # Version history UI
│   ├── hooks/            # Custom hooks
│   ├── layouts/          # Main layout, auth layout
│   ├── pages/            # Route pages
│   ├── routes/           # Route config
│   ├── services/         # API clients, request wrappers
│   ├── utils/            # Helpers, constants
│   └── App.jsx / main.jsx
└── package.json
```

