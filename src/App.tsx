import { useState, useEffect } from "react";
import { ProductList } from "./Components/ProductList";
import itemList from "../public/Assets/random_products_175.json";
import "./e-commerce-stylesheet.css";

type Product = {
  id: number;
  name: string;
  price: number;
  category: string;
  quantity: number;
  rating: number;
  image_link: string;
};
type Basket = {
  product: Product;
  quantity: number;
};

function App() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchedProducts, setSearchedProducts] = useState<Product[]>(itemList);
  const [sortingOpt, setSortingOpt] = useState<string>("AtoZ");
  const [quantityCheck, setQuantityCheck] = useState<boolean>(false);
  const [addBasket, setAddBasket] = useState<Basket[]>([]);

  // ===== Hooks =====
  useEffect(
    () => updateSearchedProducts(),
    [searchTerm, sortingOpt, quantityCheck]
  );

  // ===== Basket management =====
  function showBasket() {
    let areaObject = document.getElementById("shopping-area");
    if (areaObject !== null) {
      areaObject.style.display = "block";
    }
  }

  function hideBasket() {
    let areaObject = document.getElementById("shopping-area");
    if (areaObject !== null) {
      areaObject.style.display = "none";
    }
  }

  function addToBasket(product: Product) {
    setAddBasket(function (prevBasket) {
      let foundItem = null;
      for (let i = 0; i < prevBasket.length; i++) {
        if (prevBasket[i].product.id === product.id) {
          foundItem = prevBasket[i];
          break;
        }
      }
      if (foundItem != null) {
        // if product is already inside the basket, add more quantity
        let updateBasket = [];

        for (let i = 0; i < prevBasket.length; i++) {
          const item = prevBasket[i];

          if (item.product.id === product.id) {
            updateBasket.push({
              product: item.product,
              quantity: item.quantity + 1,
            });
          } else {
            updateBasket.push(item);
          }
        }
        return updateBasket;
      } else {
        //add quantity 1 to the basket if product is not in basket
        return [
          ...prevBasket,
          {
            product: product,
            quantity: 1,
          },
        ];
      }
    });
  }
  function itemRemoval(product: Product) {
    setAddBasket((prevBasket) => {
      const updatedBasket: Basket[] = [];

      for (let i = 0; i < prevBasket.length; i++) {
        const item = prevBasket[i];

        if (item.product.id === product.id) {
          if (item.quantity > 1) {
            updatedBasket.push({
              product: item.product,
              quantity: item.quantity - 1,
            });
          }
        } else {
          updatedBasket.push(item);
        }
      }
      return updatedBasket;
    });
  }

  // ===== Search =====
  function updateSearchedProducts() {
    let holderList: Product[] = [...itemList];

    if (searchTerm !== "") {
      holderList = holderList.filter((product: Product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (quantityCheck) {
      holderList = holderList.filter((product) => product.quantity > 0);
    }
    switch (sortingOpt) {
      case "ZtoA":
        holderList.sort((a, z) => z.name.localeCompare(a.name));
        break;
      case "AtoZ":
        holderList.sort((a, z) => a.name.localeCompare(z.name));
        break;
      case "£LtoH":
        holderList.sort((l, h) => l.price - h.price);
        break;
      case "£HtoL":
        holderList.sort((l, h) => h.price - l.price);
        break;
      case "*LtoH":
        holderList.sort((l, h) => l.rating - h.rating);
        break;
      case "*HtoL":
        holderList.sort((l, h) => h.rating - l.rating);
        break;
    }
    setSearchedProducts(holderList);
  }

  // ===== Result Notification =====
  function getResultIndicator(): string {
    const count = searchedProducts.length;

    if (searchTerm === "") {
      if (count === 1) {
        return "1 Product";
      } else {
        return count + " Products";
      }
    } else {
      if (count === 0) {
        return "No search results found";
      } else if (count === 1) {
        return "1 Result";
      } else {
        return count + " Results";
      }
    }
  }

  return (
    <div id="container">
      <div id="logo-bar">
        <div id="logo-area">
          <img src="Assets/logo.png"></img>
        </div>
        <div id="shopping-icon-area">
          <img
            id="shopping-icon"
            onClick={showBasket}
            src="Assets/shopping-basket.png"
          ></img>
        </div>
      </div>
      <div id="shopping-area">
        <div id="exit-area">
          <p id="exit-icon" onClick={hideBasket}>
            x
          </p>
        </div>
        {addBasket.length === 0 ? (
          <p>Your basket is empty</p>
        ) : (
          <div>
            {addBasket.map((item) => (
              <div className="shopping-row" key={item.product.id}>
                <div className="shopping-information">
                  <p>
                    {item.product.name} (£{item.product.price.toFixed(2)}) -{" "}
                    {item.quantity}
                  </p>
                </div>
                <button onClick={() => itemRemoval(item.product)}>
                  Remove
                </button>
              </div>
            ))}
            <p>
              Total: £
              {addBasket
                .reduce(
                  (total, item) => total + item.product.price * item.quantity,
                  0
                )
                .toFixed(2)}
            </p>
          </div>
        )}
      </div>
      <div id="search-bar">
        <input
          type="text"
          placeholder="Search..."
          onChange={(changeEventObject) =>
            setSearchTerm(changeEventObject.target.value)
          }
        ></input>
        <div id="control-area">
          <select
            value={sortingOpt}
            onChange={(a) => {
              setSortingOpt(a.target.value);
            }}
          >
            <option value="AtoZ">By name (A - Z)</option>
            <option value="ZtoA">By name (Z - A)</option>
            <option value="£LtoH">By price (low - high)</option>
            <option value="£HtoL">By price (high - low)</option>
            <option value="*LtoH">By rating (low - high)</option>
            <option value="*HtoL">By rating (high - low)</option>
          </select>
          <input
            id="inStock"
            type="checkbox"
            checked={quantityCheck}
            onChange={(a) => setQuantityCheck(a.target.checked)}
          ></input>
          <label htmlFor="inStock">In stock</label>
        </div>
      </div>
      <p id="results-indicator">{getResultIndicator()}</p>
      <ProductList itemList={searchedProducts} onAddtoBasket={addToBasket} />
    </div>
  );
}
export default App;
