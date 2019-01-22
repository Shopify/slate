---
layout: demo
---

<table class="responsive-table">
  <thead class="small--hide">
    <tr>
      <th colspan="2">Product</th>
      <th>Price</th>
      <th>Quantity</th>
      <th>Total</th>
    </tr>
  </thead>
  <tbody>
    <tr class="responsive-table-row">
      <td data-label="Product">
        Image
      </td>
      <td>
        <a href="#">Product title</a>
        <a href="#">
          <small>Remove</small>
        </a>
      </td>
      <td data-label="Price">
        $25.99
      </td>
      <td data-label="Quantity">
        <input type="number"
               name="updates[]"
               id="updates_key"
               value="1"
               min="0"
               aria-label="Quantity">
      </td>
      <td data-label="Total">
        $25.99
      </td>
    </tr>
    <tr class="responsive-table-row">
      <td data-label="Product">
        Image
      </td>
      <td>
        <a href="#">Product title</a>

        <a href="#">
          <small>Remove</small>
        </a>
      </td>
      <td data-label="Price">
        $19.99
      </td>
      <td data-label="Quantity">
        <input type="number"
               name="updates[]"
               id="updates_key"
               value="2"
               min="0"
               aria-label="Quantity">
      </td>
      <td data-label="Total">
        $39.98
      </td>
    </tr>
  </tbody>
</table>
