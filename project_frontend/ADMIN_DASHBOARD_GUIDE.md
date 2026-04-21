# Admin Dashboard Guide

## Overview
The admin dashboard is a comprehensive management system for the TechKhor e-commerce platform. It provides admins with full control over sellers, customers, products, and categories.

## Features

### 1. Dashboard (/)
- Real-time statistics and key metrics
- Total users, sellers, customers, and products
- Platform statistics with visual charts
- Quick overview of pending approvals

### 2. Sellers Management (/sellers)
- View all sellers with filtering options
- **Pending Approval**: Sellers awaiting admin approval
- **Approved**: Active sellers on the platform
- Approve or reject seller applications
- Search sellers by name, email, or shop name

#### Key Actions
- **Approve**: Move seller from PENDING to APPROVED status
- **Reject**: Decline seller application

### 3. Customers Management (/customers)
- Comprehensive customer list and management
- **Active Customers**: Currently using the platform
- **Banned Customers**: Suspended accounts
- Ban customers for policy violations
- Unban previously banned customers
- Search functionality

#### Key Actions
- **Ban**: Suspend customer account (prevents access)
- **Unban**: Restore banned customer account

### 4. Products Management (/products)
- Review and approve seller products
- **Pending Review**: Products awaiting admin approval
- **Approved**: Live products on the platform
- **Rejected**: Declined products (not visible)
- **Removed**: Products flagged as fake/low quality

#### Key Actions
- **Approve**: Make product visible to customers
- **Reject**: Decline product listing (seller can resubmit)
- **Remove**: Flag product as fake or low quality (permanent)

### 5. Categories Management (/categories)
- Create and manage product categories
- Add category images and descriptions
- Edit existing categories
- Delete unused categories
- View product count per category

#### Key Actions
- **Add Category**: Create new product category
- **Edit**: Modify category details
- **Delete**: Remove category from platform

### 6. Settings (/settings)
Configure platform-wide settings:
- Platform name and support email
- Currency settings
- Commission percentage for sellers
- Price range limits for products
- Product approval requirements
- Maintenance mode
- New seller registration permissions

## API Integration

The admin dashboard integrates with the following backend endpoints:

### Statistics
- `GET /admin/statistics` - Platform statistics

### Sellers
- `GET /admin/sellers` - All sellers
- `GET /admin/sellers/pending` - Pending sellers
- `GET /admin/sellers/approved` - Approved sellers
- `POST /admin/sellers/approve` - Approve seller
- `POST /admin/sellers/reject/:sellerId` - Reject seller

### Customers
- `GET /admin/customers` - All customers
- `GET /admin/customers/active` - Active customers
- `GET /admin/customers/banned` - Banned customers
- `POST /admin/customers/ban` - Ban customer
- `POST /admin/customers/unblock/:customerId` - Unban customer

### Products
- `GET /admin/products` - All products
- `GET /admin/products/pending` - Pending products
- `GET /admin/products/approved` - Approved products
- `GET /admin/products/rejected` - Rejected products
- `GET /admin/products/removed` - Removed products
- `POST /admin/products/approve` - Approve product
- `POST /admin/products/reject` - Reject product
- `POST /admin/products/remove` - Remove product

### Categories
- `GET /admin/categories` - All categories
- `POST /admin/categories` - Create category
- `PUT /admin/categories/:id` - Update category
- `DELETE /admin/categories/:id` - Delete category

## Authentication
All admin endpoints require:
- Valid JWT token in `Authorization` header
- Admin role (ROLE_ADMIN)
- Tokens are stored in localStorage

## File Structure

```
app/
├── routes/
│   └── admin/
│       ├── __root.tsx           # Admin layout with sidebar
│       ├── index.tsx            # Dashboard
│       ├── sellers/
│       │   └── index.tsx        # Sellers management
│       ├── customers/
│       │   └── index.tsx        # Customers management
│       ├── products/
│       │   └── index.tsx        # Products management
│       ├── categories/
│       │   └── index.tsx        # Categories management
│       └── settings.tsx         # Settings page
└── components/
    └── admin/
        ├── DashboardCard.tsx    # Dashboard card component
        ├── StatisticsChart.tsx  # Statistics visualization
        ├── SellerTable.tsx      # Sellers table
        ├── CustomerTable.tsx    # Customers table
        ├── ProductTable.tsx     # Products table
        ├── CategoryTable.tsx    # Categories grid
        ├── CategoryModal.tsx    # Add/edit category modal
        └── index.ts             # Component exports
```

## Usage

### Access Admin Dashboard
1. Login with admin credentials
2. Navigate to `/admin`
3. Use sidebar to navigate between sections

### Approve a Seller
1. Go to Sellers → Filter "Pending"
2. Review seller details
3. Click "Approve" to accept seller
4. Seller receives approval notification

### Review Products
1. Go to Products → Filter "Pending Review"
2. Check product details and seller reputation
3. Click "Approve" (make visible) or "Reject" (seller can resubmit)
4. Use "Remove" on approved products if they're fake/low quality

### Create Category
1. Go to Categories
2. Click "Add Category"
3. Fill in name, description, and image URL
4. Click "Save"
5. Category available for product listings

### Manage Customer
1. Go to Customers
2. Find customer in list
3. Click "Ban" to suspend (prevents access)
4. Click "Unban" to restore access

## Status Values

### User Statuses
- **PENDING**: Awaiting approval
- **ACTIVE**: Full access
- **APPROVED**: Seller approved
- **REJECTED**: Application declined
- **BANNED**: Account suspended

### Product Statuses
- **PENDING**: Awaiting review
- **APPROVED**: Live on platform
- **REJECTED**: Not approved (can resubmit)
- **REMOVED**: Flagged as fake/low quality

## Best Practices

1. **Regular Monitoring**: Check pending approvals daily
2. **Quality Control**: Review products for authenticity
3. **Seller Vetting**: Check seller history before approval
4. **Customer Safety**: Ban sellers with complaints
5. **Category Management**: Keep categories clean and organized
6. **Settings**: Adjust commission based on platform needs

## Troubleshooting

### Cannot access admin dashboard
- Check JWT token validity
- Verify admin role in backend
- Clear browser cache and retry

### Approve/Reject not working
- Check network connection
- Verify token is still valid
- Check browser console for errors

### Mock data showing
- Ensure backend is running on port 3000
- Check API endpoints are correct
- Verify authentication token in localStorage

## Support
For issues or questions about the admin dashboard, contact the development team.
