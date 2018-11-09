package SETLAPIHelpers;

import java.lang.reflect.Array;

public class Container<T> {
  T item = null;
  private Array items;

  public T getItem() {
    return item;
  }

  public void setItem(T item) {
    this.item = item;
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
