// Mock data for restaurants
export const mockRestaurants = [
  {
    id: 1,
    name: "Burger Palace",
    cuisine: "American",
    rating: 4.7,
    reviewCount: 245,
    distance: 1.2,
    deliveryTime: "25-40 min",
    image: "https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    promo: "Free delivery on orders over $15",
    description: "Enjoy our gourmet burgers made with 100% Angus beef, fresh ingredients, and homemade sauces. Our goal is to provide the best burger experience in town!",
    menu: [
      {
        id: 1,
        name: "Classic Burger",
        description: "Beef patty, lettuce, tomato, cheese, and our special sauce",
        price: 12.99,
        image: "https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        category: "burgers"
      },
      {
        id: 2,
        name: "Bacon Deluxe",
        description: "Beef patty, bacon, cheddar, lettuce, tomato, and BBQ sauce",
        price: 14.99,
        image: "https://images.pexels.com/photos/3738730/pexels-photo-3738730.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        category: "burgers"
      },
      {
        id: 3,
        name: "Veggie Burger",
        description: "Plant-based patty, avocado, lettuce, tomato, and vegan mayo",
        price: 13.99,
        image: "https://images.pexels.com/photos/1633578/pexels-photo-1633578.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        category: "burgers"
      },
      {
        id: 4,
        name: "French Fries",
        description: "Crispy golden fries with sea salt",
        price: 4.99,
        image: "https://images.pexels.com/photos/1583884/pexels-photo-1583884.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        category: "sides"
      },
      {
        id: 5,
        name: "Onion Rings",
        description: "Crispy battered onion rings with dipping sauce",
        price: 5.99,
        image: "https://images.pexels.com/photos/9922855/pexels-photo-9922855.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        category: "sides"
      },
      {
        id: 6,
        name: "Chocolate Milkshake",
        description: "Rich and creamy chocolate milkshake with whipped cream",
        price: 5.99,
        image: "https://images.pexels.com/photos/3727250/pexels-photo-3727250.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        category: "drinks"
      }
    ]
  },
  {
    id: 2,
    name: "Pizza Express",
    cuisine: "Italian",
    rating: 4.5,
    reviewCount: 189,
    distance: 0.8,
    deliveryTime: "30-45 min",
    image: "https://images.pexels.com/photos/1146760/pexels-photo-1146760.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    promo: "20% off on orders over $25",
    menu: [
      {
        id: 7,
        name: "Margherita Pizza",
        description: "Tomato sauce, mozzarella, and basil",
        price: 14.99,
        image: "https://images.pexels.com/photos/1146760/pexels-photo-1146760.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        category: "pizza"
      },
      {
        id: 8,
        name: "Pepperoni Pizza",
        description: "Tomato sauce, mozzarella, and pepperoni",
        price: 16.99,
        image: "https://images.pexels.com/photos/4109111/pexels-photo-4109111.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        category: "pizza"
      }
    ]
  },
  {
    id: 3,
    name: "Taco Fiesta",
    cuisine: "Mexican",
    rating: 4.3,
    reviewCount: 156,
    distance: 1.5,
    deliveryTime: "20-35 min",
    image: "https://images.pexels.com/photos/4958641/pexels-photo-4958641.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    promo: null,
    menu: [
      {
        id: 9,
        name: "Beef Tacos",
        description: "Three tacos with seasoned beef, lettuce, cheese, and salsa",
        price: 12.99,
        image: "https://images.pexels.com/photos/4958641/pexels-photo-4958641.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        category: "tacos"
      },
      {
        id: 10,
        name: "Chicken Quesadilla",
        description: "Grilled chicken, melted cheese, and peppers in a flour tortilla",
        price: 11.99,
        image: "https://images.pexels.com/photos/6605208/pexels-photo-6605208.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        category: "quesadillas"
      }
    ]
  },
  {
    id: 4,
    name: "Sushi World",
    cuisine: "Japanese",
    rating: 4.8,
    reviewCount: 312,
    distance: 2.2,
    deliveryTime: "35-50 min",
    image: "https://images.pexels.com/photos/2098085/pexels-photo-2098085.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    promo: "Free miso soup with orders over $30",
    menu: [
      {
        id: 11,
        name: "California Roll",
        description: "Crab, avocado, and cucumber",
        price: 8.99,
        image: "https://images.pexels.com/photos/2098085/pexels-photo-2098085.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        category: "rolls"
      },
      {
        id: 12,
        name: "Salmon Nigiri",
        description: "Fresh salmon over pressed rice",
        price: 9.99,
        image: "https://images.pexels.com/photos/2323398/pexels-photo-2323398.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        category: "nigiri"
      }
    ]
  },
  {
    id: 5,
    name: "Green Garden",
    cuisine: "Vegetarian",
    rating: 4.6,
    reviewCount: 178,
    distance: 1.1,
    deliveryTime: "25-40 min",
    image: "https://images.pexels.com/photos/1211887/pexels-photo-1211887.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    promo: "10% off your first order",
    menu: [
      {
        id: 13,
        name: "Veggie Bowl",
        description: "Quinoa, roasted vegetables, avocado, and tahini dressing",
        price: 13.99,
        image: "https://images.pexels.com/photos/1211887/pexels-photo-1211887.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        category: "bowls"
      },
      {
        id: 14,
        name: "Falafel Wrap",
        description: "Falafel, hummus, vegetables, and tahini in a whole wheat wrap",
        price: 11.99,
        image: "https://images.pexels.com/photos/1618898/pexels-photo-1618898.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        category: "wraps"
      }
    ]
  }
];

// Mock data for categories
export const mockCategories = [
  {
    id: 1,
    name: "Fast Food",
    image: "https://images.pexels.com/photos/1633578/pexels-photo-1633578.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
  },
  {
    id: 2,
    name: "Pizza",
    image: "https://images.pexels.com/photos/4109111/pexels-photo-4109111.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
  },
  {
    id: 3,
    name: "Mexican",
    image: "https://images.pexels.com/photos/4958641/pexels-photo-4958641.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
  },
  {
    id: 4,
    name: "Sushi",
    image: "https://images.pexels.com/photos/2098085/pexels-photo-2098085.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
  },
  {
    id: 5,
    name: "Vegetarian",
    image: "https://images.pexels.com/photos/1211887/pexels-photo-1211887.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
  },
  {
    id: 6,
    name: "Desserts",
    image: "https://images.pexels.com/photos/1126359/pexels-photo-1126359.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
  }
];

// Mock data for promotions
export const mockPromotions = [
  {
    id: 1,
    title: "50% OFF Your First Order",
    description: "Use code WELCOME50",
    backgroundColor: "#FFF0E6",
    textColor: "#E85D04",
    image: "https://images.pexels.com/photos/2103949/pexels-photo-2103949.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
  },
  {
    id: 2,
    title: "Free Delivery on Orders $15+",
    description: "Limited time offer",
    backgroundColor: "#E6F7EF",
    textColor: "#33A95B",
    image: "https://images.pexels.com/photos/2280545/pexels-photo-2280545.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
  },
  {
    id: 3,
    title: "Support Local Businesses",
    description: "15% off local restaurants",
    backgroundColor: "#E6F1FF",
    textColor: "#2B80FF",
    image: "https://images.pexels.com/photos/3184188/pexels-photo-3184188.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
  }
];

// Mock data for orders
export const mockOrders = [
  {
    id: 1001,
    restaurantId: 1,
    restaurantName: "Burger Palace",
    restaurantImage: "https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    status: "delivering",
    date: new Date().toISOString(),
    total: 41.45,
    customerName: "John Doe",
    items: [
      {
        id: 1,
        name: "Classic Burger",
        price: 12.99,
        quantity: 2,
        notes: "No onions please"
      },
      {
        id: 4,
        name: "French Fries",
        price: 4.99,
        quantity: 1
      },
      {
        id: 6,
        name: "Chocolate Milkshake",
        price: 5.99,
        quantity: 1
      }
    ]
  },
  {
    id: 1002,
    restaurantId: 2,
    restaurantName: "Pizza Express",
    restaurantImage: "https://images.pexels.com/photos/1146760/pexels-photo-1146760.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    status: "completed",
    date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // Yesterday
    total: 33.97,
    customerName: "John Doe",
    items: [
      {
        id: 7,
        name: "Margherita Pizza",
        price: 14.99,
        quantity: 1
      },
      {
        id: 8,
        name: "Pepperoni Pizza",
        price: 16.99,
        quantity: 1
      }
    ]
  },
  {
    id: 1003,
    restaurantId: 3,
    restaurantName: "Taco Fiesta",
    restaurantImage: "https://images.pexels.com/photos/4958641/pexels-photo-4958641.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    status: "preparing",
    date: new Date().toISOString(),
    total: 25.97,
    customerName: "John Doe",
    items: [
      {
        id: 9,
        name: "Beef Tacos",
        price: 12.99,
        quantity: 1
      },
      {
        id: 10,
        name: "Chicken Quesadilla",
        price: 11.99,
        quantity: 1
      }
    ]
  },
  {
    id: 1004,
    restaurantId: 4,
    restaurantName: "Sushi World",
    restaurantImage: "https://images.pexels.com/photos/2098085/pexels-photo-2098085.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    status: "cancelled",
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    total: 28.97,
    customerName: "John Doe",
    items: [
      {
        id: 11,
        name: "California Roll",
        price: 8.99,
        quantity: 2
      },
      {
        id: 12,
        name: "Salmon Nigiri",
        price: 9.99,
        quantity: 1
      }
    ]
  },
  {
    id: 1005,
    restaurantId: 5,
    restaurantName: "Green Garden",
    restaurantImage: "https://images.pexels.com/photos/1211887/pexels-photo-1211887.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    status: "ready",
    date: new Date().toISOString(),
    total: 27.97,
    customerName: "John Doe",
    items: [
      {
        id: 13,
        name: "Veggie Bowl",
        price: 13.99,
        quantity: 1
      },
      {
        id: 14,
        name: "Falafel Wrap",
        price: 11.99,
        quantity: 1
      }
    ]
  }
];

// Mock data for products (for vendor dashboard)
export const mockProducts = [
  {
    id: 1,
    name: "Classic Burger",
    price: 12.99,
    image: "https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    category: "burgers",
    available: true,
    sales: 127
  },
  {
    id: 2,
    name: "Bacon Deluxe",
    price: 14.99,
    image: "https://images.pexels.com/photos/3738730/pexels-photo-3738730.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    category: "burgers",
    available: true,
    sales: 98
  },
  {
    id: 3,
    name: "Veggie Burger",
    price: 13.99,
    image: "https://images.pexels.com/photos/1633578/pexels-photo-1633578.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    category: "burgers",
    available: true,
    sales: 76
  },
  {
    id: 4,
    name: "French Fries",
    price: 4.99,
    image: "https://images.pexels.com/photos/1583884/pexels-photo-1583884.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    category: "sides",
    available: true,
    sales: 243
  },
  {
    id: 5,
    name: "Onion Rings",
    price: 5.99,
    image: "https://images.pexels.com/photos/9922855/pexels-photo-9922855.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    category: "sides",
    available: true,
    sales: 156
  },
  {
    id: 6,
    name: "Chocolate Milkshake",
    price: 5.99,
    image: "https://images.pexels.com/photos/3727250/pexels-photo-3727250.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    category: "drinks",
    available: true,
    sales: 187
  }
];