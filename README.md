# 🦷 Dentura - Smart Dental Practice Management System

A modern, comprehensive dental practice management system built with Next.js, TypeScript, and Tailwind CSS. Streamline your dental practice with intelligent inventory management, appointment scheduling, and team collaboration tools.

![Dentura Preview](https://img.shields.io/badge/Status-Live-brightgreen)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-38B2AC)

## 🌟 Features

### 📦 Smart Inventory Management
- Track dental supplies and equipment
- Set low-stock alerts and automated reordering
- Manage supplier relationships and purchase orders
- Real-time inventory tracking with barcode support

### 📅 Appointment Scheduling
- Streamlined calendar system for patient appointments
- Automated reminders and notifications
- Multi-provider scheduling support
- Integration with patient management

### 👥 Team Management
- Invite team members with role-based permissions
- Manage practice staff and their access levels
- Track team performance and productivity
- Secure user authentication and authorization

### 📊 Analytics & Reports
- Comprehensive practice performance insights
- Revenue tracking and financial reports
- Patient statistics and treatment analytics
- Customizable dashboard with key metrics

### 🔒 Security & Compliance
- HIPAA-compliant platform ensuring patient data security
- End-to-end encryption for sensitive information
- Audit trails and compliance reporting
- Secure cloud infrastructure

### 🔗 Easy Integration
- Seamless integration with existing dental practice management systems
- API-first architecture for third-party integrations
- Export/import capabilities for data migration
- Webhook support for real-time updates

## 🚀 Live Demo

**🌐 [View Live Demo](https://dental-inventory-management-system.vercel.app)**

Experience the full functionality of Dentura with our interactive demo. No signup required for basic exploration.

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Authentication**: Custom auth system with role-based access
- **State Management**: React Context API
- **Icons**: Lucide React
- **Deployment**: Vercel
- **Version Control**: Git, GitHub

## 📱 Screenshots

### Landing Page
![Landing Page](https://via.placeholder.com/800x400/3B82F6/FFFFFF?text=Modern+Landing+Page+with+Animations)

### Dashboard
![Dashboard](https://via.placeholder.com/800x400/8B5CF6/FFFFFF?text=Comprehensive+Dashboard)

### Inventory Management
![Inventory](https://via.placeholder.com/800x400/06B6D4/FFFFFF?text=Smart+Inventory+Management)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm, yarn, or pnpm
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/connect-abdulbasit/Dental-Inventory-Management-System.git
   cd Dental-Inventory-Management-System
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
Dental-Inventory-Management-System/
├── app/                          # Next.js 14 App Router
│   ├── admin/                    # Admin panel pages
│   ├── api/                      # API routes
│   ├── appointments/             # Appointment management
│   ├── dashboard/                # Main dashboard
│   ├── inventory/                # Inventory management
│   ├── login/                    # Authentication pages
│   ├── orders/                   # Order management
│   ├── signup/                   # User registration
│   └── globals.css               # Global styles
├── components/                   # Reusable UI components
│   ├── ui/                       # shadcn/ui components
│   ├── admin/                    # Admin-specific components
│   ├── appointments/             # Appointment components
│   ├── dashboard/                # Dashboard components
│   ├── inventory/                # Inventory components
│   └── orders/                   # Order components
├── lib/                          # Utility functions and configurations
├── hooks/                        # Custom React hooks
└── public/                       # Static assets
```

## 🎨 Design System

### Color Palette
- **Primary Blue**: `#3B82F6` - Trust and professionalism
- **Secondary Purple**: `#8B5CF6` - Innovation and creativity
- **Accent Cyan**: `#06B6D4` - Freshness and clarity
- **Neutral Grays**: Various shades for text and backgrounds

### Typography
- **Headings**: Geist Sans (800 weight)
- **Body**: Geist Sans (400-600 weight)
- **Code**: Geist Mono

### Components
Built with shadcn/ui for consistent, accessible, and beautiful components.

## 🔐 Authentication

### Demo Credentials
- **Admin Access**: Use any email containing "admin" (e.g., `admin@dentura.com`)
- **Regular User**: Use any other email (e.g., `doctor@dentura.com`)
- **Password**: Any password works for demo purposes

### User Roles
- **Admin**: Full system access, user management, system settings
- **Dentist**: Patient management, appointments, treatment planning
- **Hygienist**: Appointment management, patient care
- **Assistant**: Inventory management, appointment support
- **Office Manager**: Administrative tasks, reporting

## 📊 Features Overview

### 🏠 Dashboard
- Real-time practice metrics
- Low-stock alerts
- Recent activity feed
- Quick action buttons
- Performance charts

### 📦 Inventory Management
- Product catalog with categories
- Stock level monitoring
- Automated reorder points
- Supplier management
- Purchase order tracking

### 📅 Appointments
- Calendar view with multiple providers
- Patient scheduling
- Appointment reminders
- Treatment planning
- Time slot management

### 👥 Team Management
- User invitation system
- Role-based permissions
- Team performance tracking
- Access control management

### 📈 Analytics
- Revenue tracking
- Patient statistics
- Treatment analytics
- Custom reports
- Export capabilities

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy with zero configuration

### Other Platforms
- **Netlify**: Compatible with static export
- **Railway**: Full-stack deployment
- **Docker**: Containerized deployment

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add some amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Development Guidelines
- Follow TypeScript best practices
- Use Tailwind CSS for styling
- Write meaningful commit messages
- Add tests for new features
- Update documentation

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [shadcn/ui](https://ui.shadcn.com/) - Beautiful UI components
- [Lucide](https://lucide.dev/) - Beautiful & consistent icon toolkit
- [Vercel](https://vercel.com/) - Deployment platform

## 📞 Support

- **GitHub Issues**: [Report bugs or request features](https://github.com/connect-abdulbasit/Dental-Inventory-Management-System/issues)
- **Email**: [Contact Support](mailto:support@dentura.com)
- **Documentation**: [Full Documentation](https://docs.dentura.com)

## 🌟 Star History

[![Star History Chart](https://api.star-history.com/svg?repos=connect-abdulbasit/Dental-Inventory-Management-System&type=Date)](https://star-history.com/#connect-abdulbasit/Dental-Inventory-Management-System&Date)

---

<div align="center">

**⭐ Star this repository if you found it helpful!**

Made with ❤️ by [Abdul Basit](https://github.com/connect-abdulbasit)

[🌐 Live Demo](https://dental-inventory-management-system.vercel.app) • [📖 Documentation](https://docs.dentura.com) • [🐛 Report Bug](https://github.com/connect-abdulbasit/Dental-Inventory-Management-System/issues) • [✨ Request Feature](https://github.com/connect-abdulbasit/Dental-Inventory-Management-System/issues)

</div>