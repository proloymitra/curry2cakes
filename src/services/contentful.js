// Contentful CMS service for Curry2Cakes
import { createClient } from 'contentful';

// Contentful configuration
const CONTENTFUL_CONFIG = {
  space: import.meta.env.VITE_CONTENTFUL_SPACE_ID || 'demo-space-id',
  accessToken: import.meta.env.VITE_CONTENTFUL_ACCESS_TOKEN || 'demo-access-token',
  host: 'cdn.contentful.com'
};

// Create Contentful client
let contentfulClient = null;

try {
  if (CONTENTFUL_CONFIG.space !== 'demo-space-id' && CONTENTFUL_CONFIG.accessToken !== 'demo-access-token') {
    contentfulClient = createClient(CONTENTFUL_CONFIG);
  }
} catch (error) {
  console.warn('Contentful client initialization failed:', error.message);
}

// Mock data for when Contentful is not configured
const mockMenuItems = [
  {
    sys: { id: '1' },
    fields: {
      name: 'Butter Chicken Curry',
      description: 'Rich and creamy tomato-based curry with tender chicken pieces, aromatic spices, and a hint of sweetness.',
      price: 18.99,
      category: 'Curry',
      image: {
        fields: {
          file: {
            url: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop'
          }
        }
      },
      isLimitedAccess: false,
      ingredients: ['Chicken', 'Tomatoes', 'Cream', 'Onions', 'Garam Masala', 'Ginger', 'Garlic'],
      spiceLevel: 2,
      preparationTime: 25,
      isVegetarian: false,
      isGlutenFree: true,
      calories: 420
    }
  },
  {
    sys: { id: '2' },
    fields: {
      name: 'Lamb Rogan Josh',
      description: 'Aromatic Kashmiri curry with tender lamb pieces, traditional spices, and rich gravy.',
      price: 24.99,
      category: 'Curry',
      image: {
        fields: {
          file: {
            url: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop'
          }
        }
      },
      isLimitedAccess: false,
      ingredients: ['Lamb', 'Yogurt', 'Onions', 'Kashmiri Chili', 'Cardamom', 'Cinnamon', 'Bay Leaves'],
      spiceLevel: 3,
      preparationTime: 45,
      isVegetarian: false,
      isGlutenFree: true,
      calories: 520
    }
  },
  {
    sys: { id: '3' },
    fields: {
      name: 'New York Cheesecake',
      description: 'Creamy, rich cheesecake with a buttery graham cracker crust and fresh berry compote.',
      price: 12.99,
      category: 'Dessert',
      image: {
        fields: {
          file: {
            url: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=400&h=300&fit=crop'
          }
        }
      },
      isLimitedAccess: true,
      ingredients: ['Cream Cheese', 'Graham Crackers', 'Eggs', 'Sugar', 'Vanilla', 'Sour Cream'],
      spiceLevel: 0,
      preparationTime: 60,
      isVegetarian: true,
      isGlutenFree: false,
      calories: 380
    }
  },
  {
    sys: { id: '4' },
    fields: {
      name: 'Chocolate Decadence',
      description: 'Intensely rich chocolate cake with layers of dark chocolate ganache and fresh raspberries.',
      price: 14.99,
      category: 'Dessert',
      image: {
        fields: {
          file: {
            url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop'
          }
        }
      },
      isLimitedAccess: false,
      ingredients: ['Dark Chocolate', 'Butter', 'Eggs', 'Sugar', 'Flour', 'Raspberries'],
      spiceLevel: 0,
      preparationTime: 40,
      isVegetarian: true,
      isGlutenFree: false,
      calories: 450
    }
  },
  {
    sys: { id: '5' },
    fields: {
      name: 'Paneer Tikka Masala',
      description: 'Grilled cottage cheese cubes in a creamy tomato-based sauce with aromatic spices.',
      price: 16.99,
      category: 'Curry',
      image: {
        fields: {
          file: {
            url: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&h=300&fit=crop'
          }
        }
      },
      isLimitedAccess: false,
      ingredients: ['Paneer', 'Tomatoes', 'Cream', 'Onions', 'Bell Peppers', 'Garam Masala'],
      spiceLevel: 2,
      preparationTime: 30,
      isVegetarian: true,
      isGlutenFree: true,
      calories: 350
    }
  },
  {
    sys: { id: '6' },
    fields: {
      name: 'Tiramisu',
      description: 'Classic Italian dessert with coffee-soaked ladyfingers and mascarpone cream.',
      price: 11.99,
      category: 'Dessert',
      image: {
        fields: {
          file: {
            url: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=300&fit=crop'
          }
        }
      },
      isLimitedAccess: true,
      ingredients: ['Mascarpone', 'Ladyfingers', 'Coffee', 'Cocoa', 'Eggs', 'Sugar'],
      spiceLevel: 0,
      preparationTime: 30,
      isVegetarian: true,
      isGlutenFree: false,
      calories: 320
    }
  }
];

/**
 * Fetch all menu items from Contentful
 */
export const getMenuItems = async () => {
  try {
    if (!contentfulClient) {
      console.log('Using mock menu data (Contentful not configured)');
      return mockMenuItems;
    }

    const response = await contentfulClient.getEntries({
      content_type: 'menuItem',
      order: 'fields.category,fields.name'
    });

    return response.items;
  } catch (error) {
    console.warn('Failed to fetch from Contentful, using mock data:', error.message);
    return mockMenuItems;
  }
};

/**
 * Fetch menu items by category
 */
export const getMenuItemsByCategory = async (category) => {
  try {
    const allItems = await getMenuItems();
    return allItems.filter(item => 
      item.fields.category.toLowerCase() === category.toLowerCase()
    );
  } catch (error) {
    console.error('Error fetching menu items by category:', error);
    return [];
  }
};

/**
 * Fetch a single menu item by ID
 */
export const getMenuItem = async (id) => {
  try {
    if (!contentfulClient) {
      return mockMenuItems.find(item => item.sys.id === id);
    }

    const response = await contentfulClient.getEntry(id);
    return response;
  } catch (error) {
    console.warn('Failed to fetch menu item from Contentful:', error.message);
    return mockMenuItems.find(item => item.sys.id === id);
  }
};

/**
 * Get menu categories
 */
export const getMenuCategories = async () => {
  try {
    const allItems = await getMenuItems();
    const categories = [...new Set(allItems.map(item => item.fields.category))];
    return categories.sort();
  } catch (error) {
    console.error('Error fetching menu categories:', error);
    return ['Curry', 'Dessert'];
  }
};

/**
 * Search menu items
 */
export const searchMenuItems = async (query) => {
  try {
    const allItems = await getMenuItems();
    const searchTerm = query.toLowerCase();
    
    return allItems.filter(item => 
      item.fields.name.toLowerCase().includes(searchTerm) ||
      item.fields.description.toLowerCase().includes(searchTerm) ||
      item.fields.ingredients.some(ingredient => 
        ingredient.toLowerCase().includes(searchTerm)
      )
    );
  } catch (error) {
    console.error('Error searching menu items:', error);
    return [];
  }
};

/**
 * Get featured menu items (limited access items)
 */
export const getFeaturedItems = async () => {
  try {
    const allItems = await getMenuItems();
    return allItems.filter(item => item.fields.isLimitedAccess);
  } catch (error) {
    console.error('Error fetching featured items:', error);
    return [];
  }
};

/**
 * Format price for display
 */
export const formatPrice = (price) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(price);
};

/**
 * Get spice level display
 */
export const getSpiceLevelDisplay = (level) => {
  const spiceLevels = {
    0: { text: 'Mild', emoji: '🌶️', color: 'text-green-600' },
    1: { text: 'Mild', emoji: '🌶️', color: 'text-green-600' },
    2: { text: 'Medium', emoji: '🌶️🌶️', color: 'text-yellow-600' },
    3: { text: 'Hot', emoji: '🌶️🌶️🌶️', color: 'text-orange-600' },
    4: { text: 'Very Hot', emoji: '🌶️🌶️🌶️🌶️', color: 'text-red-600' },
    5: { text: 'Extreme', emoji: '🌶️🌶️🌶️🌶️🌶️', color: 'text-red-800' }
  };
  
  return spiceLevels[level] || spiceLevels[0];
};

/**
 * Get dietary badges for an item
 */
export const getDietaryBadges = (item) => {
  const badges = [];
  
  if (item.fields.isVegetarian) {
    badges.push({ text: 'Vegetarian', color: 'bg-green-100 text-green-800' });
  }
  
  if (item.fields.isGlutenFree) {
    badges.push({ text: 'Gluten-Free', color: 'bg-blue-100 text-blue-800' });
  }
  
  if (item.fields.isLimitedAccess) {
    badges.push({ text: 'Limited Access', color: 'bg-red-100 text-red-800' });
  }
  
  return badges;
};

export default {
  getMenuItems,
  getMenuItemsByCategory,
  getMenuItem,
  getMenuCategories,
  searchMenuItems,
  getFeaturedItems,
  formatPrice,
  getSpiceLevelDisplay,
  getDietaryBadges
};
