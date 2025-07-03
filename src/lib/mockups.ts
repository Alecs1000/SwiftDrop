export interface MockupVariant {
  key: string;
  label: string;
  image: string;
}

export interface Mockup {
  id: string;
  image: string;
  title: string;
  category: string;
  variants?: MockupVariant[];
  subcategory?: string;
}

export const mockups: Mockup[] = [
  { id: "1", image: "/templates/apron-red.png", title: "Apron Red", category: "apron" },
  { id: "2", image: "/templates/chef-jacket-white.png", title: "Chef Jacket White", category: "chef" },
  { id: "3", image: "/templates/lab-jacket.png", title: "Lab Jacket", category: "lab" },
  { id: "4", image: "/templates/medical-jacket.png", title: "Medical Jacket", category: "medical" },
  {
    id: "5",
    image: "/templates/polo-beige.png",
    title: "Polo Beige",
    category: "polos",
    variants: [
      { key: "men", label: "Men", image: "/templates/polo-beige.png" },
      { key: "women", label: "Women", image: "/templates/Beige-polo-women.png" },
    ],
  },
  {
    id: "6",
    image: "/templates/hat-beige-women.png",
    title: "Hat Beige Women",
    category: "accessories",
    variants: [
      { key: "women", label: "Women", image: "/templates/hat-beige-women.png" }
    ],
    subcategory: "hat"
  },
  // Add more mockups as needed
]; 