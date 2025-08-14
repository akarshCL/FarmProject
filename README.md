# Farm Management System

A comprehensive farm management solution built with React, TypeScript, and modern web technologies.

## Core Features

### 1. Authentication & Authorization
- Secure login system with role-based access control
- User roles: Superadmin, Admin, and Supervisor
- Permission-based feature access
- Profile management with editable user details

### 2. Dashboard
- Real-time farm metrics and statistics
- Weather information with 5-day forecast
- Financial overview with revenue, expenses, and profit tracking
- Quick access to critical notifications
- Calendar widget for upcoming events

### 3. Inventory Management
- Track farm supplies and equipment
- Real-time stock monitoring
- Low stock alerts
- Categorized inventory items
- Stock history and usage patterns

### 4. Workforce Management
- Employee directory with detailed profiles
- Role and department management
- Attendance tracking
- Leave management
- Salary information
- Performance monitoring

### 5. CCTV Surveillance
- Live camera feeds
- Camera status monitoring
- Storage management
- Maintenance scheduling
- Alert system for security events

### 6. Vendor Management
- Vendor directory with contact information
- Purchase history tracking
- Document management
- Payment tracking
- Performance rating system

### 7. WhatsApp Integration
- Direct messaging with contacts
- Bulk message capabilities
- Message templates
- Scheduled messages
- Chat history

### 8. Financial Management
- Income and expense tracking
- Transaction history
- Financial reports
- Budget management
- Payment tracking

### 9. Settings & Preferences
- Profile settings
- Security settings
  - Two-factor authentication
  - Login alerts
  - Password management
- Notification preferences
- Language and regional settings
- System preferences

## Technical Features

### 1. Security
- Role-based access control (RBAC)
- Secure password handling
- Session management
- API security
- Data encryption

### 2. Real-time Updates
- WebSocket integration for live data
- Push notifications
- Real-time alerts
- Live monitoring

### 3. Data Management
- CRUD operations for all modules
- Data validation
- Error handling
- Data backup
- Audit logging

### 4. User Interface
- Responsive design
- Dark/Light mode
- Accessible components
- Interactive dashboards
- Form validation

### 5. Integration
- Weather API integration
- WhatsApp Business API
- Payment gateway integration
- Email service integration
- SMS service integration

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Environment Variables

Create a `.env` file with the following variables:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_WHATSAPP_API_URL=your_whatsapp_api_url
```

## Project Structure

```
src/
├── components/         # React components
│   ├── auth/          # Authentication components
│   ├── dashboard/     # Dashboard components
│   ├── inventory/     # Inventory management
│   ├── workforce/     # Employee management
│   ├── cctv/         # CCTV monitoring
│   ├── vendors/      # Vendor management
│   ├── whatsapp/     # WhatsApp integration
│   ├── finance/      # Financial management
│   └── settings/     # User settings
├── hooks/            # Custom React hooks
├── services/         # API services
├── store/           # State management
├── styles/          # CSS styles
└── types/           # TypeScript types
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.