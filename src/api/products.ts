import axios from "axios"
import { API_URL } from "../configs"

let All_Categories:string[] = []
let All_Brands:string[] = []
const categoryBrandMap: Record<string, string[]> = {};



export const FetchAllProducts = async (limit: number) => {
    try {
        const res = await axios.get(`${API_URL}/products/?limit=${limit}`);
        if (res?.status === 200) {
            const productsData = res.data;
            
            // Reset arrays
            All_Categories = [];
            All_Brands = [];
      
            
            productsData.forEach((product: any) => {
                const productCategories = product.categories ?? [];
                const productBrands = product.brands ?? [];
                
                // Collect unique categories
                productCategories.forEach((name: string) => {
                    if (!All_Categories.includes(name)) {
                        All_Categories.push(name);
                    }
                });
                
                // Collect unique brands
                productBrands.forEach((name: string) => {
                    if (!All_Brands.includes(name)) {
                        All_Brands.push(name);
                    }
                });
                
                // Build category-brand mapping as plain object
                productCategories.forEach((category: string) => {
                    if (!categoryBrandMap[category]) {
                        categoryBrandMap[category] = [];
                    }
                    
                    productBrands.forEach((brand: string) => {
                        if (!categoryBrandMap[category].includes(brand)) {
                            categoryBrandMap[category].push(brand);
                        }
                    });
                });
            });
            
            // Convert to array format if needed for your slice
            const categoryBrandsArray = Object.entries(categoryBrandMap).map(([category, brands]) => ({
                cat: category,
                brands: brands
            }));
            
            return {
                Categories: All_Categories,
                Brands: All_Brands,
                Products: productsData,
                Category_Brands_Map: categoryBrandsArray 
            };
        }
        return { Categories: [], Brands: [], Products: [], Category_Brands_Map: [] };
    } catch (error) {
        console.error('Error fetching products:', error);
        return { Categories: [], Brands: [], Products: [], Category_Brands_Map: [] };
    }
};

export const SearchProduct = async (search_term: string, limit = 50) => {
    try {
        const response = await axios.get(`${API_URL}/products/?name=${search_term}&limit=${limit}`);

        
        if (response?.status === 200) {
return response?.data
           
        }
        return [];
    } catch (error) {
        console.error('Error searching products:', error);
        return [];
    }
};