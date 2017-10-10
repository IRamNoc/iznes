package src.APITests.io.setl;

public class Container<T> {
  T item = null;

  public T getItem() {
    return item;
  }

  public void setItem(T item) {
    this.item = item;
  }


  public boolean isEmpty(){
    return item==null;
  }
}
