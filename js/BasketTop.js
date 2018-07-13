/** Класс описывающий корзину с товарами в шапке сайта. */
class BasketTop {
  /** Констурктор */
  constructor() {
    // Элемент контейнера для товаров в корзине.
    this.$goods = $('#containerBasketTop');
    // Селектор кнопки Удалить товар из корзины.
    this.selectorRemove = '.fa-times-circle';
    // Селектор кнопки Добавить товар в корзину.
    this.selectorAdd = '.prod-item__cart';
    // Элемент контейнера на пиктограмме корзины для отображения количества товаров.
    this.$elemGoods = $('#totalGoodsTop');
    // Элемент контейнера в корзине для отображения общей суммы товаров.
    this.$elemAmount = $('#totalAmountTop');
    // Ключ к объекту корзины в локальном хранилище Storage.
    this.keyBasket = 'basket';
    // Путь к файлу json с данными о товарах в корзине.
    this.pathJsonBasket = 'json/basket_get.json';
    // Общее количество товаров.
    this.totalGoods = 0;
    // Общая стоимость товаров.
    this.totalAmount = 0;
    // Массив для хранения товаров.
    this.basketItems = [];

    // Получаем данные о товарах в корзине, и добавляем их на страницу.
    this.getDataAndRenderBasket();

    // Инициализируем обрабочик события по кнопке удалить товар.
    this.$goods.on('click', this.selectorRemove, event => this.removeGood(event));

    // Инициализируем обрабочик события по кнопке добавить товар.
    $('body').on('click', this.selectorAdd, event => this.addGood(event));
  }

  // Получаем данные о товарах в корзине и отрисовываем их на странице.
  getDataAndRenderBasket() {
    if (sessionStorage.getItem(this.keyBasket)) {
      // Если локальное хранилище существует, то получаем из него данные.
      let jsonBasket = sessionStorage.getItem(this.keyBasket);
      let objBasket = JSON.parse(jsonBasket);

      // Изменяем общую сумму и общее количество товаров в корзине.
      this.totalGoods = objBasket['goods'];
      this.totalAmount = objBasket['amount'];

      // Перебераем в цикле данные о товаре полученные из json файла,
      // и добавляем их в массив.
      for (let i = 0; i < objBasket['basket'].length; i++) {
        this.basketItems.push(objBasket['basket'][i]);
      }
      // Отрисовываем товар в корзине.
      this.render();
    } else {
      // Если локальное хранилище не существует, то вызываем
      // метод, который получит данные, поместит их в локальное хранилище.
      this.getAjaxProduct();
    }
  }

  /** Метод получает данные из json файла, и вызывает метод, который обрабатывает их. */
  getAjaxProduct() {
    // Делаем ajax запрос, чтобы получить список товаров из json файла.
    $.ajax({
      type: 'GET',
      url: this.pathJsonBasket,
      dataType: 'json',
      context: this,
      // В случае успех вызываем метод, который обработает полученные данные.
      success: data => this.setDataFromJson(data),
      // В случае ошибки выводим в консоль сообщение.
      error: function (error) {
        console.error('Ошибка при получении списка товаров.', error);
      }
    });
  }

  // Метод изменяет значения переменных: totalGoods, totalAmount, basketItems на
  // данные полученные из json файла. И вызывает метод отрисовывающий товары в корзине.
  setDataFromJson(data) {
    // Изменяем общую сумму и общее количество товаров в корзине.
    this.totalGoods = data['goods'];
    this.totalAmount = data['amount'];

    // Перебераем в цикле данные о товаре полученные из json файла,
    // и добавляем их в массив.
    for (let i = 0; i < data['basket'].length; i++) {
      this.basketItems.push(data['basket'][i]);
    }

    // // Создаем объект с данными о товаре в корзине.
    // let myJson = {
    //   "basket": this.basketItems,
    //   "goods": this.totalGoods,
    //   "amount": this.totalAmount
    // };
    // // Преобразуйте объект в JSON перед сохранением.
    // myJson = JSON.stringify(myJson);
    // // И сохраняем их в session storage.
    // sessionStorage.setItem('basket', myJson);

    // Перезаписываем данные в локальном хранилище sessionStorage.
    this.setSessionStorage();

    // Отрисовываем товар в корзине.
    this.render();
  }

  /** Метод перезаписываем данные в локальном хранилище sessionStorage. */
  setSessionStorage() {
    // Создаем объект с данными о товаре в корзине.
    let myJson = {
      "basket": this.basketItems,
      "goods": this.totalGoods,
      "amount": this.totalAmount
    };
    // Преобразуйте объект в JSON перед сохранением.
    myJson = JSON.stringify(myJson);
    // И сохраняем их в session storage.
    sessionStorage.setItem('basket', myJson);
  }

  // Метод отрисовывает товоры в корзине.
  render() {
    // Изменяем общее количество товаров на иконке корзины.
    this.$elemGoods.text(this.totalGoods);
    // Изменяем общую сумму товаров в корзине.
    this.$elemAmount.text(`$${this.totalAmount}`);

    // Очищаем контейнер корзины.
    this.$goods.html('');

    // Получаем количество элементов в массиве.
    let lenghtBasketItem = this.basketItems.length;


    // Если в корзине отсутствуют товары то выводим сообщение.
    if (lenghtBasketItem === 0) {
      // Создаем контейнер с сообщением, что товаров в корзине нет.
      let $elemBasketEmpty = $('<div/>', {
        class: 'hr-cart-item',
        text: 'Ваша корзина пуста.'
      });
      // Добавляем элемент в контейнер корзины на странице.
      this.$goods.append($elemBasketEmpty);
    } else {
      // Обходим в цикле все товары и добавляем их на страницу.
      for (let i = 0; i < lenghtBasketItem; i++) {
        // Создаем контейнер для элемента товара.
        let $elemContainer = $('<div/>', {
          class: 'hr-cart-item',
          'data-id-prod': this.basketItems[i]['id']
        });

        // Создаем контейнер ссылку для изображения.
        let $elemLinkImg = $('<a/>', {
          href: 'single.html',
        });

        // Создаем изображение товара.
        let elemImage = new Image();
        $(elemImage).attr({
          src: `images/prod/${this.basketItems[i]['img']}`
        });

        // ДОбавляем изображение в контейнер ссылку.
        $elemLinkImg.append($(elemImage));

        // Создаем ссылку с названием товара.
        let $elemLinkName = $('<a/>', {
          href: 'single.html',
          text: this.basketItems[i]['name']
        });

        // Создаем элемент с рейтингом.
        let $elemRating = $('<div class="rating">' +
          '<i class="fas fa-star"></i>' +
          '<i class="fas fa-star"></i>' +
          '<i class="fas fa-star"></i>' +
          '<i class="fas fa-star"></i>' +
          '<i class="far fa-star"></i>' +
          '</div>');

        // Создаем элемент ценой.
        let $elemPrice = $('<p class="price">' + this.basketItems[i]['count']
          + '<span> x </span>' + this.basketItems[i]['price']
          * this.basketItems[i]['count'] + '</p>');

        // Создаем контейнер для названия, рейтинга и цены, и добавляем их в него.
        let $elemDivNRP = $('<div/>');
        $elemDivNRP.append($elemLinkName);
        $elemDivNRP.append($elemRating);
        $elemDivNRP.append($elemPrice);

        // Создаем элемент Удалить товар.
        let $elemRemove = $('<a href="#"><i class="fas fa-times-circle"></i></a>');

        // Собираем наш элемент товара.
        $elemContainer.append($elemLinkImg);
        $elemContainer.append($elemDivNRP);
        $elemContainer.append($elemRemove);

        // Добавляем собранный элемент в контейнер корзины на странице.
        this.$goods.append($elemContainer);
      }
    }
  }

  /**
   * Метод удаляет товар из корзины.
   * @param event - Событие.
   */
  removeGood(event) {
    // Отменяем действие браузера по умолчанию.
    event.preventDefault();

    // Получаем id удаляемого элемента.
    let idProd = parseInt($(event.target).parents('.hr-cart-item').attr('data-id-prod'));

    // В оригинальном коде здесь должен быть ajax запрос, чтобы удалить товар
    // из базы данных и возвратить результат, и в случае успешного удаления,
    // должны выполнится действия описанные ниже.

    // Обходим в цикле массив с товарами в корзине.
    for (let i = 0; i < this.basketItems.length; i++) {
      // Если id товара в корзине совпадает с id удаляемого товара, то
      if (this.basketItems[i]['id'] === idProd) {
        // Если количество товаров в корзине с данным id равно 1, то изменяем
        // значения и удаляем его, иначе, просто изменяем значения.
        if (this.basketItems[i]['count'] === 1) {
          // Изменяем общее количество товаров на иконке корзины.
          this.totalGoods--;
          // Изменяем общую сумму товаров в корзине.
          this.totalAmount -= this.basketItems[i]['price'];
          // Удаляем из массива элемент с текущим индексом.
          this.basketItems.splice(i, 1);
        } else {
          // Изменяем общее количество товаров на иконке корзины.
          this.totalGoods--;
          // Изменяем общую сумму товаров в корзине.
          this.totalAmount -= this.basketItems[i]['price'];
          // Изменяем количество данного товара в корзине.
          this.basketItems[i]['count']--;
        }
      }
    }

    // Перезаписываем данные в локальном хранилище sessionStorage.
    this.setSessionStorage();
    // Перерисовываем корзину.
    this.render();
  }

  /**
   * Метод добавляет товар в корзину.
   * @param event - Событие.
   */
  addGood(event) {
    // Отменяем действие браузера по умолчанию.
    event.preventDefault();

    // Получаем id добавляемого элемента.
    let idProd = parseInt($(event.target).parents('.prod-item').attr('data-id-prod'));

    // В оригинальном коде здесь должен быть ajax запрос, чтобы добавит товар
    // в базу данных и возвратить в случае успеха данные о товаре,
    // и только после этого должны выполнится действия описанные ниже.

    // Обходим в цикле массив с товарами в корзине.
    for (let i = 0; i < this.basketItems.length; i++) {
      // Если id товара в корзине совпадает с id удаляемого товара, то
      // свойство count увеличиваем на 1, перезаписываем sessionStorage,
      // перерисовываем корзину и выходим из функции.
      if (this.basketItems[i]['id'] === idProd) {
        // Изменяем общее количество товаров на иконке корзины.
        this.totalGoods++;
        // Изменяем общую сумму товаров в корзине.
        this.totalAmount += this.basketItems[i]['price'];
        // Изменяем количество данного товара в корзине.
        this.basketItems[i]['count']++;
        // Перезаписываем данные в локальном хранилище sessionStorage.
        this.setSessionStorage();
        // Перерисовываем корзину.
        this.render();
        // Выходим из функции.
        return;
      }
    }

    // Если товара с добавляемым id нету в массиве с товарами,
    // то создаем объект добавляемого товара.
    let newBasketItems = {
      "id": idProd,
      "name": "Mango People T-shirt",
      "img": `prod-${idProd}.jpg`,
      "price": 52.00,
      "count": 1
    };

    // Добавляем новый товар в массив с товарами.
    this.basketItems.push(newBasketItems);
    // Изменяем общее количество товаров на иконке корзины.
    this.totalGoods++;
    // Изменяем общую сумму товаров в корзине.
    this.totalAmount += 52.00;

    // Перезаписываем данные в локальном хранилище sessionStorage.
    this.setSessionStorage();
    // Перерисовываем корзину.
    this.render();
  }
}