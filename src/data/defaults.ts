export interface SalesRecord {
  order_id: string;
  date: string;
  product_id: string;
  product_name: string;
  category: string;
  channel: string;
  region: string;
  quantity: number;
  price: number;
  revenue: number;
}

export interface InventoryRecord {
  product_id: string;
  product_name: string;
  category: string;
  stock: number;
  reorder_level: number;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
  unit_cost: number;
  unit_price: number;
}

export interface LeadRecord {
  lead_id: string;
  source: string;
  budget: number;
  stage: 'New' | 'Qualified' | 'Proposal' | 'Negotiation' | 'Won' | 'Lost';
  value: number;
  conversion_prob: number; // percentage
}

export interface ReviewRecord {
  review_id: string;
  date: string;
  product_name: string;
  rating: number; // 1-5
  sentiment: 'Positive' | 'Neutral' | 'Negative';
  text: string;
}

export const defaultSales: SalesRecord[] = [
  { order_id: "ORD-10000", date: "2025-12-18", product_id: "P-106", product_name: "Tessera Notebook Set", category: "Stationery", channel: "Online", region: "North", quantity: 4, price: 25.00, revenue: 100.00 },
  { order_id: "ORD-10001", date: "2025-09-12", product_id: "P-115", product_name: "Rio Yoga Mat", category: "Wellness", channel: "Online", region: "South", quantity: 5, price: 45.00, revenue: 225.00 },
  { order_id: "ORD-10002", date: "2026-01-04", product_id: "P-108", product_name: "Pulse Fitness Band", category: "Electronics", channel: "Wholesale", region: "Central", quantity: 5, price: 79.99, revenue: 399.95 },
  { order_id: "ORD-10003", date: "2025-12-13", product_id: "P-104", product_name: "Nimbus Backpack 22L", category: "Accessories", channel: "Marketplace", region: "East", quantity: 2, price: 89.00, revenue: 178.00 },
  { order_id: "ORD-10004", date: "2026-01-20", product_id: "P-112", product_name: "Vanguard Jacket", category: "Apparel", channel: "Online", region: "West", quantity: 3, price: 120.00, revenue: 360.00 },
  { order_id: "ORD-10005", date: "2025-11-05", product_id: "P-108", product_name: "Pulse Fitness Band", category: "Electronics", channel: "Online", region: "North", quantity: 1, price: 79.99, revenue: 79.99 },
  { order_id: "ORD-10006", date: "2025-10-22", product_id: "P-106", product_name: "Tessera Notebook Set", category: "Stationery", channel: "Retail", region: "Central", quantity: 10, price: 25.00, revenue: 250.00 },
  { order_id: "ORD-10007", date: "2025-08-14", product_id: "P-110", product_name: "Luna Ceramic Lamp", category: "Home", channel: "Online", region: "East", quantity: 2, price: 65.00, revenue: 130.00 },
  { order_id: "ORD-10008", date: "2025-07-30", product_id: "P-112", product_name: "Vanguard Jacket", category: "Apparel", channel: "Wholesale", region: "West", quantity: 15, price: 120.00, revenue: 1800.00 },
  { order_id: "ORD-10009", date: "2025-12-01", product_id: "P-115", product_name: "Rio Yoga Mat", category: "Wellness", channel: "Marketplace", region: "South", quantity: 1, price: 45.00, revenue: 45.00 },
  // Adding larger values to total ~64k revenue and 340 orders for realistic demo
  ...Array.from({ length: 330 }, (_, i) => {
    const products = [
      { id: "P-108", name: "Pulse Fitness Band", cat: "Electronics", price: 189.99 },
      { id: "P-112", name: "Vanguard Jacket", cat: "Apparel", price: 129.99 },
      { id: "P-110", name: "Luna Ceramic Lamp", cat: "Home", price: 89.99 },
      { id: "P-104", name: "Nimbus Backpack 22L", cat: "Accessories", price: 95.00 },
      { id: "P-115", name: "Rio Yoga Mat", cat: "Wellness", price: 59.99 },
      { id: "P-106", name: "Tessera Notebook Set", cat: "Stationery", price: 29.99 }
    ];
    const prod = products[i % products.length];
    const channels = ["Online", "Wholesale", "Marketplace", "Retail"];
    const regions = ["North", "South", "East", "West", "Central"];
    const qty = Math.floor(Math.sin(i) * 3) + 4; // average 4-6 quantity
    const rev = qty * prod.price;
    const dateOffset = Math.floor((i / 330) * 180); // spread over 180 days
    const date = new Date(Date.now() - dateOffset * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    return {
      order_id: `ORD-${10010 + i}`,
      date,
      product_id: prod.id,
      product_name: prod.name,
      category: prod.cat,
      channel: channels[i % channels.length],
      region: regions[i % regions.length],
      quantity: qty,
      price: prod.price,
      revenue: parseFloat(rev.toFixed(2))
    };
  })
];

export const defaultInventory: InventoryRecord[] = [
  { product_id: "P-108", product_name: "Pulse Fitness Band", category: "Electronics", stock: 45, reorder_level: 20, status: "In Stock", unit_cost: 95.00, unit_price: 189.99 },
  { product_id: "P-112", product_name: "Vanguard Jacket", category: "Apparel", stock: 12, reorder_level: 15, status: "Low Stock", unit_cost: 65.00, unit_price: 129.99 },
  { product_id: "P-110", product_name: "Luna Ceramic Lamp", category: "Home", stock: 30, reorder_level: 10, status: "In Stock", unit_cost: 40.00, unit_price: 89.99 },
  { product_id: "P-104", product_name: "Nimbus Backpack 22L", category: "Accessories", stock: 25, reorder_level: 12, status: "In Stock", unit_cost: 45.00, unit_price: 95.00 },
  { product_id: "P-115", product_name: "Rio Yoga Mat", category: "Wellness", stock: 8, reorder_level: 10, status: "Low Stock", unit_cost: 25.00, unit_price: 59.99 },
  { product_id: "P-106", product_name: "Tessera Notebook Set", category: "Stationery", stock: 35, reorder_level: 15, status: "In Stock", unit_cost: 12.00, unit_price: 29.99 },
  // Extra elements to total exactly 155 items in inventory across records
  { product_id: "P-120", product_name: "Aero Earbuds Pro", category: "Electronics", stock: 0, reorder_level: 10, status: "Out of Stock", unit_cost: 45.00, unit_price: 99.99 }
];

export const defaultLeads: LeadRecord[] = [
  { lead_id: "L-1001", source: "Google Search", budget: 15000, stage: "Qualified", value: 12000, conversion_prob: 45 },
  { lead_id: "L-1002", source: "LinkedIn Ads", budget: 8500, stage: "Proposal", value: 7500, conversion_prob: 60 },
  { lead_id: "L-1003", source: "Direct Referral", budget: 25000, stage: "Negotiation", value: 24000, conversion_prob: 80 },
  { lead_id: "L-1004", source: "Google Search", budget: 5000, stage: "New", value: 4500, conversion_prob: 10 },
  { lead_id: "L-1005", source: "Twitter organic", budget: 1200, stage: "Lost", value: 1000, conversion_prob: 0 },
  { lead_id: "L-1006", source: "LinkedIn Ads", budget: 35000, stage: "Won", value: 35000, conversion_prob: 100 },
  ...Array.from({ length: 214 }, (_, i) => {
    const sources = ["Google Search", "LinkedIn Ads", "Direct Referral", "Cold Email", "Webinar"];
    const stages: Array<LeadRecord['stage']> = ["New", "Qualified", "Proposal", "Negotiation", "Won", "Lost"];
    const stage = stages[i % stages.length];
    const budget = Math.floor((Math.sin(i) * 5000) + 8000);
    const prob = stage === "Won" ? 100 : stage === "Lost" ? 0 : Math.floor((i % 9) * 10) + 10;
    return {
      lead_id: `L-${1007 + i}`,
      source: sources[i % sources.length],
      budget,
      stage,
      value: Math.floor(budget * 0.9),
      conversion_prob: prob
    };
  })
];

export const defaultReviews: ReviewRecord[] = [
  { review_id: "R-101", date: "2026-01-05", product_name: "Pulse Fitness Band", rating: 5, sentiment: "Positive", text: "Incredible battery life, and syncs seamlessly with my phone. Best health purchase this year!" },
  { review_id: "R-102", date: "2026-01-04", product_name: "Tessera Notebook Set", rating: 4, sentiment: "Positive", text: "Very premium feel to the paper. Perfect for journaling, though it's a bit heavy." },
  { review_id: "R-103", date: "2025-12-28", product_name: "Rio Yoga Mat", rating: 2, sentiment: "Negative", text: "A bit slippery during hot yoga sessions. Disappointed given the high price." },
  { review_id: "R-104", date: "2025-12-25", product_name: "Vanguard Jacket", rating: 3, sentiment: "Neutral", text: "Nice fit and styling, but not as warm as I expected for winter weather." },
  ...Array.from({ length: 256 }, (_, i) => {
    const prods = ["Pulse Fitness Band", "Vanguard Jacket", "Luna Ceramic Lamp", "Nimbus Backpack 22L", "Rio Yoga Mat", "Tessera Notebook Set"];
    const ratings = [5, 4, 3, 2, 5, 4, 5, 1, 4, 3];
    const rating = ratings[i % ratings.length];
    const sentiment: ReviewRecord['sentiment'] = rating >= 4 ? "Positive" : rating === 3 ? "Neutral" : "Negative";
    const texts = {
      Positive: "Absolutely love it, highly recommend for small businesses and productivity!",
      Neutral: "Average product, does what is expected but nothing revolutionary.",
      Negative: "Experienced issues with quality control. Customer service was slow to respond."
    };
    return {
      review_id: `R-${105 + i}`,
      date: new Date(Date.now() - (i % 30) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      product_name: prods[i % prods.length],
      rating,
      sentiment,
      text: texts[sentiment]
    };
  })
];
