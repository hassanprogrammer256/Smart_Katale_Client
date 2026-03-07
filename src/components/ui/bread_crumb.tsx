import React from 'react';
import { Typography } from '@mui/joy';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaHome, FaShoppingCart, FaBox, FaUser, FaCog, FaSearch, FaTag, FaStore } from 'react-icons/fa';
import type { BreadcrumbItem, DynamicBreadcrumbProps } from '../../interfaces/ui.interfaces';

// Define breadcrumb mappings
const breadcrumbNameMap: Record<string, { name: string; icon: React.ReactNode }> = {
  '/': { name: 'Home', icon: <FaHome size={14} /> },
  '/shop': { name: 'Shop', icon: <FaShoppingCart size={14} /> },
  '/product': { name: 'Product', icon: <FaBox size={14} /> },
  '/cart': { name: 'Cart', icon: <FaShoppingCart size={14} /> },
  '/checkout': { name: 'Checkout', icon: <FaTag size={14} /> },
  '/account': { name: 'Account', icon: <FaUser size={14} /> },
  '/orders': { name: 'Orders', icon: <FaBox size={14} /> },
  '/settings': { name: 'Settings', icon: <FaCog size={14} /> },
  '/search': { name: 'Search', icon: <FaSearch size={14} /> },
  '/categories': { name: 'Categories', icon: <FaStore size={14} /> },
};

// Custom path mappings for dynamic routes
const dynamicPathMatchers = [
  {
    pattern: /^\/product\/(.+)$/,
    getBreadcrumb: (match: RegExpMatchArray) => ({
      name: decodeURIComponent(match[1]),
      icon: <FaBox size={14} />,
      path: match[0]
    })
  },
  {
    pattern: /^\/category\/(.+)$/,
    getBreadcrumb: (match: RegExpMatchArray) => ({
      name: decodeURIComponent(match[1]),
      icon: <FaStore size={14} />,
      path: match[0]
    })
  },
  {
    pattern: /^\/search\/(.+)$/,
    getBreadcrumb: (match: RegExpMatchArray) => ({
      name: `Search: "${decodeURIComponent(match[1])}"`,
      icon: <FaSearch size={14} />,
      path: match[0]
    })
  }
];


const DynamicBreadcrumb: React.FC<DynamicBreadcrumbProps> = ({
  homeIcon = <FaHome size={14} />,
  separator = <span className="separator">/</span>,
  maxItems = 0, // 0 means no limit
  showHome = true,
  capitalizeItems = true,
  replaceMap = {}
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Generate breadcrumb items from pathname
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const pathnames = location.pathname.split('/').filter(x => x);
    const breadcrumbs: BreadcrumbItem[] = [];

    // Always start with home if showHome is true
    if (showHome) {
      breadcrumbs.push({
        name: 'Home',
        path: '/',
        icon: homeIcon
      });
    }

    // Build cumulative path and generate breadcrumbs
    let currentPath = '';
    
    pathnames.forEach((segment, _index) => {
      currentPath += `/${segment}`;
      
      // Check if this is a dynamic route
      const fullPath = currentPath;
      let matched = false;

      // Try to match against dynamic patterns
      for (const matcher of dynamicPathMatchers) {
        const match = fullPath.match(matcher.pattern);
        if (match) {
          const dynamicItem = matcher.getBreadcrumb(match);
          breadcrumbs.push({
            name: dynamicItem.name,
            path: fullPath,
            icon: dynamicItem.icon
          });
          matched = true;
          break;
        }
      }

      // If not a dynamic route, check static mapping
      if (!matched) {
        const mappedItem = breadcrumbNameMap[fullPath] || breadcrumbNameMap[`/${segment}`];
        
        // Apply replacements if any
        let displayName = mappedItem?.name || segment;
        Object.entries(replaceMap).forEach(([_key, value]) => {
          displayName = displayName.replace(new RegExp(_key, 'g'), value);
        });

        if (capitalizeItems) {
          displayName = displayName
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
        }

        breadcrumbs.push({
          name: displayName,
          path: fullPath,
          icon: mappedItem?.icon
        });
      }
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  // Handle max items - show ellipsis in the middle
  const getDisplayBreadcrumbs = () => {
    if (maxItems <= 0 || breadcrumbs.length <= maxItems) {
      return breadcrumbs;
    }

    const items: (BreadcrumbItem | 'ellipsis')[] = [];
    const firstItems = breadcrumbs.slice(0, Math.floor(maxItems / 2));
    const lastItems = breadcrumbs.slice(-Math.floor(maxItems / 2));

    items.push(...firstItems);
    items.push('ellipsis');
    items.push(...lastItems);

    return items;
  };

  const displayBreadcrumbs = getDisplayBreadcrumbs();

  // Handle navigation
  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    !location.pathname.includes('/product-details') && <Typography
      level="body-sm"
      sx={{
        ml: 3,
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 0.5,
        '& .breadcrumb-item': {
          cursor: 'pointer',
          color: '#004526',
          display: 'inline-flex',
          alignItems: 'center',
          transition: 'color 0.2s',
          gap: '4px',
          '&:hover': {
            color: '#035A54',
            textDecoration: 'underline',
          }
        },
        '& .separator': {
          color: '#999',
          mx: 0.5,
        },
        '& .current': {
          color: '#666',
          fontWeight: 500,
          cursor: 'default',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
          '&:hover': {
            textDecoration: 'none',
            color: '#666'
          }
        },
        '& .ellipsis': {
          color: '#999',
          mx: 0.5,
        }
      }}
    >
      {displayBreadcrumbs.map((item, index) => {
        if (item === 'ellipsis') {
          return (
            <React.Fragment key={`ellipsis-${index}`}>
              <span className="ellipsis">...</span>
              <span className="separator">{separator}</span>
            </React.Fragment>
          );
        }

        const isLast = index === displayBreadcrumbs.length - 1;
        
        return (
          <React.Fragment key={item.path}>
            <span
              className={isLast ? 'current' : 'breadcrumb-item'}
              onClick={() => !isLast && handleNavigation(item.path)}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}
            >
              {item.icon}
              <span>{item.name}</span>
            </span>
            {!isLast && <span className="separator">{separator}</span>}
          </React.Fragment>
        );
      })}
    </Typography>
  );
};

export default DynamicBreadcrumb;