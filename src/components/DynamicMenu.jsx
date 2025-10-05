import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Search, Clock, Users, Flame } from 'lucide-react';
import { 
  getMenuItems, 
  getMenuCategories, 
  searchMenuItems,
  formatPrice,
  getSpiceLevelDisplay,
  getDietaryBadges
} from '../services/contentful';

const DynamicMenu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedItem, setSelectedItem] = useState(null);

  // Load menu data on component mount
  useEffect(() => {
    const loadMenuData = async () => {
      try {
        setLoading(true);
        const [items, cats] = await Promise.all([
          getMenuItems(),
          getMenuCategories()
        ]);
        
        setMenuItems(items);
        setCategories(['all', ...cats]);
        setLoading(false);
      } catch (error) {
        console.error('Error loading menu data:', error);
        setLoading(false);
      }
    };

    loadMenuData();
  }, []);

  // Handle search
  useEffect(() => {
    const performSearch = async () => {
      if (searchQuery.trim()) {
        const results = await searchMenuItems(searchQuery);
        setSearchResults(results);
      } else {
        setSearchResults([]);
      }
    };

    const debounceTimer = setTimeout(performSearch, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  // Filter items by category
  const getFilteredItems = () => {
    if (searchQuery.trim()) {
      return searchResults;
    }
    
    if (activeCategory === 'all') {
      return menuItems;
    }
    
    return menuItems.filter(item => 
      item.fields.category.toLowerCase() === activeCategory.toLowerCase()
    );
  };

  // Menu item card component
  const MenuItemCard = ({ item }) => {
    const spiceLevel = getSpiceLevelDisplay(item.fields.spiceLevel);
    const dietaryBadges = getDietaryBadges(item);
    const imageUrl = item.fields.image?.fields?.file?.url;

    return (
      <Card className="bg-card rounded-2xl overflow-hidden transition-all duration-300 ease-in-out border border-border/5 shadow-lg hover:shadow-xl hover:-translate-y-2 relative group">
        {item.fields.isLimitedAccess && (
          <div className="absolute top-4 right-4 bg-accent text-white px-3 py-1 rounded-full text-sm font-semibold z-10">
            Limited Access
          </div>
        )}
        
        <div className="relative h-48 overflow-hidden">
          {imageUrl ? (
            <img 
              src={imageUrl} 
              alt={item.fields.name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className={`h-full flex items-center justify-center text-primary font-semibold ${
              item.fields.category === 'Curry' 
                ? 'bg-gradient-to-br from-orange-100 to-orange-200' 
                : 'bg-gradient-to-br from-pink-100 to-pink-200'
            }`}>
              {item.fields.name}
            </div>
          )}
          
          {/* Overlay with quick info */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div className="text-white text-center space-y-2">
              <div className="flex items-center justify-center space-x-4 text-sm">
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{item.fields.preparationTime}min</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="w-4 h-4" />
                  <span>{item.fields.calories} cal</span>
                </div>
              </div>
              {item.fields.spiceLevel > 0 && (
                <div className="flex items-center justify-center space-x-1">
                  <Flame className="w-4 h-4" />
                  <span className="text-sm">{spiceLevel.text}</span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-semibold">{item.fields.name}</h3>
            <span className="text-lg font-bold text-primary">
              {formatPrice(item.fields.price)}
            </span>
          </div>
          
          <p className="text-muted-foreground mb-4 line-clamp-2">
            {item.fields.description}
          </p>
          
          {/* Dietary badges */}
          <div className="flex flex-wrap gap-2 mb-4">
            {dietaryBadges.map((badge, index) => (
              <Badge key={index} className={`text-xs ${badge.color}`}>
                {badge.text}
              </Badge>
            ))}
            {item.fields.spiceLevel > 0 && (
              <Badge className={`text-xs ${spiceLevel.color}`}>
                {spiceLevel.emoji} {spiceLevel.text}
              </Badge>
            )}
          </div>
          
          <Button 
            className="bg-primary hover:bg-primary/90 text-primary-foreground w-full rounded-xl transition-all duration-300"
            onClick={() => setSelectedItem(item)}
          >
            View Details
          </Button>
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Loading our exclusive menu...</p>
        </div>
      </div>
    );
  }

  const filteredItems = getFilteredItems();

  return (
    <div className="space-y-8">
      {/* Search bar */}
      <div className="relative max-w-md mx-auto">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          type="text"
          placeholder="Search menu items..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 rounded-xl"
        />
      </div>

      {/* Category tabs */}
      <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto">
          <TabsTrigger value="all">All Items</TabsTrigger>
          <TabsTrigger value="curry">Curries</TabsTrigger>
          <TabsTrigger value="dessert">Desserts</TabsTrigger>
        </TabsList>

        <TabsContent value={activeCategory} className="mt-8">
          {filteredItems.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                {searchQuery ? 'No items found matching your search.' : 'No items available in this category.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredItems.map((item) => (
                <MenuItemCard key={item.sys.id} item={item} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Item detail modal would go here */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold">{selectedItem.fields.name}</h2>
                <Button 
                  variant="ghost" 
                  onClick={() => setSelectedItem(null)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  ✕
                </Button>
              </div>
              
              {selectedItem.fields.image?.fields?.file?.url && (
                <img 
                  src={selectedItem.fields.image.fields.file.url} 
                  alt={selectedItem.fields.name}
                  className="w-full h-64 object-cover rounded-lg mb-4"
                />
              )}
              
              <p className="text-muted-foreground mb-4">
                {selectedItem.fields.description}
              </p>
              
              <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                <div>
                  <strong>Price:</strong> {formatPrice(selectedItem.fields.price)}
                </div>
                <div>
                  <strong>Prep Time:</strong> {selectedItem.fields.preparationTime} minutes
                </div>
                <div>
                  <strong>Calories:</strong> {selectedItem.fields.calories}
                </div>
                <div>
                  <strong>Category:</strong> {selectedItem.fields.category}
                </div>
              </div>
              
              <div className="mb-4">
                <strong className="block mb-2">Ingredients:</strong>
                <div className="flex flex-wrap gap-2">
                  {selectedItem.fields.ingredients.map((ingredient, index) => (
                    <Badge key={index} variant="outline">
                      {ingredient}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl">
                Add to Order
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default DynamicMenu;
