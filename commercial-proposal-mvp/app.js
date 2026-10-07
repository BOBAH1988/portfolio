"use strict";

console.log("Commercial Proposal MVP loaded");

const PRODUCTS = [
  {
    id: "demo-001",
    article: "DEMO-001",
    name: "Демонстрационный товар 1",
    unit: "шт.",
    price: 25000
  },
  {
    id: "demo-002",
    article: "DEMO-002",
    name: "Демонстрационный товар 2",
    unit: "шт.",
    price: 1200
  },
  {
    id: "demo-003",
    article: "DEMO-003",
    name: "Демонстрационный товар 3",
    unit: "кг.",
    price: null
  },
  {
    id: "demo-004",
    article: "DEMO-004",
    name: "Демонстрационный товар 4",
    unit: "шт.",
    price: 8900
  },
  {
    id: "demo-005",
    article: "DEMO-005",
    name: "Демонстрационный товар 5",
    unit: "м.",
    price: 340
  },
  {
    id: "demo-006",
    article: "DEMO-006",
    name: "Демонстрационный товар 6",
    unit: "шт.",
    price: 5990
  },
  {
    id: "demo-007",
    article: "DEMO-007",
    name: "Демонстрационный товар 7",
    unit: "шт.",
    price: 1500
  }
];

const draft = [];
const notifications = document.querySelector(".notifications");

const $ = (selector) => document.querySelector(selector);

function formatPrice(value) {
  if (value === null || value === undefined || value === "") {
    return "—";
  }
  return value.toLocaleString("ru-RU") + " ₽";
}

function sumCell(price, quantity) {
  if (price === null || price === undefined || price === "" || quantity === "") {
    return "—";
  }
  const num = Number(quantity);
  if (!Number.isFinite(num) || num <= 0) {
    return "—";
  }
  return (price * num).toLocaleString("ru-RU") + " ₽";
}

function createDraftRow(product) {
  const row = document.createElement("li");
  row.className = "draft-item";

  const status = document.createElement("span");
  status.className = "draft-status";
  status.textContent = "ожидает количества";

  const quantity = document.createElement("input");
  quantity.type = "text";
  quantity.inputMode = "numeric";
  quantity.placeholder = "введите количество";
  quantity.dataset.productId = product.id;

  const sum = document.createElement("span");
  sum.className = "draft-sum";
  sum.textContent = "—";

  const message = document.createElement("span");
  message.className = "draft-message";
  message.textContent = "";

  const remove = document.createElement("button");
  remove.type = "button";
  remove.className = "draft-remove";
  remove.textContent = "Удалить";
  remove.dataset.productId = product.id;

  row.appendChild(status);
  row.appendChild(quantity);
  row.appendChild(sum);
  row.appendChild(message);
  row.appendChild(remove);

  quantity.addEventListener("input", () => {
    const num = Number(quantity.value);
    if (/^\d+$/.test(quantity.value)) {
      sum.textContent = sumCell(product.price, quantity.value);
      message.textContent = "";
      status.textContent = "готово";
      status.className = "draft-status ok";
    } else if (quantity.value === "" || quantity.value === "0") {
      sum.textContent = "—";
      message.textContent = "Количество пустое или равно нулю.";
      status.textContent = "ошибка";
      status.className = "draft-status error";
    } else if (num < 0) {
      sum.textContent = "—";
      message.textContent = "Количество не может быть отрицательным.";
      status.textContent = "ошибка";
      status.className = "draft-status error";
    } else {
      sum.textContent = "—";
      message.textContent = "Количество должно быть целым числом.";
      status.textContent = "ошибка";
      status.className = "draft-status warning";
    }
  });

  remove.addEventListener("click", () => {
    const index = draft.findIndex((item) => item.product.id === product.id);
    if (index !== -1) {
      draft.splice(index, 1);
      render();
    }
  });

  return row;
}

function addProductToDraft(product) {
  const already = draft.some((item) => item.product.id === product.id);
  if (already) {
    showNotification("Товар уже добавлен в черновик.", "warning");
    return;
  }
  if (product.price === null) {
    showNotification("У товара нет цены. Сумма не рассчитывается.", "warning");
  }
  draft.push({ product });
  render();
}

function render() {
  const catalog = $(".catalog");
  const list = $(".draft-list");
  const empty = $(".draft-empty");

  catalog.innerHTML = "";
  list.innerHTML = "";

  PRODUCTS.forEach((product) => {
    const item = document.createElement("div");
    item.className = "catalog-item";

    const article = document.createElement("div");
    article.className = "catalog-field";
    article.textContent = product.article;

    const name = document.createElement("div");
    name.className = "catalog-field";
    name.textContent = product.name;

    const price = document.createElement("div");
    price.className = "catalog-field";
    price.textContent = formatPrice(product.price);

    const unit = document.createElement("div");
    unit.className = "catalog-field";
    unit.textContent = product.unit;

    const add = document.createElement("button");
    add.type = "button";
    add.className = "catalog-add";
    add.textContent = "Добавить в КП";
    add.dataset.productId = product.id;

    item.appendChild(article);
    item.appendChild(name);
    item.appendChild(price);
    item.appendChild(unit);
    item.appendChild(add);
    catalog.appendChild(item);

    add.addEventListener("click", () => addProductToDraft(product));
  });

  if (draft.length === 0) {
    empty.hidden = false;
    list.hidden = true;
  } else {
    empty.hidden = true;
    list.hidden = false;
    draft.forEach((item) => list.appendChild(createDraftRow(item.product)));
  }
}

function showNotification(message, type) {
  const existing = document.querySelector(".notification-message");
  if (existing) {
    existing.remove();
  }
  const node = document.createElement("div");
  node.className = "notification-message " + type;
  node.textContent = message;
  notifications.appendChild(node);
  setTimeout(() => {
    node.remove();
  }, 4000);
}

render();
