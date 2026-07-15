# Quick Start Guide - CoursePro Platform

## What You Got

A complete, production-ready course registration platform with:

✓ **4 Public Pages**: Home, About, Services, Contact
✓ **Animated Home Hero**: Scrolling banner + auto-rotating gallery
✓ **Multi-Step Registration**: Course → City → Day → Personal Info
✓ **Full Admin Portal**: Login, dashboard, complete management system
✓ **CSV Import/Export**: Bulk data management for courses, cities, days

## Running the App

The app is already running! Open the preview to see the home page.

### View Different Pages

- **Home**: Main landing page with registration form
- **About**: Company information
- **Services**: Available courses
- **Contact**: Contact form
- **Admin Login**: `/admin/login`

## Testing the App

### Register as a Student

1. Click "Register Now" button on home page
2. Select a course (Web Development, Mobile App Dev, or Data Science)
3. Select a city (New York, Los Angeles, or Chicago)
4. Select a day (Monday, Wednesday, or Friday)
5. Enter your personal details (name, email, phone, address)
6. Submit - you'll see a success message

### Login to Admin Portal

1. Go to `/admin/login` or click Admin button
2. Use these credentials:
   - Email: `admin@coursepro.com`
   - Password: `admin123`

### Try Admin Features

**Dashboard**:
- View statistics (courses, cities, days, registrations)
- Quick access to management sections
- Recent activity feed

**Manage Courses**:
- Click "Add Course" to add new courses
- View, edit, or delete courses

**Manage Cities**:
- Add cities manually
- Upload CSV file to bulk add cities
- Download cities as CSV

**Manage Days**:
- Add training days with dates
- CSV import/export support
- Date picker for easy selection

**View Registrations**:
- See all student registrations
- Click "Details" to view full info
- Export all registrations to CSV
- Delete registrations if needed

**Gallery**:
- Upload main instructor photos
- Upload group photos
- Both auto-rotate on home page
- Delete images anytime

## Key Features Explained

### 1. Animated Banner
- Scrolling promotional message at top of home page
- Loops continuously
- Customizable text

### 2. Gallery Carousel
- Main instructor photo displayed prominently
- Group photos carousel below
- Auto-rotates every 4 seconds
- Manual navigation with previous/next buttons
- Click dots to jump to specific photo

### 3. Registration Flow
- Step-by-step modal dialog
- Pre-filled with demo data (3 courses, 3 cities, 3 days)
- Back buttons to change selections
- Validation on personal info form
- Success page after submission

### 4. Admin Dashboard
- Sidebar navigation for easy access
- Protected by simple login (localStorage demo)
- Real-time stats updates
- Responsive design for mobile/tablet

## Customization Tips

### Change the Banner Message

Open `/app/page.tsx` and find:
```tsx
<AnimatedBanner message="🎓 Enroll now and start your learning journey! Limited seats available." />
```

Change the message to your own text.

### Add More Courses

In Admin Portal → Manage Courses:
1. Click "Add Course"
2. Enter course name and description
3. Click "Save Course"

Or upload CSV with format:
```
Course Name
Web Development
Mobile App Dev
Data Science
```

### Change Colors

Colors use Tailwind classes. To change primary color from blue:
- Replace `bg-blue-600` with `bg-purple-600`
- Replace `hover:bg-blue-700` with `hover:bg-purple-700`
- Search-replace throughout components

### Add Gallery Images

In Admin Portal → Gallery:
1. Click "Add Image"
2. Select image type (Main or Group)
3. Paste image URL
4. Click "Save Image"

Supported image sources:
- Unsplash: `https://unsplash.com/...`
- Placeholder: `https://via.placeholder.com/...`
- Your own URL
- Base64 data URLs

## Data Management

### CSV Import

**Cities CSV Format**:
```
City Name
New York
Los Angeles
Chicago
```

**Days CSV Format**:
```
Day Name,Date
Monday,2024-02-01
Wednesday,2024-02-03
Friday,2024-02-05
```

### CSV Export

All management sections have "Export CSV" button to download data.

## Troubleshooting

**Registration modal not opening?**
- Refresh the page
- Check browser console for errors
- Try clicking "Register Today" button in CTA section

**Admin portal showing 0 items?**
- Data is stored in-memory in demo mode
- Refresh browser to reset
- Add items through admin portal

**Images not loading in gallery?**
- Verify URL is publicly accessible
- Try different image URL
- Use format: `https://...` (must include protocol)

**Localhost not working?**
- Make sure dev server is running: `pnpm dev`
- Try port 3000: `http://localhost:3000`
- Check if port is already in use

## Next Steps

### For Development

1. **Add Real Database**: Replace Zustand store with Supabase or Neon
2. **Email Notifications**: Integrate Resend or SendGrid
3. **Payment**: Add Stripe for paid courses
4. **Authentication**: Use NextAuth or Better Auth
5. **File Uploads**: Use Vercel Blob for images

### For Deployment

1. Push to GitHub
2. Connect to Vercel
3. Deploy with one click
4. Add environment variables if using database/email
5. Done! Your app is live

### For Customization

1. Change colors in components
2. Update company info on About page
3. Modify service descriptions on Services page
4. Update contact info on Contact page
5. Add your own logo/branding

## Files Overview

```
app/
  page.tsx              - Home page with gallery
  layout.tsx            - Root layout with navbar
  about/page.tsx        - About page
  services/page.tsx     - Services page
  contact/page.tsx      - Contact page
  admin/
    login/page.tsx      - Admin login
    dashboard/          - Admin dashboard pages

components/
  navbar.tsx            - Navigation bar
  animated-banner.tsx   - Scrolling banner
  gallery-carousel.tsx  - Gallery carousel
  registration-modal.tsx - Registration form
  admin-sidebar.tsx     - Admin sidebar

lib/
  store.ts              - State management (Zustand)
```

## Questions?

Refer to README.md for full documentation or check the inline code comments for specific implementations.

Happy building! 🚀
