type ContentAreaProps = {
  itemList: Product[];
  onAddtoBasket: (product: Product) => void;
};

type Product = {
  id: number;
  name: string;
  price: number;
  category: string;
  quantity: number;
  rating: number;
  image_link: string;
};

export const ProductList = (props: ContentAreaProps) => {
  return (
    <div id="productList">
      {props.itemList.map((item) => {
        const outOfStock = item.quantity === 0;
        return (
          <div key={item.name} className="product">
            <div className="product-top-bar">
              <h2>{item.name}</h2>
              <p>
                {" "}
                £{item.price.toFixed(2)} ({item.rating}/5)
              </p>
            </div>
            <img src={"Assets/Product_Images/" + item.image_link}></img>
            <button
              value={item.id}
              onClick={() => props.onAddtoBasket(item)}
              disabled={outOfStock}
            >
              {outOfStock ? "Out of stock" : "Add to basket"}
            </button>
          </div>
        );
      })}
    </div>
  );
};
