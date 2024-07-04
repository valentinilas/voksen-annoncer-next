import { useRouter } from 'next/navigation';

export const handleChangeLanguage = (lang) => {
  const router = useRouter();
  
  // Assuming you're using path-based routing for locales
  const path = window.location.pathname;
  const currentLang = path.split('/')[1]; // Get current language from URL
  
  // Replace the current language in the path with the new language
  const newPath = path.replace(`/${currentLang}`, `/${lang}`);
  
  // Navigate to the new path
  router.push(newPath);
};