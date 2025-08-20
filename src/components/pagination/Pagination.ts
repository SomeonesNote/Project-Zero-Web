import { Component, PaginationInfo, PaginationOptions } from '../../types';

export class Pagination implements Component {
  private container: HTMLElement;
  private options: PaginationOptions;
  private currentPage: number;
  private totalPages: number;

  constructor(container: HTMLElement, options: PaginationOptions) {
    this.container = container;
    this.options = options;
    this.currentPage = options.currentPage;
    this.totalPages = Math.ceil(options.totalItems / options.itemsPerPage);
    
    this.render();
    this.attachEventListeners();
  }

  render(): void {
    if (this.totalPages <= 1) {
      this.container.innerHTML = '';
      return;
    }

    this.container.innerHTML = `
      <div class="pagination">
        <button class="pagination-btn prev" ${this.currentPage === 1 ? 'disabled' : ''}>
          <span>‹</span>
        </button>
        
        <div class="pagination-numbers">
          ${this.generatePageNumbers()}
        </div>
        
        <button class="pagination-btn next" ${this.currentPage === this.totalPages ? 'disabled' : ''}>
          <span>›</span>
        </button>
      </div>
    `;
  }

  private generatePageNumbers(): string {
    const pages: string[] = [];
    const maxVisiblePages = 5;
    
    if (this.totalPages <= maxVisiblePages) {
      // 모든 페이지 표시
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(this.createPageButton(i));
      }
    } else {
      // 현재 페이지 주변의 페이지들만 표시
      let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
      let endPage = Math.min(this.totalPages, startPage + maxVisiblePages - 1);
      
      // 시작 페이지 조정
      if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }
      
      // 첫 페이지
      if (startPage > 1) {
        pages.push(this.createPageButton(1));
        if (startPage > 2) {
          pages.push('<span class="pagination-ellipsis">...</span>');
        }
      }
      
      // 중간 페이지들
      for (let i = startPage; i <= endPage; i++) {
        pages.push(this.createPageButton(i));
      }
      
      // 마지막 페이지
      if (endPage < this.totalPages) {
        if (endPage < this.totalPages - 1) {
          pages.push('<span class="pagination-ellipsis">...</span>');
        }
        pages.push(this.createPageButton(this.totalPages));
      }
    }
    
    return pages.join('');
  }

  private createPageButton(pageNumber: number): string {
    const isActive = pageNumber === this.currentPage;
    const activeClass = isActive ? 'active' : '';
    
    return `<button class="pagination-btn page ${activeClass}" data-page="${pageNumber}">${pageNumber}</button>`;
  }

  private attachEventListeners(): void {
    this.container.addEventListener('click', this.handleClick.bind(this));
  }

  private handleClick(e: Event): void {
    const target = e.target as HTMLElement;
    
    if (target.classList.contains('pagination-btn')) {
      e.preventDefault();
      
      if (target.classList.contains('prev')) {
        this.goToPage(this.currentPage - 1);
      } else if (target.classList.contains('next')) {
        this.goToPage(this.currentPage + 1);
      } else if (target.classList.contains('page')) {
        const pageNumber = parseInt(target.getAttribute('data-page') || '1');
        this.goToPage(pageNumber);
      }
    }
  }

  private goToPage(pageNumber: number): void {
    if (pageNumber < 1 || pageNumber > this.totalPages || pageNumber === this.currentPage) {
      return;
    }
    
    this.currentPage = pageNumber;
    
    // 커스텀 이벤트 발생
    const event = new CustomEvent('pageChange', {
      detail: { 
        currentPage: this.currentPage,
        totalPages: this.totalPages,
        itemsPerPage: this.options.itemsPerPage
      }
    });
    document.dispatchEvent(event);
    
    // 콜백 함수 호출
    if (this.options.onPageChange) {
      this.options.onPageChange(this.currentPage);
    }
    
    this.render();
  }

  goToFirstPage(): void {
    this.goToPage(1);
  }

  goToLastPage(): void {
    this.goToPage(this.totalPages);
  }

  goToPreviousPage(): void {
    this.goToPage(this.currentPage - 1);
  }

  goToNextPage(): void {
    this.goToPage(this.currentPage + 1);
  }

  setCurrentPage(pageNumber: number): void {
    if (pageNumber >= 1 && pageNumber <= this.totalPages) {
      this.currentPage = pageNumber;
      this.render();
    }
  }

  setTotalItems(totalItems: number): void {
    this.totalPages = Math.ceil(totalItems / this.options.itemsPerPage);
    
    // 현재 페이지가 총 페이지 수를 초과하면 마지막 페이지로 조정
    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages;
    }
    
    this.render();
  }

  getCurrentPage(): number {
    return this.currentPage;
  }

  getTotalPages(): number {
    return this.totalPages;
  }

  getPaginationInfo(): PaginationInfo {
    return {
      currentPage: this.currentPage,
      totalPages: this.totalPages,
      itemsPerPage: this.options.itemsPerPage,
      hasNextPage: this.currentPage < this.totalPages,
      hasPrevPage: this.currentPage > 1
    };
  }

  destroy(): void {
    // 이벤트 리스너 정리
    this.container.removeEventListener('click', this.handleClick.bind(this));
    
    // DOM 내용 정리
    this.container.innerHTML = '';
  }
}
