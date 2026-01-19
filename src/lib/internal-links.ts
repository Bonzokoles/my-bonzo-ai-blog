import categoryRelations from '../data/category-relations.json';

type CategoryKey = keyof typeof categoryRelations;

interface CategoryRelation {
  slug: string;
  parent: string | null;
  related: string[];
  keywords: string[];
}

/**
 * Retrieves the relation data for a specific category.
 * @param category The category name as defined in category-relations.json
 */
export function getCategoryData(category: string): CategoryRelation | null {
  if (category in categoryRelations) {
    return (categoryRelations as Record<string, CategoryRelation>)[category];
  }
  return null;
}

/**
 * Returns a list of related categories (including parent and explicitly related ones).
 * @param category The category name
 */
export function getRelatedCategories(category: string): string[] {
  const data = getCategoryData(category);
  if (!data) return [];

  const relations = new Set<string>();
  
  if (data.parent) {
    relations.add(data.parent);
  }
  
  if (data.related) {
    data.related.forEach(rel => relations.add(rel));
  }

  // Also verify reverse relationships (if A lists B as related, B should implicitly relate to A - optional, but good for graph density)
  // For now, we stick to explicit definition to keep control.

  return Array.from(relations);
}

/**
 * Generates a list of suggested internal links based on content keywords.
 * This function scans the text for keywords associated with other categories
 * and returns a list of categories that are mentioned or relevant.
 * 
 * @param content The resource content (text)
 * @param currentCategory The current category of the resource (to exclude self)
 */
export function suggestRelatedCategoriesByContent(content: string, currentCategory: string): string[] {
  const suggested = new Set<string>();
  const lowerContent = content.toLowerCase();

  Object.entries(categoryRelations).forEach(([catName, data]) => {
    if (catName === currentCategory) return;

    // Check if the category name itself is mentioned
    if (lowerContent.includes(catName.toLowerCase())) {
        suggested.add(catName);
        return;
    }

    // Check for keywords
    for (const keyword of data.keywords) {
      if (lowerContent.includes(keyword.toLowerCase())) {
        suggested.add(catName);
        break; // Found one keyword for this category, sufficient to suggest
      }
    }
  });

  return Array.from(suggested);
}

/**
 * Simple HTML injection to link keywords to category pages.
 * WARNING: This is a basic string replacement. In a full production env, 
 * usage of a DOM parser or AST transformer (like rehype) is recommended to avoid breaking HTML tags.
 * 
 * @param htmlContent The HTML content of the post
 * @param currentCategory The current category to avoid self-linking
 */
export function autolinkKeywords(htmlContent: string, currentCategory: string, baseUrl: string = '/category/'): string {
    let newContent = htmlContent;

    // Sort categories by length desc to replace longest phrases first
    const categories = Object.entries(categoryRelations).sort((a, b) => b[0].length - a[0].length);

    categories.forEach(([catName, data]) => {
        if (catName === currentCategory) return;

        const slug = data.slug;
        const url = `${baseUrl}${slug}`;
        
        // Regex to match keyword not already inside a link or attribute
        // This is complex in regex alone. 
        // Strategy: Only link the *first* occurrence of the category name itself to be safe and conservative.
        
        const regex = new RegExp(`(\\b${catName}\\b)(?![^<]*>|[^<>]*<\/a>)`, 'i');
        
        // Replace only the first occurrence
        newContent = newContent.replace(regex, `<a href="${url}" class="internal-link" title="Więcej w kategorii ${catName}">$1</a>`);
    });

    return newContent;
}
