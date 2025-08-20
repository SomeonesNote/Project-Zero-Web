import { Component, SearchBarOptions } from '../../types';

export class SearchBar implements Component {
  private container: HTMLElement;
  private options: SearchBarOptions;
  private input: HTMLInputElement;
  private suggestionsContainer: HTMLElement;

  constructor(container: HTMLElement, options: SearchBarOptions) {
    this.container = container;
    this.options = options;
    this.input = this.createInput();
    this.suggestionsContainer = this.createSuggestionsContainer();
    
    this.container.appendChild(this.input);
    this.container.appendChild(this.suggestionsContainer);
    
    this.attachEventListeners();
  }

  private createInput(): HTMLInputElement {
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = this.options.placeholder || '검색어를 입력하세요...';
    input.className = `search-input ${this.options.size || 'medium'}`;
    
    if (this.options.value) {
      input.value = this.options.value;
    }
    
    return input;
  }

  private createSuggestionsContainer(): HTMLElement {
    const container = document.createElement('div');
    container.className = 'search-suggestions';
    container.style.display = 'none';
    return container;
  }

  private attachEventListeners(): void {
    this.input.addEventListener('input', this.handleInput.bind(this));
    this.input.addEventListener('keypress', this.handleKeypress.bind(this));
    this.input.addEventListener('focus', this.handleFocus.bind(this));
    this.input.addEventListener('blur', this.handleBlur.bind(this));
    
    // 검색 제안 클릭 이벤트
    this.suggestionsContainer.addEventListener('click', this.handleSuggestionClick.bind(this));
  }

  private handleInput(e: Event): void {
    const target = e.target as HTMLInputElement;
    const value = target.value;
    
    // 커스텀 이벤트 발생
    const event = new CustomEvent('searchInput', {
      detail: { value, searchBarId: this.options.id }
    });
    document.dispatchEvent(event);
    
    // 검색 제안 표시
    this.showSuggestions(value);
  }

  private handleKeypress(e: KeyboardEvent): void {
    if (e.key === 'Enter') {
      this.handleSubmit();
    }
  }

  private handleFocus(): void {
    if (this.input.value) {
      this.showSuggestions(this.input.value);
    }
  }

  private handleBlur(): void {
    // 약간의 지연을 두어 클릭 이벤트가 처리될 수 있도록 함
    setTimeout(() => {
      this.hideSuggestions();
    }, 200);
  }

  private handleSuggestionClick(e: Event): void {
    const target = e.target as HTMLElement;
    if (target.classList.contains('suggestion-item')) {
      const suggestion = target.textContent || '';
      this.input.value = suggestion;
      this.hideSuggestions();
      this.handleSubmit();
    }
  }

  private handleSubmit(): void {
    const value = this.input.value.trim();
    if (value) {
      // 커스텀 이벤트 발생
      const event = new CustomEvent('searchSubmit', {
        detail: { value, searchBarId: this.options.id }
      });
      document.dispatchEvent(event);
      
      this.hideSuggestions();
    }
  }

  private showSuggestions(query: string): void {
    if (!query.trim()) {
      this.hideSuggestions();
      return;
    }

    // 간단한 검색 제안 생성 (실제로는 API에서 가져올 수 있음)
    const suggestions = this.generateSuggestions(query);
    
    if (suggestions.length > 0) {
      this.suggestionsContainer.innerHTML = suggestions
        .map(suggestion => `<div class="suggestion-item">${suggestion}</div>`)
        .join('');
      this.suggestionsContainer.style.display = 'block';
    } else {
      this.hideSuggestions();
    }
  }

  private hideSuggestions(): void {
    this.suggestionsContainer.style.display = 'none';
  }

  private generateSuggestions(query: string): string[] {
    // 간단한 제안 생성 로직
    const baseSuggestions = [
      '전자제품', '의류', '도서', '스포츠용품', '가구', '예술품',
      '자동차', '부동산', '골동품', '수집품', '음악', '영화'
    ];
    
    return baseSuggestions.filter(suggestion => 
      suggestion.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 5);
  }

  getValue(): string {
    return this.input.value;
  }

  setValue(value: string): void {
    this.input.value = value;
  }

  focus(): void {
    this.input.focus();
  }

  clear(): void {
    this.input.value = '';
    this.hideSuggestions();
  }

  render(): void {
    // 이미 생성된 요소들이 있으므로 추가 렌더링 불필요
  }

  destroy(): void {
    // 이벤트 리스너 정리
    this.input.removeEventListener('input', this.handleInput.bind(this));
    this.input.removeEventListener('keypress', this.handleKeypress.bind(this));
    this.input.removeEventListener('focus', this.handleFocus.bind(this));
    this.input.removeEventListener('blur', this.handleBlur.bind(this));
    
    // DOM에서 제거
    if (this.input.parentNode) {
      this.input.parentNode.removeChild(this.input);
    }
    if (this.suggestionsContainer.parentNode) {
      this.suggestionsContainer.parentNode.removeChild(this.suggestionsContainer);
    }
  }
}
