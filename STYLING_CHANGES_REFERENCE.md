# Styling Changes Reference - Job Monitoring Dashboard

## Styled Components Updates

### Container
```typescript
// Updated with better max-width and padding
max-width: 1800px;  // Increased from 1600px
margin: 0 auto;
padding: 0;
```

### PageHeader
```typescript
// Enhanced with better spacing and responsiveness
display: flex;
justify-content: space-between;
align-items: center;
margin-bottom: 32px;  // Increased from 30px
padding: 0 24px;      // Added padding
flex-wrap: wrap;      // Better mobile support
gap: 16px;
```

### PageTitle
```typescript
// Larger, more prominent
font-size: 32px;      // Increased from 28px
font-weight: 700;     // Increased from 600
color: #1a202c;       // Darker color
display: flex;
align-items: center;
gap: 12px;
margin: 0;

svg {
  color: #3498db;     // Blue color for icon
}
```

### Button
```typescript
// Enhanced with better styling and transitions
background: ${props => {
  switch (props.variant) {
    case 'primary': return '#3498db';
    case 'danger': return '#e74c3c';
    default: return '#ecf0f1';
  }
}};
color: ${props => props.variant === 'secondary' ? '#2c3e50' : 'white'};
border: none;
padding: 10px 18px;
border-radius: 8px;
cursor: pointer;
font-size: 14px;
font-weight: 600;     // Increased from 500
display: flex;
align-items: center;
gap: 8px;
transition: all 0.3s ease;  // Smoother transition
box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);  // Added shadow

&:hover:not(:disabled) {
  transform: translateY(-2px);  // Lift effect
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  // ... color changes
}
```

### StatCard
```typescript
// Major improvements with gradients and animations
background: ${props => props.$gradient || 'white'};
border-radius: 12px;
padding: 24px;
box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
color: ${props => props.$gradient ? 'white' : '#2c3e50'};
position: relative;
overflow: hidden;
transition: all 0.3s ease;
border: 1px solid ${props => props.$gradient ? 'transparent' : '#ecf0f1'};

&:hover {
  transform: translateY(-4px);  // Lift effect
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

&::before {
  // Decorative background element
  content: '';
  position: absolute;
  top: -50%;
  right: -50%;
  width: 200px;
  height: 200px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  pointer-events: none;
}
```

### StatValue
```typescript
// Larger, more prominent
font-size: 36px;      // Increased from 32px
font-weight: 800;     // Increased from 700
margin-bottom: 12px;  // Increased from 8px
position: relative;
z-index: 1;
```

### StatLabel
```typescript
// Better styling with uppercase
font-size: 13px;
opacity: 0.9;
font-weight: 600;
display: flex;
align-items: center;
gap: 8px;
position: relative;
z-index: 1;
text-transform: uppercase;  // Added
letter-spacing: 0.5px;      // Added
```

### FiltersCard
```typescript
// Better organization and styling
background: white;
border-radius: 12px;
padding: 24px;
margin-bottom: 24px;
margin-left: 24px;    // Added
margin-right: 24px;   // Added
box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
border: 1px solid #ecf0f1;
```

### FilterInput
```typescript
// Enhanced with better focus states
padding: 10px 14px;
border: 1px solid #ddd;
border-radius: 8px;
font-size: 14px;
transition: all 0.2s;
background: #f8f9fa;  // Light background

&:focus {
  outline: none;
  border-color: #3498db;
  background: white;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);  // Blue glow
}
```

### FilterSelect
```typescript
// Custom dropdown styling
padding: 10px 14px;
border: 1px solid #ddd;
border-radius: 8px;
font-size: 14px;
background: #f8f9fa;
cursor: pointer;
transition: all 0.2s;
appearance: none;
background-image: url("data:image/svg+xml;...");  // Custom arrow
background-repeat: no-repeat;
background-position: right 10px center;
background-size: 20px;
padding-right: 36px;

&:focus {
  outline: none;
  border-color: #3498db;
  background-color: white;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
}
```

### TableCard
```typescript
// Better organization
background: white;
border-radius: 12px;
overflow: hidden;
box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
border: 1px solid #ecf0f1;
margin: 0 24px 24px 24px;  // Added margins
```

### Th (Table Header)
```typescript
// Better styling
background: #f8f9fa;
padding: 16px;
text-align: left;
font-size: 13px;
font-weight: 700;
color: #2c3e50;
border-bottom: 2px solid #ecf0f1;
text-transform: uppercase;  // Added
letter-spacing: 0.5px;      // Added
white-space: nowrap;        // Added
```

### Tr (Table Row)
```typescript
// Better hover effects
border-bottom: 1px solid #ecf0f1;
transition: all 0.2s;

&:hover {
  background: #f8f9fa;
}

&:last-child {
  border-bottom: none;
}
```

### StatusBadge
```typescript
// Enhanced with icons and better styling
padding: 6px 12px;
border-radius: 20px;  // More rounded
font-size: 12px;
font-weight: 700;
display: inline-flex;  // For icon support
align-items: center;
gap: 6px;
text-transform: capitalize;
background: ${props => {
  switch (props.status) {
    case 'active': return '#d4edda';
    case 'closed': return '#f8d7da';
    case 'expired': return '#fff3cd';
    case 'draft': return '#e2e3e5';
    default: return '#d1ecf1';
  }
}};
color: ${props => {
  switch (props.status) {
    case 'active': return '#155724';
    case 'closed': return '#721c24';
    case 'expired': return '#856404';
    case 'draft': return '#383d41';
    default: return '#0c5460';
  }
}};
```

### MetricBadge
```typescript
// New component for metrics display
background: #e8f4f8;
color: #0c5460;
padding: 4px 10px;
border-radius: 6px;
font-size: 12px;
font-weight: 600;
```

### IconButton
```typescript
// Enhanced with better hover effects
background: none;
border: none;
padding: 8px;
cursor: pointer;
color: #7f8c8d;
transition: all 0.2s;
display: flex;
align-items: center;
justify-content: center;
border-radius: 6px;

&:hover {
  color: #3498db;
  background: #e8f4f8;
}

&:active {
  transform: scale(0.95);
}
```

### Modal
```typescript
// Enhanced animations
display: ${props => props.$isOpen ? 'flex' : 'none'};
position: fixed;
top: 0;
left: 0;
right: 0;
bottom: 0;
background: rgba(0, 0, 0, 0.5);
z-index: 1000;
align-items: center;
justify-content: center;
overflow-y: auto;
padding: 20px;
animation: fadeIn 0.3s ease;  // Added animation

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
```

### ModalContent
```typescript
// Better styling with animations
background: white;
border-radius: 12px;
padding: 32px;
max-width: 900px;  // Increased from 800px
width: 100%;
max-height: 90vh;
overflow-y: auto;
box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
animation: slideUp 0.3s ease;  // Added animation

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
```

### ModalSectionTitle
```typescript
// Better organization
font-size: 16px;
font-weight: 700;
color: #1a202c;
margin: 0 0 16px 0;
padding-bottom: 12px;
border-bottom: 1px solid #ecf0f1;
display: flex;
align-items: center;
gap: 8px;
```

### ModalGrid
```typescript
// Better layout for modal fields
display: grid;
grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
gap: 20px;
```

### ModalFieldLabel
```typescript
// Better styling
font-size: 12px;
font-weight: 700;
color: #7f8c8d;
text-transform: uppercase;
letter-spacing: 0.5px;
```

### ModalFieldValue
```typescript
// Better styling
font-size: 15px;
font-weight: 600;
color: #1a202c;
```

### ErrorAlert & SuccessAlert
```typescript
// New alert components with better styling
background: #ffe5e5;  // or #d4edda for success
border: 1px solid #f5c6cb;  // or #c3e6cb
border-radius: 8px;
padding: 16px;
margin: 0 24px 24px 24px;
display: flex;
align-items: center;
gap: 12px;
color: #721c24;  // or #155724
font-size: 14px;
```

### WarningMessage
```typescript
// Enhanced styling
background: #fff3cd;
border: 1px solid #ffc107;
border-radius: 8px;
padding: 16px;
margin: 0 24px 24px 24px;
display: flex;
align-items: flex-start;
gap: 12px;
color: #856404;
font-size: 14px;

svg {
  flex-shrink: 0;
  margin-top: 2px;
}
```

### EmptyState
```typescript
// New component for empty states
display: flex;
flex-direction: column;
align-items: center;
justify-content: center;
padding: 60px 20px;
color: #7f8c8d;
text-align: center;
```

### LoadingContainer
```typescript
// New component for loading states
display: flex;
justify-content: center;
align-items: center;
padding: 60px 20px;
color: #7f8c8d;
```

### LoadingSpinner
```typescript
// Animated spinner
display: inline-block;
width: 40px;
height: 40px;
border: 4px solid #ecf0f1;
border-top-color: #3498db;
border-radius: 50%;
animation: spin 1s linear infinite;

@keyframes spin {
  to { transform: rotate(360deg); }
}
```

## Color Palette

### Primary Colors
- **Primary Blue**: #3498db
- **Dark Text**: #1a202c
- **Medium Text**: #2c3e50
- **Light Text**: #7f8c8d
- **Light Background**: #f8f9fa
- **Border**: #ecf0f1

### Status Colors
- **Active**: #d4edda (bg) / #155724 (text)
- **Closed**: #f8d7da (bg) / #721c24 (text)
- **Expired**: #fff3cd (bg) / #856404 (text)
- **Draft**: #e2e3e5 (bg) / #383d41 (text)

### Gradients
- **Purple**: linear-gradient(135deg, #667eea 0%, #764ba2 100%)
- **Green**: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)
- **Pink-Yellow**: linear-gradient(135deg, #fa709a 0%, #fee140 100%)
- **Cyan**: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)

## Spacing System

- **Extra Small**: 4px
- **Small**: 8px
- **Medium**: 12px
- **Large**: 16px
- **Extra Large**: 20px
- **XXL**: 24px
- **XXXL**: 28px
- **XXXXL**: 32px

## Typography

- **Page Title**: 32px, weight 700
- **Section Title**: 20px, weight 700
- **Subsection Title**: 16px, weight 700
- **Body Text**: 14px, weight 500
- **Small Text**: 13px, weight 600
- **Label Text**: 12px, weight 700, uppercase

## Transitions

- **Standard**: 0.2s ease
- **Smooth**: 0.3s ease
- **Slow**: 0.4s ease

## Shadows

- **Small**: 0 2px 4px rgba(0, 0, 0, 0.08)
- **Medium**: 0 2px 8px rgba(0, 0, 0, 0.06)
- **Large**: 0 4px 12px rgba(0, 0, 0, 0.12)
- **Extra Large**: 0 8px 16px rgba(0, 0, 0, 0.1)
- **Modal**: 0 20px 60px rgba(0, 0, 0, 0.3)
