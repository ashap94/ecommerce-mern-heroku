export const addItem = (item, next) => {
  let cart = [];
  if (typeof window !== undefined) {
    if (localStorage.getItem("cart")) {
      cart = JSON.parse(localStorage.getItem("cart"));
    }
    cart.push({
      ...item,
      category: item.category.name,
      count: 1,
    });

    cart = Array.from(new Set(cart.map((p) => p._id))).map((id) => {
      return cart.find((p) => p._id === id);
    });

    localStorage.setItem("cart", JSON.stringify(cart));
    next();
  }
};

export const itemTotal = () => {
  if (typeof window !== undefined) {
    if (localStorage.getItem("cart")) {
      return JSON.parse(localStorage.getItem("cart")).length;
    }
  }
  return 0;
};

export const getCart = () => {
  if (typeof window !== undefined) {
    if (localStorage.getItem("cart")) {
      return JSON.parse(localStorage.getItem("cart"));
    }
  }
  return [];
};

export const updateItem = (productId, count) => {
  if (typeof window !== undefined) {
    let cart = JSON.parse(localStorage.getItem("cart"));
    cart.forEach((p) => {
      if (p._id == productId) {
        p.count = count;
      }
    });

    localStorage.setItem("cart", JSON.stringify(cart));
  }
};

export const deleteItem = (productId) => {
  let cart = [];
  if (typeof window !== undefined) {
    if (localStorage.getItem("cart")) {
      cart = JSON.parse(localStorage.getItem("cart"));

      const updatedCart = cart.filter((product) => product._id != productId);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
    }
  }
  return cart;
};

export const emptyCart = (next) => {
  if (typeof window !== undefined) {
    localStorage.removeItem("cart");
    next();
  }
};
