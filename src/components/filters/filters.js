'use client';



import Button from "../button/button";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useTranslations } from "next-intl";
import translateArray from "@/utils/translations/translate-array";
import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from 'next/navigation'


export default function Filters({ categories, regions }) {

  const t = useTranslations();

  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Selection state
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSubCategory, setSelectedSubCategory] = useState('all');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');



  // Handle change in main category selection
  const handleMainCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setSelectedSubCategory('all'); // Reset sub-category selection
  };

  // Handle change in sub category selection
  const handleSubCategoryChange = (e) => {
    setSelectedSubCategory(e.target.value);
  };

  // Handle search form submission
  const handleSearch = (e) => {
    e.preventDefault();
    // Navigate to search results page with updated query parameters
    updateQueryParams();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      // Navigate to search results page with updated query parameters
      updateQueryParams();
    }
  }

  const updateQueryParams = () => {
    const params = new URLSearchParams(searchParams);
    // Reset to page 1
    params.set('page', 1);

    if (selectedCategory !== 'all') {
      params.set('category', selectedCategory);
    } else {
      params.delete('category');
    }

    if (selectedSubCategory !== 'all') {
      params.set('subcategory', selectedSubCategory);
    } else {
      params.delete('subcategory');
    }

    if (selectedRegion !== 'all') {
      params.set('region', selectedRegion);
    } else {
      params.delete('region');
    }

    if (searchTerm.trim() !== '') {
      params.set('search', searchTerm.trim());
    } else {
      params.delete('search');
    }

    router.push(`${pathname}?${params.toString()}`);
  };

  useEffect(() => {
    setSelectedCategory(searchParams.get('category') || 'all');
    setSelectedSubCategory(searchParams.get('subcategory') || 'all');
    setSelectedRegion(searchParams.get('region') || 'all');
    setSearchTerm(searchParams.get('search') || '');
  }, []);





  // Render options for sub-categories based on selected main category
  const renderSubCategoryOptions = () => {
    const mainCategory = categories.find(cat => cat.category_id === Number(selectedCategory));
    if (mainCategory && mainCategory.ad_sub_categories) {
      const subCategories = mainCategory.ad_sub_categories || [];


      const translatedSubCategories = translateArray(t, 'subcategories', 'sub_category_name', subCategories);
      return translatedSubCategories.map(subcategory => (
        <option key={subcategory.sub_category_id} value={subcategory.sub_category_id}>{subcategory.sub_category_name}</option>
      ));
    }
    return null;
  };


  const translatedCategories = categories
    ? translateArray(t, 'categories', 'category_name', categories)
    : [];


  return (
    <section className="bg-base-100 p-5  rounded-box shadow-sm">
      <div className="flex flex-col md:flex-row gap-4 items-start justify-start">
        <div className="filter-group rounded-md w-full">

          <input
            className="input input-bordered w-full "
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={`${t("filters.Search")}...`}
            onKeyDown={handleKeyDown}
          />
        </div>
        <div className="filter-group w-full">
          <>
            <select
              className="select select-bordered w-full"
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}>
              <option value="all">{t("filters.All locations")}</option>
              {regions.map(region => (
                <option key={region.id} value={region.id}>{region.region_name}</option>
              ))}
            </select>
          </>
        </div>
        <div className="filter-group w-full">
          <>
            <select
              className="select select-bordered w-full"
              value={selectedCategory}
              onChange={handleMainCategoryChange}>
              <option value="all">{t("categories.All categories")}</option>
              {translatedCategories.map(category => (
                <option key={category.category_id} value={category.category_id}>{category.category_name}</option>
              ))}
            </select>

          </>
        </div>

        <div className="filter-group w-full">
          <>
            <select
              className="select select-bordered w-full "
              value={selectedSubCategory}
              onChange={handleSubCategoryChange}>
              <option value="all">{t("subcategories.All sub-categories")}</option>
              {renderSubCategoryOptions()}
            </select>
          </>
        </div>


        <Button variant="secondary" Icon={MagnifyingGlassIcon} onClick={handleSearch}>{t("filters.Filter")}</Button>
      </div>
    </section>
  );
}
