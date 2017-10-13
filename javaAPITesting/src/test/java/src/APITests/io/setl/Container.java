package src.APITests.io.setl;

import java.lang.reflect.Array;

public class Container<T> {
  T item = null;
  private Array items;

  public T getItem() {
    return item;
  }

  public void setItem(String item) {
    this.item = (T) item;
  }


  public boolean isEmpty(){
    return item==null;
  }

  public void setItems(Array items) {
    this.items = items;
  }

  public Array getItems() {
    return items;
  }
}
