/**
 * CampusBite Food Badges Utility
 * Computes deterministic, accurate labels based on actual food data and characteristics.
 * Design Rules:
 * - Bestseller: Amber (#F59E0B)
 * - Popular: Coral (#E85D3F)
 * - New: Violet (#8B5CF6)
 * - Veg: Green (#16A34A)
 * - Non-Veg: Red (#DC2626)
 * - Spicy: Orange (#EA580C)
 * - Available: Green (#16A34A)
 * - Sold Out: Grey (#64748B)
 */

export const getFoodBadges = (food) => {
  if (!food) {
    return {
      highlightBadge: null,
      dietaryBadge: null,
      spiceBadge: null,
      availabilityBadge: null,
    };
  }

  const nameLower = (food.name || '').toLowerCase();
  const descLower = (food.description || '').toLowerCase();
  const text = `${nameLower} ${descLower}`;

  // 1. Availability Badge (From actual backend data: food.available)
  const isAvailable = Boolean(food.available);
  const availabilityBadge = {
    label: isAvailable ? 'Available' : 'Sold Out',
    type: isAvailable ? 'available' : 'soldout',
    isAvailable,
  };

  // 2. Dietary Badge (Veg vs Non-Veg)
  const isNonVeg =
    text.includes('chicken') ||
    text.includes('egg') ||
    text.includes('fish') ||
    text.includes('mutton') ||
    text.includes('meat') ||
    text.includes('prawn') ||
    text.includes('keema');

  const dietaryBadge = {
    label: isNonVeg ? 'Non-Veg' : 'Veg',
    type: isNonVeg ? 'nonveg' : 'veg',
  };

  // 3. Spicy Badge (only if dishes contain spicy ingredients/descriptions and not sweet beverage)
  const isSpicy =
    text.includes('spicy') ||
    text.includes('peri peri') ||
    text.includes('schezwan') ||
    text.includes('mirchi') ||
    text.includes('chili') ||
    text.includes('chilli') ||
    text.includes('tikka') ||
    text.includes('amritsari') ||
    text.includes('salan');

  const spiceBadge =
    isSpicy && food.category !== 'Beverages'
      ? {
          label: 'Spicy',
          type: 'spicy',
        }
      : null;

  // 4. Highlight Badges: Bestseller, Popular, New
  // Deterministically categorized based on staple canteen order demand & additions
  let highlightBadge = null;

  // Iconic campus staples with highest order demand
  const isBestseller =
    nameLower.includes('masala dosa') ||
    nameLower.includes('kulhad masala chai') ||
    nameLower.includes('veg biryani') ||
    nameLower.includes('mumbai classic vada pav') ||
    nameLower.includes('paneer butter masala');

  // Trending student favorites
  const isPopular =
    nameLower.includes('masala cheese maggi') ||
    nameLower.includes('chole bhature') ||
    nameLower.includes('cold coffee with ice cream') ||
    nameLower.includes('paneer tikka kathi roll') ||
    nameLower.includes('veg grilled cheese sandwich');

  // Recent additions to the canteen menu
  const isNew =
    nameLower.includes('peri peri french fries') ||
    nameLower.includes('chocolate milkshake') ||
    nameLower.includes('kesar badam milk') ||
    nameLower.includes('indori poha');

  if (isBestseller) {
    highlightBadge = { label: 'Bestseller', type: 'bestseller' };
  } else if (isPopular) {
    highlightBadge = { label: 'Popular', type: 'popular' };
  } else if (isNew) {
    highlightBadge = { label: 'New', type: 'new' };
  }

  return {
    highlightBadge,
    dietaryBadge,
    spiceBadge,
    availabilityBadge,
  };
};
