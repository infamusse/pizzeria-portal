import { select, settings, templates } from '../settings.js';
import { utils } from '../utils.js';
import CartProduct from './CartProduct.js';

class Cart {
  constructor(element) {
    const thisCart = this;
    thisCart.product = [];
    thisCart.deliveryFee = settings.cart.defaultDeliveryFee;
    thisCart.getElements(element);
    thisCart.initActions();
  }

  getElements(element) {
    const thisCart = this;
    thisCart.dom = [];
    thisCart.dom.wrapper = element;
    thisCart.dom.toggleTrigger = thisCart.dom.wrapper.querySelector(
      select.cart.toggleTrigger
    );
    thisCart.dom.productList = thisCart.dom.wrapper.querySelector(
      select.cart.productList
    );
    // console.log("thisCart.dom", thisCart.dom.productList);
    thisCart.renderTotalsKeys = [
      'totalNumber',
      'totalPrice',
      'subtotalPrice',
      'deliveryFee',
    ];
    thisCart.dom.form = thisCart.dom.wrapper.querySelector(select.cart.form);
    thisCart.dom.phone = thisCart.dom.wrapper.querySelector(select.cart.phone);
    thisCart.dom.address = thisCart.dom.wrapper.querySelector(
      select.cart.address
    );
    for (let key of thisCart.renderTotalsKeys) {
      thisCart.dom[key] = thisCart.dom.wrapper.querySelectorAll(
        select.cart[key]
      );
    }
  }

  initActions() {
    const thisCart = this;
    console.log('Init, thisCart', thisCart.dom.toggleTrigger);
    thisCart.dom.toggleTrigger.addEventListener('click', function(event) {
      event.preventDefault();
      thisCart.dom.wrapper.classList.toggle('active');
    });
    thisCart.dom.productList.addEventListener('updated', function() {
      thisCart.update();
    });
    thisCart.dom.productList.addEventListener('remove', function(event) {
      thisCart.remove(event.detail.cartProduct);
    });
    thisCart.dom.form.addEventListener('submit', function(event) {
      event.preventDefault();
      // const phoneNumber = parseInt(thisCart.dom.address.value);
      const phoneString = thisCart.dom.phone.value;
      const phoneNumber = parseInt(phoneString);
      const address = thisCart.dom.address.value;
      if (
        typeof phoneNumber == 'number' &&
        phoneNumber > 100000000 &&
        phoneString.length == 9
      ) {
        if (address != '') {
          thisCart.sendOrder();
          thisCart.removeAll();
        } else {
          alert('Wprowadź adres!');
        }
      } else {
        alert('Podaj prawidłowy numer telefonu! Powinien zawierać 9 cyfr.');
      }
    });
  }

  add(menuProduct) {
    const thisCart = this;
    console.log('menuProduct', menuProduct);
    const generatedHTML = templates.cartProduct(menuProduct);
    // console.log("generatedHTML", generatedHTML);
    thisCart.element = utils.createDOMFromHTML(generatedHTML);
    // const cartContainer = document.querySelector(thisCart.dom.productList);
    thisCart.dom.productList.appendChild(thisCart.element);
    // thisCart.CartProduct = new CartProduct(menuProduct, thisCart.element);
    thisCart.product.push(new CartProduct(menuProduct, thisCart.element));
    thisCart.update();
  }

  update() {
    const thisCart = this;
    thisCart.totalNumber = 0;
    thisCart.subtotalPrice = 0;
    for (let product of thisCart.product) {
      thisCart.totalNumber += product.amount;
      thisCart.subtotalPrice += product.price;
    }
    thisCart.totalPrice = thisCart.subtotalPrice + thisCart.deliveryFee;
    for (let key of thisCart.renderTotalsKeys) {
      for (let elem of thisCart.dom[key]) {
        elem.innerHTML = thisCart[key];
      }
    }
  }
  remove(cartProduct) {
    const thisCart = this;
    const index = thisCart.product.indexOf(cartProduct);
    // console.log("thisCart", thisCart.product.indexOf(cartProduct));
    thisCart.product.splice(index, 1);
    cartProduct.dom.wrapper.remove();
    thisCart.update();
  }

  removeAll() {
    const thisCart = this;
    thisCart.product.forEach(function(cartProduct) {
      cartProduct.dom.wrapper.remove();
    });
    thisCart.product = [];
    thisCart.update();
  }

  sendOrder() {
    const thisCart = this;
    const url = settings.db.url + '/' + settings.db.order;
    const payload = {
      address: thisCart.dom.address.value,
      phone: thisCart.dom.phone.value,
      totalNumber: thisCart.totalNumber,
      subtotalPrice: thisCart.subtotalPrice,
      totalPrice: thisCart.totalPrice,
      deliveryFee: thisCart.deliveryFee,
      product: [],
    };
    for (let product of thisCart.product) {
      const data = product.getData();
      payload.product.push(data);
      thisCart.remove(product);
    }
    console.log('thisCart.product', payload.product);

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    };

    fetch(url, options)
      .then(function(response) {
        return response.json();
      })
      .then(function(parsedResponse) {
        console.log('parsedResponse', parsedResponse);
      });
  }
}

export default Cart;
