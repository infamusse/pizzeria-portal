import { templates, select } from '../settings.js';
import { utils } from '../utils.js';
import amountWidget from './AmountWidget.js';

class Product {
  constructor(id, data) {
    const thisProduct = this;
    thisProduct.id = id;
    thisProduct.data = data;
    thisProduct.renderInMenu();
    thisProduct.getElements();
    thisProduct.initAccordion();
    thisProduct.initOrderForm();
    thisProduct.initAmountWidget();
    thisProduct.processOrder();
  }

  renderInMenu() {
    const thisProduct = this;

    const generateHTML = templates.menuProduct(thisProduct.data);
    thisProduct.element = utils.createDOMFromHTML(generateHTML);
    const menuContainer = document.querySelector(select.containerOf.menu);
    menuContainer.appendChild(thisProduct.element);
  }

  getElements() {
    const thisProduct = this;

    thisProduct.accordionTrigger = thisProduct.element.querySelector(
      select.menuProduct.clickable
    );
    thisProduct.form = thisProduct.element.querySelector(
      select.menuProduct.form
    );
    thisProduct.formInputs = thisProduct.form.querySelectorAll(
      select.all.formInputs
    );
    thisProduct.cartButton = thisProduct.element.querySelector(
      select.menuProduct.cartButton
    );
    thisProduct.priceElem = thisProduct.element.querySelector(
      select.menuProduct.priceElem
    );
    thisProduct.imageWrapper = thisProduct.element.querySelector(
      select.menuProduct.imageWrapper
    );
    thisProduct.amountWidgetElem = thisProduct.element.querySelector(
      select.menuProduct.amountWidget
    );
  }

  initAccordion() {
    const thisProduct = this;

    thisProduct.accordionTrigger.addEventListener('click', function() {
      event.preventDefault();
      thisProduct.element.classList.toggle('active');
      const productsActive = document.querySelectorAll('.product.active');
      for (let productActive of productsActive) {
        if (productActive != thisProduct.element) {
          productActive.classList.remove('active');
        }
      }
    });
  }
  initOrderForm() {
    const thisProduct = this;

    thisProduct.form.addEventListener('submit', function(event) {
      event.preventDefault();
      thisProduct.processOrder();
    });

    for (let input of thisProduct.formInputs) {
      input.addEventListener('change', function() {
        thisProduct.processOrder();
      });
    }

    thisProduct.cartButton.addEventListener('click', function(event) {
      event.preventDefault();
      thisProduct.processOrder();
      thisProduct.addToCart();
    });
  }
  initAmountWidget() {
    const thisProduct = this;
    thisProduct.amountWidget = new amountWidget(thisProduct.amountWidgetElem);
    thisProduct.amountWidgetElem.addEventListener('updated', function() {
      thisProduct.processOrder();
    });
    // console.log("thisProduct.amountWidget", thisProduct.amountWidget);
  }
  processOrder() {
    let thisProduct = this;
    const formData = utils.serializeFormToObject(thisProduct.form);
    thisProduct.params = {};
    let price = thisProduct.data.price;
    let params = thisProduct.data.params;
    for (let paramId in params) {
      const param = params[paramId];
      for (let optionId in param.options) {
        const option = param.options[optionId];
        const optionSelected =
          formData.hasOwnProperty(paramId) &&
          formData[paramId].indexOf(optionId) > -1;
        if (optionSelected && !option.default) {
          price += option.price;
        } else if (optionSelected == false && option.default) {
          price -= option.price;
        }
        // console.log("sprawdzenie", thisProduct.amountWidget.input.value);
        const activeImage = thisProduct.imageWrapper.querySelector(
          '.' + paramId + '-' + optionId
        );
        // console.log(activeImage);
        // const addImage =  imageWrapper.querySelector('[class*="' + checkedParams[checkedParam] + '"]');
        if (optionSelected == true && activeImage != null) {
          // console.log('dodajemy');
          activeImage.classList.add('active');
          if (!thisProduct.params[paramId]) {
            thisProduct.params[paramId] = {
              label: param.label,
              options: {},
            };
          }
          thisProduct.params[paramId].options[optionId] = option.label;
        } else if (optionSelected == false && activeImage != null) {
          // console.log('usuwamy');
          activeImage.classList.remove('active');
        }
      }
    }
    thisProduct.priceSingle = price;
    thisProduct.price =
      thisProduct.priceSingle * thisProduct.amountWidget.value;
    thisProduct.priceElem.innerHTML = thisProduct.price;
    // console.log(
    //   "cena ostateczna druga",
    //   thisProduct.id,
    //   thisProduct.priceElem,
    //   price
    // );
  }
  addToCart() {
    const thisProduct = this;
    console.log('thisProduct, addtocart', thisProduct);
    const event = new CustomEvent('add-to-cart', {
      bubbles: true,
      detail: {
        product: thisProduct,
      },
    });

    thisProduct.element.dispatchEvent(event);
  }
}

export default Product;
