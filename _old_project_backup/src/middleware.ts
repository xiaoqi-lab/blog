import type { MiddlewareHandler } from 'astro';

export const onRequest: MiddlewareHandler = async (context, next) => {
  const url = context.url;
  const pathname = url.pathname;
  
  // Skip middleware for static assets
  if (
    pathname.startsWith('/_astro/') ||
    pathname.startsWith('/favicon') ||
    pathname.startsWith('/fonts/') ||
    pathname.startsWith('/images/') ||
    pathname.includes('.') ||
    pathname.startsWith('/rss.xml') ||
    pathname.startsWith('/sitemap')
  ) {
    return next();
  }
  
  // Determine language from path
  let lang: 'en' | 'zh' = 'en';
  
  if (pathname.startsWith('/zh')) {
    lang = 'zh';
  } else if (pathname.startsWith('/en')) {
    lang = 'en';
  } else {
    // For root path, check cookie first, then default to 'en'
    const cookieLang = context.cookies.get('preferred-language')?.value;
    if (cookieLang === 'zh' || cookieLang === 'en') {
      lang = cookieLang;
    }
  }
  
  // Set language in context - this is critical for components to access
  context.locals.lang = lang;
  
  return next();
}

