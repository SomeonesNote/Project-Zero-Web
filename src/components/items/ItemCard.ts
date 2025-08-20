import { Component, Item, ItemCardOptions, ItemGridOptions } from '../../types';

export class ItemCard implements Component {
  private container: HTMLElement;
  private options: ItemCardOptions;
  private element: HTMLElement;

  constructor(container: HTMLElement, options: ItemCardOptions) {
    this.container = container;
    this.options = options;
    this.element = this.createCard();
    
    this.container.appendChild(this.element);
    this.attachEventListeners();
  }

  private createCard(): HTMLElement {
    const card = document.createElement('div');
    card.className = 'item-card';
    card.dataset.itemId = this.options.item.id;
    
    const timeLeftClass = this.getTimeLeftClass();
    const conditionClass = this.getConditionClass();
    const conditionLabel = this.getConditionLabel();
    
    card.innerHTML = `
      <div class="item-image">
        <img src="${this.options.item.image}" alt="${this.options.item.title}">
        ${this.options.item.endingSoon ? '<div class="ending-soon-badge">마감임박</div>' : ''}
        <div class="condition-badge ${conditionClass}">${conditionLabel}</div>
      </div>
      
      <div class="item-content">
        <h3 class="item-title">${this.options.item.title}</h3>
        <p class="item-description">${this.options.item.description}</p>
        
        <div class="item-category">${this.options.item.category}</div>
        
        <div class="bid-info">
          <div class="starting-bid">
            <span class="label">시작가:</span>
            <span class="amount">₩${this.options.item.startingBid.toLocaleString()}</span>
          </div>
          <div class="current-bid">
            <span class="label">현재가:</span>
            <span class="amount">₩${this.options.item.currentBid.toLocaleString()}</span>
          </div>
          <div class="total-bids">
            <span class="label">입찰수:</span>
            <span class="count">${this.options.item.totalBids}회</span>
          </div>
        </div>
        
        <div class="seller-info">
          <span class="seller-name">${this.options.item.seller.name}</span>
          <span class="seller-rating">★${this.options.item.seller.rating}</span>
        </div>
        
        <div class="location-info">
          <span class="location">📍 ${this.options.item.location}</span>
        </div>
        
        <div class="item-tags">
          ${this.options.item.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
        </div>
        
        <div class="time-left ${timeLeftClass}">
          <span class="label">남은시간:</span>
          <span class="time">${this.getTimeLeft()}</span>
        </div>
        
        <div class="item-actions">
          <button class="btn btn-bid">입찰하기</button>
          <button class="btn btn-details">상세보기</button>
        </div>
      </div>
    `;
    
    return card;
  }

  private attachEventListeners(): void {
    // 카드 클릭 이벤트
    this.element.addEventListener('click', this.handleCardClick.bind(this));
    
    // 입찰 버튼 클릭 이벤트
    const bidBtn = this.element.querySelector('.btn-bid');
    if (bidBtn) {
      bidBtn.addEventListener('click', this.handleBidClick.bind(this));
    }
    
    // 상세보기 버튼 클릭 이벤트
    const detailsBtn = this.element.querySelector('.btn-details');
    if (detailsBtn) {
      detailsBtn.addEventListener('click', this.handleDetailsClick.bind(this));
    }
  }

  private handleCardClick(e: Event): void {
    // 버튼 클릭이 아닌 카드 영역 클릭일 때만 처리
    if ((e.target as HTMLElement).closest('.btn')) {
      return;
    }
    
    if (this.options.onCardClick) {
      this.options.onCardClick({ item: this.options.item });
    }
    
    // 커스텀 이벤트 발생
    const event = new CustomEvent('itemCardClick', {
      detail: { item: this.options.item }
    });
    document.dispatchEvent(event);
  }

  private handleBidClick(e: Event): void {
    e.stopPropagation();
    
    if (this.options.onBidClick) {
      this.options.onBidClick({ item: this.options.item });
    }
    
    // 커스텀 이벤트 발생
    const event = new CustomEvent('itemBidClick', {
      detail: { item: this.options.item }
    });
    document.dispatchEvent(event);
  }

  private handleDetailsClick(e: Event): void {
    e.stopPropagation();
    
    if (this.options.onDetailsClick) {
      this.options.onDetailsClick({ item: this.options.item });
    }
    
    // 커스텀 이벤트 발생
    const event = new CustomEvent('itemDetailsClick', {
      detail: { item: this.options.item }
    });
    document.dispatchEvent(event);
  }

  private getTimeLeft(): string {
    const now = new Date().getTime();
    const endTime = new Date(this.options.item.endTime).getTime();
    const timeLeft = endTime - now;
    
    if (timeLeft <= 0) {
      return '마감됨';
    }
    
    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) {
      return `${days}일 ${hours}시간`;
    } else if (hours > 0) {
      return `${hours}시간 ${minutes}분`;
    } else {
      return `${minutes}분`;
    }
  }

  private getTimeLeftClass(): string {
    const now = new Date().getTime();
    const endTime = new Date(this.options.item.endTime).getTime();
    const timeLeft = endTime - now;
    
    if (timeLeft <= 0) {
      return 'time-ended';
    } else if (timeLeft <= 1000 * 60 * 60) { // 1시간 이하
      return 'time-critical';
    } else if (timeLeft <= 1000 * 60 * 60 * 24) { // 24시간 이하
      return 'time-warning';
    }
    
    return '';
  }

  private getConditionClass(): string {
    switch (this.options.item.condition) {
      case 'new': return 'condition-new';
      case 'used': return 'condition-used';
      case 'vintage': return 'condition-vintage';
      case 'antique': return 'condition-antique';
      default: return 'condition-default';
    }
  }

  private getConditionLabel(): string {
    switch (this.options.item.condition) {
      case 'new': return '신품';
      case 'used': return '중고';
      case 'vintage': return '빈티지';
      case 'antique': return '골동품';
      default: return '상태미정';
    }
  }

  updateItem(item: Item): void {
    this.options.item = item;
    this.element.remove();
    this.element = this.createCard();
    this.container.appendChild(this.element);
    this.attachEventListeners();
  }

  render(): void {
    // 이미 구현됨
  }

  destroy(): void {
    // 이벤트 리스너 정리
    this.element.removeEventListener('click', this.handleCardClick.bind(this));
    
    const bidBtn = this.element.querySelector('.btn-bid');
    if (bidBtn) {
      bidBtn.removeEventListener('click', this.handleBidClick.bind(this));
    }
    
    const detailsBtn = this.element.querySelector('.btn-details');
    if (detailsBtn) {
      detailsBtn.removeEventListener('click', this.handleDetailsClick.bind(this));
    }
    
    // DOM에서 제거
    if (this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
  }
}

export class ItemGrid implements Component {
  private container: HTMLElement;
  private options: ItemGridOptions;
  private itemCards: ItemCard[];

  constructor(container: HTMLElement, options: ItemGridOptions) {
    this.container = container;
    this.options = options;
    this.itemCards = [];
    
    this.render();
  }

  render(): void {
    this.clear();
    
    this.options.items.forEach(item => {
      const itemCard = new ItemCard(this.container, {
        item,
        onCardClick: this.options.onItemClick || undefined,
        onBidClick: this.options.onBidClick || undefined,
        onDetailsClick: this.options.onDetailsClick || undefined
      });
      
      this.itemCards.push(itemCard);
    });
  }

  updateItems(items: Item[]): void {
    this.options.items = items;
    this.render();
  }

  addItem(item: Item): void {
    this.options.items.push(item);
    const itemCard = new ItemCard(this.container, {
      item,
      onCardClick: this.options.onItemClick || undefined,
      onBidClick: this.options.onBidClick || undefined,
      onDetailsClick: this.options.onDetailsClick || undefined
    });
    
    this.itemCards.push(itemCard);
  }

  removeItem(itemId: string): void {
    const index = this.options.items.findIndex(item => item.id === itemId);
    if (index !== -1) {
      this.options.items.splice(index, 1);
      this.render();
    }
  }

  clear(): void {
    this.itemCards.forEach(card => card.destroy());
    this.itemCards = [];
    this.container.innerHTML = '';
  }

  getItemCards(): ItemCard[] {
    return this.itemCards;
  }

  destroy(): void {
    this.clear();
  }
}
