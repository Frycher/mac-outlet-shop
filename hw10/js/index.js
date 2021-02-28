document.addEventListener('DOMContentLoaded', () => {
  var mySwiper = new Swiper('.swiper-container', {
    direction: 'horizontal',
    loop: true,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
  });

  const cElem = (tag, className, text) => {
    const elem = document.createElement(tag);
    elem.className = className || '';
    elem.innerText = text || '';
    return elem;
  };
  const gElem = (param) => {
    const elem = document.querySelector(param);
    elem.clear = function () {
      this.innerHTML = '';
      return this;
    };
    elem.add = function (listOfElems) {
      this.append(...listOfElems);
      return this;
    };
    return elem;
  };

  const listContainer = gElem('.items-card');
  const mainContentContainer = gElem('.modal-append');

  const closeModal = () => {
    const cardModal = document.querySelector('.modal-append');
    cardModal.addEventListener('click', (e) => {
      const $target = e.target;
      if ($target.className == 'card-modal') {
        cardModal.querySelector('.card-modal').remove();
      }
    });
  };
  closeModal();

  const modalTemplate = (device) => {
    return `
    <div class="card-modal">
      <div class="card-modal__wrapper">
        <div class="modal__img">
          <img src="img/${device.imgUrl}" alt="">
        </div>

        <div class="modal__info">
          <div class="title">${device.name}</div>

          <div class="reviews">
            <div class="modal__reviews ">
                <div class="reviews__block">
                    <div class="ico">
                        <img src="img/icons/card__liked-bottom.svg" alt="">
                    </div>
                    <div class="percent">${device.orderInfo.reviews}%</div>&nbsp;
                    Positive reviews
                </div>
                <div class="num">485</div>
            </div>
            <div class="modal__above">
              <div class="avarage">
                  Above avarage
              </div>
              <div class="orders">orders</div>
            </div>

        </div>

          <div class="info__item">
            Color: <span>${device.color}</span>
          </div>
          <div class="info__item">
            Operating System: <span>${device.os ? device.os : '-'}</span>
          </div>
          <div class="info__item">
            Chip: <span>${device.chip.name}</span>
          </div>
          <div class="info__item">
            Height: <span>${device.size.height} cm</span>
          </div>
          <div class="info__item">
            Width: <span>${device.size.width} cm</span>
          </div>
          <div class="info__item">
            Depth: <span>${device.size.depth} cm</span>
          </div>
          <div class="info__item">
            Weight: <span>${device.size.weight} g</span>
          </div>
          <div class="info__item">
            Memmory: <span>${device.ram ? device.ram : ''} GB</span>
          </div>
        </div>

        <div class="modal__price">
            <div class="price">$ ${device.price}</div>
            <div class="stock">Stock: <b>${device.orderInfo.inStock}</b> pcs.</div>
            ${
              device.orderInfo.inStock >= 1
                ? `
              <div class="btn">Add to cart</div> 
            `
                : `
              <div class="btn disabled">Add to cart</div> 
            `
            }
            
        </div>
      </div>
    </div>

  `;
  };

  const renderCard = (device) => {
    const container = cElem('div', 'card');

    const cardBtn = cElem('div', null, 'card__btn');
    cardBtn.addEventListener('click', (e) => {
      cartInstance.addToCart(device.id);
      console.log(1);
    });
    const template = `
    <div class="card__wrapp">
      <div class="card__favorite">
          <img src="img/icons/like_empty.svg" alt="like">
      </div>
      <div class="card__img">
          <img src="img/${device.imgUrl}" alt="">
      </div>
      <div class="card__name">
          ${device.name}
      </div>
      <div class="card__stock">
        ${
          device.orderInfo.inStock >= 1
            ? `<div class="ico">
            <img src="img/icons/stock.svg" alt="stock">
          </div>`
            : `
          <div class="ico">
            <img src="img/icons/close-stock.svg" alt="stock">
          </div>
          `
        }
        <div class="count">
          ${device.orderInfo.inStock}
        </div> 
        left in stock
      </div>
      <div class="card__price">
        Price: <span>${device.price}</span> $
      </div>
      ${
        device.orderInfo.inStock >= 1
          ? `
          <button class="card__btn">Add to cart</button>
        `
          : `
          <button class="card__btn disabled">Add to cart</button>
        `
      }
      
    </div>
    <div class="card__bottom">
      <div class="card__reviews ">
        <div class="reviews">
            <div class="ico">
                <img src="img/icons/card__liked-bottom.svg" alt="">
            </div>
            <div class="percent">${device.orderInfo.reviews}%</div>
            Positive reviews
        </div>
        <div class="num">485</div>
      </div>
    
      <div class="card__above">
        <div class="avarage">
            Above avarage
        </div>
        <div class="orders">orders</div>
      </div>
    </div>


  `;
    container.addEventListener('click', (e) => {
      const $target = e.target;
      if ($target.className !== 'card__btn') {
        mainContentContainer.innerHTML = modalTemplate(device);
      }
    });

    container.innerHTML = template;
    return container;
  };

  const renderCards = (list) => {
    const elems = list.map((item) => renderCard(item));
    listContainer.clear().add(elems);
  };
  renderCards(items);

  const renderWithFilters = (filtersArr) => {
    const filtredItems = items.filter((item) => {
      const isPrice = item.price >= filtersArr[0].changes.from && item.price <= filtersArr[0].changes.to;
      const isColors = !filtersArr[1].checked.length || item.color.some((color) => filtersArr[1].checked.includes(color));
      const isMemmory = !filtersArr[2].checked.length || filtersArr[2].checked.includes(item.ram);
      const isOS = !filtersArr[3].checked.length || filtersArr[3].checked.includes(item.os);
      const isDisplay = !filtersArr[4].checked.length || filtersArr[4].checked.includes(item.ram);
      return isPrice && isColors && isMemmory && isOS && isDisplay;
    });
    renderCards(filtredItems);
  };
  class Utils {
    constructor() {
      this.colors = this._getColors();
      this.priceRange = this._getPriceRange();
      this.ram = this._getMemory();
      this.display = this._getDisplay();
      this.os = this._getOS();
    }

    _getColors() {
      const result = [];
      items.forEach((item) => {
        result.push(...item.color);
      });

      return result.filter((item, index, arr) => (item ? index == arr.indexOf(item) : item));
    }
    _getPriceRange() {
      const sortedByAsc = [...items].sort((a, b) => a.price - b.price);

      return {
        from: sortedByAsc[0].price,
        to: sortedByAsc[sortedByAsc.length - 1].price,
      };
    }
    _getMemory() {
      return items.map((item) => item.ram).filter((item, index, arr) => (item ? index == arr.indexOf(item) : item));
    }
    _getDisplay() {
      return items.map((item) => item.display).filter((item, index, arr) => (item ? index == arr.indexOf(item) : item));
    }
    _getOS() {
      return items.map((item) => item.os).filter((item, index, arr) => (item ? index == arr.indexOf(item) : item));
    }
  }

  const utils = new Utils();
  console.log(utils);

  class Filter {
    constructor() {
      this.filterArr = [
        {
          type: 'range',
          title: 'Price',
          variant: utils.priceRange,
          changes: {
            ...utils.priceRange,
          },
        },
        {
          type: 'check',
          title: 'Color',
          variants: utils.colors,
          checked: [],
          index:1
        },
        {
          type: 'check',
          title: 'Memory',
          unit: 'Gb',
          variants: utils.ram,
          checked: [],
          index:2,
        },
        {
          type: 'check',
          title: 'OS',
          variants: utils.os,
          checked: [],
          index: 3,
        },
        {
          type: 'check',
          title: 'Display',
          variants: utils.display,
          unit: 'inch',
          checked: [],
          index: 4,
        },
      ];
    }

    changePrice = (type, price) => {
      this.filterArr[0].changes[type] = price;
      renderWithFilters(this.filterArr);
    };

    changeFilterCategory = (item, index) => {
      const indexInFilter = this.filterArr[index].checked.indexOf(item);
      if (indexInFilter > -1) {
        this.filterArr[index].checked.splice(indexInFilter, 1);
      } else {
        this.filterArr[index].checked.push(item);
      }
      renderWithFilters(this.filterArr);
    };
  }

  class RenderFilter extends Filter {
    constructor() {
      super();
      this.renderFilters();
      console.log(this);
    }

    get contentRenderMethods() {
      return {
        check: this._renderContentCheck.bind(this),
        range: this._renderContentRange.bind(this),
      };
    }

    renderFilters() {
      const container = document.querySelector('.filter-container');
      const elems = this.filterArr.map((item) => this._renderCategory(item));
      container.innerHTML = '';
      container.append(...elems);
    }
    inputNum(e) {
      e.target.value = e.target.value.replace(/\D/g, '');
    }

    _renderCategory(item) {
      const container = cElem('div', 'filter-item');
      const title = cElem('div', 'filter-item_title');
      title.innerHTML = `
        <span>${item.title}</span>
        <div class="arrow"></div>
        `;
      title.onclick = function () {
        this.classList.toggle('filter-item_title--active');
        const content = this.parentElement.children[1];
        content.classList.toggle('filter-item_content--active');
      };

      const content = cElem('div', 'filter-item_content');
      const getContent = this.contentRenderMethods[item.type];
      const filterContent = getContent(item);
      content.append(...filterContent);
      container.append(title, content);
      return container;
    }

    _renderContentCheck(item) {
      const unit = item.unit ? item.unit : '';
      return item.variants.map((variant, index, array) => {
        const filterItem = cElem('div', 'body-check');
        const label = cElem('label', 'check-filter');
        const title = cElem('span', 'custom-label', variant);
        const units = cElem('span', 'unit-label', unit);
        const inp = cElem('input');
        inp.type = 'checkbox';
        inp.onchange = (e) => {
          console.log(item.id);
          this.changeFilterCategory(variant, item.index);
        };
        label.append(inp, title, units);
        filterItem.append(label);
        return filterItem;
      });
    }

    _renderContentRange(item) {
      const containerFrom = cElem('div', 'filter-from__wrapp');
      const labelFrom = cElem('label', 'label');
      labelFrom.innerText = 'From';
      const inputFrom = cElem('input', 'filter-input');
      inputFrom.value = item.variant.from;

      inputFrom.oninput = (e) => {
        const elem = e.target.value;
        this.inputNum(e);
        // elem < item.variant.from ? inputFrom.value = item.variant.from : ''
        this.changePrice('from', elem);
      };

      containerFrom.append(labelFrom, inputFrom);

      const containerTo = cElem('div', 'filter-from__wrapp');
      const labelTO = cElem('label', 'label');
      labelTO.innerText = 'To';
      const inputTo = cElem('input', 'filter-input');
      inputTo.value = item.variant.to;
      inputTo.oninput = (e) => {
        const elem = e.target.value;
        this.inputNum(e);
        elem > item.variant.to ? (inputTo.value = item.variant.to) : '';
        this.changePrice('to', elem);
      };
      containerTo.append(labelTO, inputTo);

      return [containerFrom, containerTo];
    }
  }

  const renderFilter = new RenderFilter();

  
});
