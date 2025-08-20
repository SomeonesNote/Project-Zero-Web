import { Category, Component } from '../../types';

export interface CategoryTagsOptions {
  categories: Category[];
  multiSelect?: boolean;
  defaultSelected?: string[];
  onCategoryChange?: (selectedCategories: string[]) => void;
}

export class CategoryTags implements Component {
  private container: HTMLElement;
  private options: CategoryTagsOptions;
  private selectedCategories: Set<string>;

  constructor(container: HTMLElement, options: CategoryTagsOptions) {
    this.container = container;
    this.options = options;
    this.selectedCategories = new Set(options.defaultSelected || []);
    
    this.render();
    this.attachEventListeners();
  }

  render(): void {
    this.container.innerHTML = '';
    
    this.options.categories.forEach(category => {
      const tag = document.createElement('div');
      tag.className = 'category-tag';
      tag.dataset.categoryId = category.id;
      
      if (this.selectedCategories.has(category.id)) {
        tag.classList.add('active');
      }
      
      tag.innerHTML = `
        <span class="category-name">${category.name}</span>
        <span class="category-count">(${category.count || 0})</span>
      `;
      
      this.container.appendChild(tag);
    });
  }

  private attachEventListeners(): void {
    this.container.addEventListener('click', this.handleTagClick.bind(this));
  }

  private handleTagClick(e: Event): void {
    const target = e.target as HTMLElement;
    const tag = target.closest('.category-tag') as HTMLElement;
    
    if (!tag) return;
    
    const categoryId = tag.dataset.categoryId;
    if (!categoryId) return;
    
    if (this.options.multiSelect) {
      this.toggleCategory(categoryId);
    } else {
      this.selectSingleCategory(categoryId);
    }
    
    this.updateDisplay();
    this.notifyChange();
  }

  private toggleCategory(categoryId: string): void {
    if (this.selectedCategories.has(categoryId)) {
      this.selectedCategories.delete(categoryId);
    } else {
      this.selectedCategories.add(categoryId);
    }
  }

  private selectSingleCategory(categoryId: string): void {
    this.selectedCategories.clear();
    this.selectedCategories.add(categoryId);
  }

  private updateDisplay(): void {
    const tags = this.container.querySelectorAll('.category-tag');
    
    tags.forEach(tag => {
      const categoryId = tag.getAttribute('data-category-id');
      if (categoryId && this.selectedCategories.has(categoryId)) {
        tag.classList.add('active');
      } else {
        tag.classList.remove('active');
      }
    });
  }

  private notifyChange(): void {
    const selectedArray = Array.from(this.selectedCategories);
    
    // 커스텀 이벤트 발생
    const event = new CustomEvent('categoryChange', {
      detail: { selectedCategories: selectedArray }
    });
    document.dispatchEvent(event);
    
    // 콜백 함수 호출
    if (this.options.onCategoryChange) {
      this.options.onCategoryChange(selectedArray);
    }
  }

  getSelectedCategories(): string[] {
    return Array.from(this.selectedCategories);
  }

  setSelectedCategories(categoryIds: string[]): void {
    this.selectedCategories.clear();
    categoryIds.forEach(id => this.selectedCategories.add(id));
    this.updateDisplay();
  }

  selectCategory(categoryId: string): void {
    this.selectedCategories.add(categoryId);
    this.updateDisplay();
  }

  deselectCategory(categoryId: string): void {
    this.selectedCategories.delete(categoryId);
    this.updateDisplay();
  }

  clearSelection(): void {
    this.selectedCategories.clear();
    this.updateDisplay();
  }

  updateCategories(categories: Category[]): void {
    this.options.categories = categories;
    this.render();
    this.attachEventListeners();
  }

  destroy(): void {
    // 이벤트 리스너 정리
    this.container.removeEventListener('click', this.handleTagClick.bind(this));
    
    // DOM 내용 정리
    this.container.innerHTML = '';
  }
}
