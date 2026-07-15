# CoursePro - Professional Course Registration Platform

A full-stack course registration platform built with Next.js, featuring a public website with course registration and a complete admin portal for managing courses, cities, days, registrations, and gallery images.

## Features

### Public Website

- **Navigation Bar**: Sticky navigation with links to Home, About, Services, Contact, and Admin portal
- **Home Page**:
  - Animated scrolling banner with promotional messages
  - Hero section with call-to-action buttons
  - Auto-rotating gallery carousel (main instructor photo + group photos)
  - Feature highlights section
  - CTA section to encourage registrations

- **About Page**: Company information, mission, and differentiators
- **Services Page**: Display of available courses with expandable details
- **Contact Page**: Contact information and contact form

### Registration System

Multi-step registration modal with validation:
1. **Course Selection**: Choose from available courses
2. **City Selection**: Select preferred city for training
3. **Day Selection**: Pick the training day/date
4. **Personal Information**: Enter name, email, phone, and address
5. **Success Confirmation**: Confirmation message displayed

### Admin Portal

**Authentication**:
- Secure login page with demo credentials
- Session-based authentication (localStorage in demo mode)
- Protected admin routes

**Dashboard**:
- Real-time statistics (courses, cities, days, registrations count)
- Quick action links
- Recent activity feed

**Management Sections**:
- **Courses**: Add, view, and delete courses
- **Cities**: Add/delete cities with CSV import/export functionality
- **Days**: Add/delete training days with date picker and CSV support
- **Registrations**: View all student registrations with detailed information and CSV export
- **Gallery**: Upload and manage main instructor photos and group photos

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI**: React 19 with Tailwind CSS
- **State Management**: Zustand
- **Animations**: Framer Motion
- **Carousel**: Embla Carousel
- **Icons**: Lucide React
- **Forms**: React Hook Form
- **Validation**: Zod
- **CSV Handling**: Papaparse

## Project Structure

```
/app
  /admin
    /login - Admin login page
    /dashboard
      /courses - Manage courses
      /cities - Manage cities
      /days - Manage training days
      /registrations - View registrations
      /gallery - Manage gallery images
  /about - About page
  /services - Services page
  /contact - Contact page
  layout.tsx - Root layout with navbar
  page.tsx - Home page

/components
  navbar.tsx - Main navigation component
  animated-banner.tsx - Scrolling banner
  gallery-carousel.tsx - Auto-rotating gallery
  registration-modal.tsx - Multi-step registration form
  admin-sidebar.tsx - Admin navigation sidebar

/lib
  store.ts - Zustand state management
```

## Getting Started

### Installation

1. Clone the repository
2. Install dependencies:
```bash
pnpm install
```

3. Run the development server:
```bash
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Demo Admin Login

- **Email**: admin@coursepro.com
- **Password**: admin123

## Usage

### For Users

1. Navigate to the home page
2. Click "Register Now" or "Register Today"
3. Follow the multi-step registration form:
   - Select a course
   - Select a city
   - Select a day/date
   - Enter personal information
4. Submit to complete registration
5. Confirmation message appears

### For Admins

1. Go to [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
2. Log in with demo credentials
3. Access dashboard with statistics
4. Manage courses, cities, days, registrations, and gallery

#### Key Admin Features

- **Add/Edit Items**: Click "Add" buttons to add new courses, cities, or days
- **CSV Import**: Upload CSV files to bulk import cities or days
- **CSV Export**: Download registrations or lists as CSV files
- **View Registration Details**: Click "Details" on any registration to view full information
- **Delete Records**: Remove any item with one click

## Data Management

### State Management

All data is managed using Zustand store (`/lib/store.ts`):
- Courses
- Cities
- Days
- Gallery images
- Student registrations

### Data Persistence

In the demo version, data is stored in-memory. For production use, integrate with:
- **Neon PostgreSQL** (recommended)
- **Supabase**
- **AWS Aurora**

## Customization

### Adding Navigation Links

Edit `components/navbar.tsx` to add/remove navigation items.

### Changing Colors

Colors are defined with Tailwind classes throughout the project. Key colors:
- Primary: `bg-blue-600`
- Success: `bg-green-600`
- Warning: `bg-purple-600`
- Error: `bg-red-600`

### Modifying Banner Message

Update the banner message in `app/page.tsx`:
```tsx
<AnimatedBanner message="Your custom message here" />
```

### Adding Gallery Images

In admin portal:
1. Go to Gallery management
2. Click "Add Image"
3. Enter image URL (supports public URLs or base64)
4. Select image type (Main Instructor or Group Photo)

## Future Enhancements

- Email confirmations (integration with Resend or SendGrid)
- Payment integration (Stripe)
- Student dashboard with registration history
- Attendance tracking
- Certificate generation
- Real database integration
- Advanced analytics
- Multi-language support

## API Endpoints (Ready for Integration)

The application is structured to easily add the following endpoints:
- `POST /api/register` - Submit student registration
- `GET /api/courses` - Get available courses
- `GET /api/cities` - Get available cities
- `GET /api/days` - Get available days
- `POST /api/admin/courses` - Create course
- `DELETE /api/admin/courses/[id]` - Delete course
- Similar endpoints for cities, days, registrations, and gallery

## Deployment

### Deploy to Vercel

1. Push code to GitHub
2. Connect repository to Vercel
3. Configure environment variables if needed
4. Deploy

```bash
vercel
```

### Build for Production

```bash
pnpm build
pnpm start
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is open source and available for personal and commercial use.

## Support

For issues or questions, please refer to the documentation or check the demo credentials for testing the admin portal.

---

**Note**: This is a demonstration version with in-memory data storage. For production use, integrate with a proper database backend and email service for confirmations.
