export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  description: string;
  size?: string;
  thickness?: string;
  imageFit?: 'cover' | 'contain';
  popular?: boolean;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
  image: string;
}

export const categories: Category[] = [
  {
    id: "plywood",
    name: "Plywood",
    icon: "Layers",
    description: "Premium quality plywood sheets for all your construction needs",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop"
  },
  {
    id: "laminates",
    name: "Laminates",
    icon: "Palette",
    description: "Decorative laminates in various colors and textures",
    image: "https://images.unsplash.com/photo-1615971677499-5467cbab01c0?w=400&h=300&fit=crop"
  },
  {
    id: "hardware-tools",
    name: "Tools",
    icon: "Wrench",
    description: "Professional grade tools for every project",
    image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400&h=300&fit=crop"
  },
  {
    id: "door-handles",
    name: "Door Handles & Locks",
    icon: "DoorOpen",
    description: "Stylish and secure door hardware solutions",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop"
  },
  {
    id: "fittings",
    name: "Plumbing Accessories",
    icon: "Cog",
    description: "Essential fittings for all construction work",
    image: "https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?w=400&h=300&fit=crop"
  }
];

export const products: Product[] = [
  // Products
  {
    id: "fevicol-sh",
    name: "Fevicol SH",
    price: 800,
    category: "fittings",
    image: "/fevicol-sh.png",
    description: "High-quality synthetic resin adhesive for plywood, laminate, MDF and woodworking applications",
    size: "5kg",
    imageFit: "contain"
  },
  // Plywood
  {
    id: "ply-1",
    name: "Commercial Plywood 18mm",
    price: 1850,
    category: "plywood",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
    description: "High-quality commercial plywood suitable for furniture and interiors",
    size: "8x4 feet",
    thickness: "18mm"
  },
  {
    id: "ply-2",
    name: "Marine Plywood 19mm",
    price: 3200,
    category: "plywood",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
    description: "Water-resistant marine plywood for outdoor and wet areas",
    size: "8x4 feet",
    thickness: "19mm"
  },
  {
    id: "ply-3",
    name: "BWR Plywood 12mm",
    price: 1450,
    category: "plywood",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
    description: "Boiling Water Resistant plywood for kitchen cabinets",
    size: "8x4 feet",
    thickness: "12mm"
  },
  // Laminates
  {
    id: "lam-1",
    name: "Sunmica Sheet - Walnut",
    price: 850,
    category: "laminates",
    image: "https://images.unsplash.com/photo-1615971677499-5467cbab01c0?w=400&h=400&fit=crop",
    description: "Premium decorative laminate with walnut wood finish",
    size: "8x4 feet",
    thickness: "1mm"
  },
  {
    id: "lam-2",
    name: "High Gloss White Laminate",
    price: 1100,
    category: "laminates",
    image: "https://images.unsplash.com/photo-1615971677499-5467cbab01c0?w=400&h=400&fit=crop",
    description: "Glossy white laminate for modern kitchen designs",
    size: "8x4 feet",
    thickness: "1mm"
  },
  // Hardware Tools
  {
    id: "tool-1",
    name: "Professional Drill Machine",
    price: 2800,
    category: "hardware-tools",
    image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400&h=400&fit=crop",
    description: "750W professional drill with variable speed control"
  },
  {
    id: "tool-2",
    name: "Circular Saw 7 inch",
    price: 4500,
    category: "hardware-tools",
    image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400&h=400&fit=crop",
    description: "Heavy duty circular saw for wood cutting"
  },
  {
    id: "tool-3",
    name: "Hammer Set (3 piece)",
    price: 650,
    category: "hardware-tools",
    image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400&h=400&fit=crop",
    description: "Professional hammer set with comfortable grip"
  },
  // Door Handles & Locks
  {
    id: "door-1",
    name: "Brass Door Handle Set",
    price: 1200,
    category: "door-handles",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
    description: "Elegant brass door handle with lock mechanism"
  },
  {
    id: "door-2",
    name: "Digital Door Lock",
    price: 8500,
    category: "door-handles",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
    description: "Smart digital door lock with fingerprint and password"
  },
  // Fittings
  {
    id: "fit-1",
    name: "Wood Screws Box (100pc)",
    price: 180,
    category: "fittings",
    image: "https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?w=400&h=400&fit=crop",
    description: "Stainless steel wood screws, 2 inch length"
  },
  {
    id: "fit-2",
    name: "Cabinet Hinges (4pc)",
    price: 320,
    category: "fittings",
    image: "https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?w=400&h=400&fit=crop",
    description: "Soft-close cabinet hinges, premium quality"
  },
  {
    id: "fit-3",
    name: "Drawer Slides Pair",
    price: 450,
    category: "fittings",
    image: "https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?w=400&h=400&fit=crop",
    description: "Ball bearing drawer slides, 18 inch"
  },
  // Constuction Chemicals
  {
    id: "roff-t01",
    name: "Roff T01 Tile Adhesive",
    price: 500,
    category: "fittings",
    image: "/roff-adhesive.png",
    description: "High-strength cement-based adhesive for new construction",
    size: "20kg",
    thickness: "",
    imageFit: "contain"
  },


  {
    id: "dr-fixit-201",
    name: "Dr. Fixit 201 – Crack-X Paste",
    price: 0,
    category: "fittings",
    image: "/dr-fixit.png",
    description: "High-quality ready-to-use crack filling paste suitable for internal walls and plaster.",
    size: "500g",
    imageFit: "contain"
  },
  {
    id: "finolex-pipe",
    name: "Finolex SWR Pipe",
    price: 450,
    category: "fittings",
    image: "/finolex-pipes.png",
    description: "Superior quality SWR pipes with UV resistance for long-lasting drainage systems",
    size: "10 ft",
    imageFit: "contain"
  },
  {
    id: "astral-pipe",
    name: "Astral CPVC Pro Pipe",
    price: 350,
    category: "fittings",
    image: "/astral-pipes.png",
    description: "Lead-free CPVC pipes for hot and cold water plumbing systems",
    size: "10 ft",
    imageFit: "contain"
  },
  {
    id: "premium-plywood",
    name: "Premium Gurjan Plywood",
    price: 3200,
    category: "plywood",
    image: "/plywood.jpg",
    description: "Termite and borer resistant premium grade plywood for furniture",
    size: "8x4 feet",
    thickness: "19mm",
    imageFit: "cover"
  },
  {
    id: "dongcheng-grinder",
    name: "DongCheng Angle Grinder",
    price: 2200,
    category: "hardware-tools",
    image: "/dongcheng.png",
    description: "Heavy-duty 850W angle grinder for cutting and grinding applications",
    imageFit: "contain"
  }
];

export const storeInfo = {
  name: "Ambika hardware & Plywood",
  tagline: "Quality Hardware & Plywood at Best Price",
  phone: "+91 9173187372",
  whatsapp: "919173187372",
  email: "shreeambikahandp@gmail.com",
  address: "Kachchhi Colony, near to Pataneshwar Mahadev Temple",
  city: "Deesa, 385535",
  mapUrl: "https://maps.google.com/?q=24.251879214343376,72.19014024486967",
  hours: "Mon-Sat: 8:00 AM - 8:00 PM | Sun: 8:00 AM - 1:00 PM"
};
