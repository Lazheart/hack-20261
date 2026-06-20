╭─lazheart@kon ~/Desktop/hack ‹main●› 
╰─$ tree .
.
├── backend
│   ├── deploy.sh
│   ├── serverless.yml
│   └── src
│       ├── events
│       │   ├── auth_events.py
│       │   └── business_events.py
│       ├── functions
│       │   ├── auth
│       │   │   ├── auth_authorizer.py
│       │   │   ├── auth_login.py
│       │   │   ├── auth_recovery.py
│       │   │   ├── auth_register.py
│       │   │   └── send_email.py
│       │   └── business
│       │       ├── create_business.py
│       │       ├── get_business.py
│       │       └── update_business.py
│       ├── services
│       │   ├── auth
│       │   │   ├── login.py
│       │   │   └── register.py
│       │   └── business
│       └── templates
│           ├── recovery.html
│           └── welcome.html
├── docs
├── frontend
│   ├── eslint.config.js
│   ├── index.html
│   ├── package.json
│   ├── public
│   │   ├── favicon.svg
│   │   └── icons.svg
│   ├── README.md
│   ├── src
│   │   ├── App.css
│   │   ├── App.tsx
│   │   ├── assets
│   │   │   ├── hero.png
│   │   │   ├── react.svg
│   │   │   └── vite.svg
│   │   ├── index.css
│   │   └── main.tsx
│   ├── tsconfig.app.json
│   ├── tsconfig.json
│   ├── tsconfig.node.json
│   └── vite.config.ts
├── LICENSE
└── README.md

16 directories, 35 files
