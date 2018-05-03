---
layout: demo
---

<style>
  .modal {
    display: none;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #f1f1f1;
    padding: 1em;
  }

  .is-active {
    display: block;
  }
</style>

<script>
  $(function() {
    var $modal = $('#Modal');

    $('#TriggerModal').on('click', function() {
      $modal.addClass('is-active');

      slate.a11y.trapFocus({
        $container: $modal,
        namespace: 'modal',
        $elementToFocus: $modal.find('input[type="text"]')
      });
    });

    $('#CloseModal').on('click', function() {
      $modal.removeClass('is-active');

      slate.a11y.removeTrapFocus({
        $container: $modal,
        namespace: 'modal'
      });
    });
  });
</script>

<p>
  <button id="TriggerModal">Trigger modal</button>
</p>
<p>Here is some normal page content. There are some links and inputs below to tab through before opening the modal.</p>

<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. In erat mauris, faucibus quis <a href="#">pharetra sit amet</a>, pretium ac libero. Etiam vehicula eleifend bibendum. Morbi gravida metus ut sapien condimentum sodales mollis augue sodales. Vestibulum quis quam at sem placerat aliquet. Curabitur a felis at sapien ullamcorper fermentum. Mauris molestie arcu et lectus iaculis sit amet eleifend eros posuere. Fusce nec porta orci.</p>

<p>
  <input type="text" placeholder="Placeholder text">
  <input type="email" placeholder="Placeholder email">
</p>

<div id="Modal" class="modal">
  <p>
    <button id="CloseModal">Close modal</button>
  </p>

  <p>This is the modal content. Below are some links and inputs that you can tab through.</p>

  <p>
    <input type="text" placeholder="Placeholder text">
    <input type="email" placeholder="Placeholder email">
  </p>
</div>
