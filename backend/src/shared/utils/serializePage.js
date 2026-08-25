export const serializePage = (page, context = "admin") => {
  if (!page) return null;

  const base = {
    id: page.id,
    title: page.title,
    slug: page.slug,
    fullPath: page.fullPath,
    excerpt: page.excerpt,
    content: page.content,
    status: page.status,
    template: page.template,
    templateKey: page.templateKey,
    templateVersion: page.templateVersion,
    
    metaTitle: page.metaTitle,
    metaDescription: page.metaDescription,
    metaKeywords: page.metaKeywords,

    includeInSitemap: page.includeInSitemap,
    noIndex: page.noIndex,
    noFollow: page.noFollow,
    canonicalUrl: page.canonicalUrl,
    ogTitle: page.ogTitle,
    ogDescription: page.ogDescription,
    
    publishedAt: page.publishedAt,
    scheduledUpdateAt: page.scheduledUpdateAt,
    createdAt: page.createdAt,
    updatedAt: page.updatedAt,
    
    author: page.author ? { name: page.author.name } : null,
    
    featuredImage: page.featuredImage 
      ? { url: page.featuredImage.url, thumbnailUrl: page.featuredImage.thumbnailUrl } 
      : null,
      
    ogImage: page.ogImage 
      ? { url: page.ogImage.url, thumbnailUrl: page.ogImage.thumbnailUrl } 
      : null,
  };

  if (context === "admin") {
    return {
      ...base,
      parentId: page.parentId,     
      menuOrder: page.menuOrder,   
      showInMenu: page.showInMenu, 
      authorId: page.authorId,
      updatedById: page.updatedById,
      deletedAt: page.deletedAt,
      ogImageId: page.ogImageId, 
      
      author: page.author ? { id: page.author.id, name: page.author.name, email: page.author.email } : null,
      
      featuredImage: page.featuredImage 
        ? { id: page.featuredImage.id, url: page.featuredImage.url, thumbnailUrl: page.featuredImage.thumbnailUrl } 
        : null,
        
      ogImage: page.ogImage 
        ? { id: page.ogImage.id, url: page.ogImage.url, thumbnailUrl: page.ogImage.thumbnailUrl } 
        : null,
    };
  }

  return base;
};