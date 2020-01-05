import { select } from '../settings.js';
import amountWidget from './AmountWidget.js';

class CartProduct {
  constructor(menuProduct, element) {
    const thisCartProduct = this;
    thisCartProduct.id = menuProduct.id;
    thisCartProduct.name = menuProduct.data.name;
    thisCartProduct.amount = menuProduct.amountWidget.value;
    thisCartProduct.priceSingle = menuProduct.priceSingle;
    thisCartProduct.price =
      thisCartProduct.priceSingle * thisCartProduct.amount;
    thisCartProduct.params = JSON.parse(JSON.stringify(menuProduct.params));
    thisCartProduct.getElements(element);
    thisCartProduct.initActions();
    thisCartProduct.initAmountWidget();
  }

  getElements(element) {
    const thisCartProduct = this;
    thisCartProduct.dom = {};
    thisCartProduct.dom.wrapper = element;
    thisCartProduct.dom.amountWidget = thisCartProduct.dom.wrapper.querySelector(
      select.cartProduct.amountWidget
    );
    thisCartProduct.dom.price = thisCartProduct.dom.wrapper.querySelector(
      select.cartProduct.price
    );
    thisCartProduct.dom.edit = thisCartProduct.dom.wrapper.querySelector(
      select.cartProduct.edit
    );
    thisCartProduct.dom.remove = thisCartProduct.dom.wrapper.querySelector(
      select.cartProduct.remove
    );
  }
  getData() {
    const thisCartProduct = this;
    const productData = {
      id: thisCartProduct.id,
      price: thisCartProduct.price,
      priceSingle: thisCartProduct.priceSingle,
      amount: thisCartProduct.amount,
      params: JSON.parse(JSON.stringify(thisCartProduct.params)),
    };

    return productData;
  }

  initActions() {
    const thisCartProduct = this;

    thisCartProduct.dom.edit.addEventListener('click', function(event) {
      event.preventDefault();
    });
    thisCartProduct.dom.remove.addEventListener('click', function(event) {
      event.preventDefault();
      //   console.log('testEventRemove', thisCartProduct);
      thisCartProduct.remove();
    });
  }

  initAmountWidget() {
    const thisCartProduct = this;
    thisCartProduct.amountWidget = new amountWidget(
      thisCartProduct.dom.amountWidget
    );
    thisCartProduct.dom.amountWidget.addEventListener('updated', function() {
      thisCartProduct.price =
        thisCartProduct.priceSingle * thisCartProduct.amountWidget.value;
      thisCartProduct.dom.price.innerText = thisCartProduct.price;
    });
  }
  remove() {
    const thisCartProduct = this;
    const event = new CustomEvent('remove', {
      bubbles: true,
      detail: {
        cartProduct: thisCartProduct,
      },
    });
    thisCartProduct.dom.wrapper.dispatchEvent(event);
  }
}

export default CartProduct;
