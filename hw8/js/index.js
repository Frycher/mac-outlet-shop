var mySwiper = new Swiper('.swiper-container', {
  direction: 'horizontal',
  loop: true,
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
})



const cElem = (tag, className, text) => {
  const elem = document.createElement(tag)
  elem.className = className || '';
  elem.innerText = text || '';
  return elem
}
const gElem = (param) => {
  const elem = document.querySelector(param);
  elem.clear = function () {
    this.innerHTML = '';
    return this;
  }
  elem.add = function (listOfElems) {
    this.append(...listOfElems);
    return this;
  }
  return elem;
}

const listContainer = gElem('.cards');


const renderCard = (device) => {
  const container = cElem('div', 'card');
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
        ${ device.orderInfo.inStock >= 1 ? 
          `<div class="ico">
            <img src="img/icons/stock.svg" alt="stock">
          </div>` : 
          `
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
      ${ device.orderInfo.inStock >= 1 ? `
          <button class="card__btn">Add to cart</button>
        ` : `
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


  `
  container.innerHTML = template
  return container
}

const renderCards = (list) => {
  const elems = list.map(item => renderCard(item));
  listContainer.clear().add(elems);

}
renderCards(items);


// class Filter {
//   constructor() {
//     this.renderItems = [...items];

//     this.config = {
//       searchVal: '',
//       sortVal: '',
//     }

//   }
//   filterByName(value) {
//     value = value.toLowerCase();
//     this.config.searchVal = value
//     this.renderItems = items.filter((item) => {
//       const name = item.name.toLowerCase();
//       return name.includes(value);
//     })
//     this.sortItems()

//     renderCards(this.renderItems);
//   }

//   sortItems(value = this.config.sortVal) {
//     this.config.sortVal = value
//     if (value === 'def') {
//       this.filterByName()
//       return;
//     }
//     this.renderItems.sort((a, b) => {
//       if (a.price > b.price) return value === 'asc' ? -1 : 1
//       if (a.price < b.price) return value === 'asc' ? 1 : -1
//       return 0;
//     })
//     renderCards(this.renderItems)
//   }

// }

// const filter = new Filter();

// gElem('input[id="deviceInp"]').oninput = (e) => filter.filterByName(e.target.value);
// gElem('select[id="sortDevices"]').oninput = (e) => filter.sortItems(e.target.value);