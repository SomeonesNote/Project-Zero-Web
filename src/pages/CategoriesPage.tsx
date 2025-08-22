import { useNavigate } from "react-router-dom";
import { useCategories } from "@/hooks/useItems";
import LoadingSpinner from "@/components/LoadingSpinner";

const CategoriesPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: categories = [], isLoading, error } = useCategories();

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div>오류가 발생했습니다</div>;

  return (
    <div className="categories-page">
      <h1>카테고리</h1>
      <div className="categories-grid">
        {categories.map((category) => (
          <button
            key={category.id}
            className="category-card"
            onClick={() => navigate(`/category/${category.id}`)}
          >
            <h3>{category.name}</h3>
            <span>{category.count}개 상품</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoriesPage;
